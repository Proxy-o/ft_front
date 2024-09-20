from rest_framework.decorators import api_view
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from .models import Game, Tournament, Invitation
from django.db.models import Q
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializers import GameSerializer, TournamentSerializer, InvitationSerializer
from rest_framework import permissions
from authentication.customJWTAuthentication import CustomJWTAuthentication
from .gameConsumer import WebsocketConsumer
from asgiref.sync import async_to_sync
from django.shortcuts import get_object_or_404
from channels.layers import get_channel_layer
import datetime
from rest_framework.pagination import PageNumberPagination
import json

User = get_user_model()


class InvitationView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def get(self, request):
        # print("get invitation")
        user = request.user
        invitations = Invitation.objects.filter(receiver=user)
        serializer = InvitationSerializer(invitations, many=True)
        return Response(serializer.data)

    def post(self, request):
        # print("post invitation")
        sender_id = request.user.id
        receiver_id = request.data.get('receiver')
        type = request.data.get('gameType')
        try:
            sender = User.objects.get(id=sender_id)
            receiver = User.objects.get(id=receiver_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # check if the receiver is already is a friend
        if receiver not in sender.friends.all():
            return Response({'error': 'This user is not your friend'}, status=status.HTTP_403_FORBIDDEN)
        previousInvitations = Invitation.objects.filter((Q(sender=sender) & Q(receiver=receiver) & Q(
            is_accepted=None)) | (Q(sender=receiver) & Q(receiver=sender) & Q(is_accepted=None))).last()
        if previousInvitations and (previousInvitations.is_accepted != True and previousInvitations.is_accepted != False):
            previousInvitations.delete()
        # sender_game = Game.objects.filter(Q(user1=sender) | Q(user2=sender) | Q(user3=sender) | Q(
        #     user4=sender)).filter(winner=None).filter(type=type).last()
        receiver_game = Game.objects.filter(Q(user1=receiver) | Q(user2=receiver) | Q(user3=receiver) | Q(
            user4=receiver)).filter(winner=None).last()
        if receiver_game:
            return Response({'error': 'Player already in a game'}, status=status.HTTP_403_FORBIDDEN)
        invitation = Invitation(sender=sender, receiver=receiver, type=type)
        invitation.save()
        
        serializer = InvitationSerializer(invitation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class GetInvitationsView(APIView):
    # get all invitations for the user
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def get(self, request):
        # print("get invitations")
        user = request.user
        invitations = Invitation.objects.filter(
            receiver=user, is_accepted=None).order_by('timestamp').reverse()
        serializer = InvitationSerializer(
            invitations, context={'request': request}, many=True)
        return Response(serializer.data)


def joinGame(player1, player2, type):
    # print("join game")
    game = Game.objects.filter(Q(user1=player1) | Q(user2=player1) | Q(user3=player1) | Q(user4=player1)).filter(
        type=type).filter(winner=None).filter(Q(user1=None) | Q(user2=None) | Q(user3=None) | Q(user4=None)).last()
    if not game:
        game = Game(user1=player1, user2=player2, type=type)
        game.save()
        return game
    else:
        if game.user1 == None:
            game.user1 = player2
        elif game.user2 == None:
            game.user2 = player2
        elif game.user3 == None:
            game.user3 = player2
        elif game.user4 == None:
            game.user4 = player2
        game.save()
        return game


class AcceptInvitationView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def post(self, request):
        # print("accept invitation")
        user = request.user
        invitation_id = request.data.get('invitationId')
        try:
            invitation = Invitation.objects.get(id=invitation_id)
        except Invitation.DoesNotExist:
            return Response({'error': 'Invitation not found'}, status=status.HTTP_404_NOT_FOUND)

        if invitation.receiver != user:
            return Response({'error': 'You are not the receiver of this invitation'}, status=status.HTTP_403_FORBIDDEN)
        if invitation.sender not in user.friends.all():
            return Response({'error': 'This user is not your friend'}, status=status.HTTP_403_FORBIDDEN)
        if invitation.type == "two":
            sender_game = Game.objects.filter(Q(user1=invitation.sender) | Q(user2=invitation.sender) | Q(user3=invitation.sender) | Q(
                user4=invitation.sender)).filter(winner=None).last()
            if sender_game:
                invitation.delete()
                return Response({'error': 'Player already in a game'}, status=status.HTTP_403_FORBIDDEN)
        receiver_game = Game.objects.filter(Q(user1=user) | Q(user2=user) | Q(user3=user) | Q(
            user4=user)).filter(winner=None).filter(type=invitation.type).last()
        if receiver_game:
            invitation.delete()
            return Response({'error': 'You are already in a game'}, status=status.HTTP_403_FORBIDDEN)
        game = Game.objects.filter(Q(user1=user) | Q(user2=user) | Q(
            user3=user) | Q(user4=user)).filter(winner=None).filter(type=invitation.type).last()
        if game:
            if game.type == "two":
                type = "1 VS 1"
            elif game.type == "four":
                type = "2 VS 2"
            invitation.delete()
            return Response({'error': f'You are already in a {type} game'}, status=status.HTTP_403_FORBIDDEN)
        invitation.is_accepted = True
        invitation.save()
        if invitation.type == "two":
            game = createGame(invitation.sender, invitation.receiver, "two")
        elif invitation.type == "four":
            game = joinGame(invitation.sender, invitation.receiver, "four")

        # set status to playing 
        invitation.sender.status = "playing"
        invitation.receiver.status = "playing"
        invitation.sender.save()
        invitation.receiver.save()

        return Response(
            {
                'message': 'Invitation accepted',
                'gameId': game.id
            },
            status=status.HTTP_200_OK)


class DeclineInvitationView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def post(self, request):
        # print("decline invitation")
        user = request.user
        invitation_id = request.data.get('invitationId')
        try:
            invitation = Invitation.objects.get(id=invitation_id)
        except Invitation.DoesNotExist:
            return Response({'error': 'Invitation not found'}, status=status.HTTP_404_NOT_FOUND)

        if invitation.receiver != user:
            return Response({'error': 'You are not the receiver of this invitation'}, status=status.HTTP_403_FORBIDDEN)

        invitation.is_accepted = False
        invitation.save()

        return Response({'message': 'Invitation declined'}, status=status.HTTP_200_OK)


def get_invitations(user):
    # print("get invitations")
    invitations = Invitation.objects.filter(receiver=user, is_accepted=None)
    return invitations


def createGame(player1, player2, type):
    # print("create game")
    game = Game(user1=player1, user2=player2, type=type)
    game.save()
    return game


class OnGoingGame(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def get(self, request):
        # print("get ongoing game")
        username = request.user
        user = User.objects.get(username=username)
        game = Game.objects.filter((Q(user1=user) | Q(user2=user)) & Q(
            winner=None) & Q(type="two")).last()
        if not game:
            user.status = "online"
            user.save()
            return Response({'message': 'No ongoing game found', 'game': 'null'}, status=status.HTTP_204_NO_CONTENT)
        user.status = "playing"
        game.save()
        serializer = GameSerializer(game)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OnGoingTournamentGame(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def get(self, request, tournament_id):
        # print("get ongoing tournament game")
        user = request.user
        tournament = Tournament.objects.filter(
            (Q(user1=user) & Q(user1_left=False)) |
            (Q(user2=user) & Q(user2_left=False)) |
            (Q(user3=user) & Q(user3_left=False)) |
            (Q(user4=user) & Q(user4_left=False))
        ).filter(winner=None).last()
        if not tournament or tournament_id != tournament.id:
            return Response({'error': 'No ongoing tournament found', 'game': 'null'}, status=status.HTTP_204_NO_CONTENT)
        game = None
        if tournament.semi1 and not tournament.semi1.winner and (tournament.semi1.user1 == user or tournament.semi1.user2 == user):
            game = tournament.semi1
        elif tournament.semi2 and not tournament.semi2.winner and (tournament.semi2.user1 == user or tournament.semi2.user2 == user):
            game = tournament.semi2
        elif tournament.final and not tournament.final.winner and (tournament.final.user1 == user or tournament.final.user2 == user):
            game = tournament.final
        serializer = GameSerializer(game)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OnGoingFourGame(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def get(self, request):
        # print("get ongoing four game")
        user = request.user
        try:
            game = Game.objects.filter(Q(user1=user) | Q(user2=user) | Q(user3=user) | Q(
                user4=user)).filter(type="four").filter(winner=None).latest('timestamp')
        except Game.DoesNotExist:
            return Response({'error': 'No ongoing game found', 'game': 'null'}, status=status.HTTP_204_NO_CONTENT)
        serializer = GameSerializer(game)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateGameFour(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def post(self, request):
        # print("create game four")
        user = request.user
        try:
            # game = Game.objects.filter(Q(user1=user) | Q(user2=user) | Q(user3=user) | Q(user4=user)).filter(type="four").filter(winner=None).latest('timestamp')
            # if game:
            #     return Response({'message': 'Game already exists'}, status=status.HTTP_200_OK)
            # else:
            game = Game(user1=user, type="four")
            game.save()
            return Response({'message': 'Game created'}, status=status.HTTP_201_CREATED)
        except Game.DoesNotExist:
            return Response({'message': 'could not create game'}, status=status.HTTP_400_BAD_REQUEST)


class OnGoingFourGame(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def get(self, request):
        # print("get ongoing four game")
        user = request.user
        try:
            game = Game.objects.filter(Q(user1=user) | Q(user2=user) | Q(user3=user) | Q(
                user4=user)).filter(type="four").filter(winner=None).latest('timestamp')
        except Game.DoesNotExist:
            return Response({'error': 'No ongoing game found', 'game': 'null'}, status=status.HTTP_204_NO_CONTENT)
        serializer = GameSerializer(game)
        return Response(serializer.data, status=status.HTTP_200_OK)


class EndGame(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def post(self, request):
        # print("end game")
        winner_id = request.data.get('winner')
        loser_id = request.data.get('loser')
        winner_score = request.data.get('winnerScore')
        loser_score = request.data.get('loserScore')
        game = Game.objects.filter(
            Q(user1=winner_id) | Q(user2=winner_id) &
            Q(user1=loser_id) | Q(user2=loser_id)).filter(winner=None).last()
        if not game:
            return Response({'error': 'No ongoing game found'}, status=status.HTTP_204_NO_CONTENT)
        user1 = game.user1
        user2 = game.user2
        game.winner = user1 if user1.id == winner_id else user2
        game.user1_score = winner_score if user1.id == winner_id else loser_score
        game.user2_score = winner_score if user2.id == winner_id else loser_score
        game.save()
        # async_to_sync(channel_layer.group_send)(
        #     f'game_{game.id}',
        #     {
        #         'type': 'send_message',
        #         'message': '/end',
        #         'gameId': game.id
        #     }
        # )
        
        if game.type == "tournament":
            print("tournament")
            tournament = Tournament.objects.get(
                Q(semi1=game) | Q(semi2=game) | Q(final=game))
            if game == tournament.semi1:
                if not tournament.final.user1:
                    tournament.final.user1 = game.winner
                    tournament.final.save()
                
                # if final enemy left before finishing the semi1
                if tournament.user3 == tournament.semi2.winner and tournament.user3_left:
                    tournament.final.winner = tournament.final.user1
                    tournament.winner = tournament.final.winner
                if tournament.user4 == tournament.semi2.winner and tournament.user4_left:
                    tournament.final.winner = tournament.final.user1
                    tournament.winner = tournament.final.winner    
                tournament.final.user1_score = 10
                tournament.final.save()
                tournament.save()
            elif game == tournament.semi2:
                if not tournament.final.user2:
                    tournament.final.user2 = game.winner
                    tournament.final.save()
                # if final enemy left before finishing the semi2
                if tournament.user1 == tournament.semi1.winner and tournament.user1_left:
                    tournament.final.winner = tournament.final.user2
                    tournament.winner = tournament.final.winner
                if tournament.user2 == tournament.semi1.winner and tournament.user2_left:
                    tournament.final.winner = tournament.final.user2
                    tournament.winner = tournament.final.winner
                tournament.final.user2_score = 10
                tournament.final.save()
                tournament.save()
            elif game == tournament.final:
                tournament.winner = tournament.final.winner
                tournament.save()
                return Response({'message': 'Tournament ended', 'tournamentId': tournament.id}, status=status.HTTP_200_OK)
            return Response({'message': 'Game ended', 'tournamentId': tournament.id}, status=status.HTTP_200_OK)
        return Response({'message': 'Game ended'}, status=status.HTTP_200_OK)


class EndGameFour(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def post(self, request):
        # print("end game four")
        winner_id = request.data.get('winner')
        loser_id = request.data.get('loser')
        winner_score = request.data.get('winnerScore')
        loser_score = request.data.get('loserScore')
        game = Game.objects.filter(
            Q(user1=winner_id) | Q(user2=winner_id) | Q(user3=winner_id) | Q(user4=winner_id)).filter(
            Q(user1=loser_id) | Q(user2=loser_id) | Q(user3=loser_id) | Q(user4=loser_id)).filter(winner=None).last()
        if not game:
            return Response({'error': 'No ongoing game found'}, status=status.HTTP_204_NO_CONTENT)
        game.winner = User.objects.get(id=winner_id)
        game.user1_score = winner_score
        game.user2_score = loser_score
        game.save()
        return Response({'message': 'Game ended'}, status=status.HTTP_200_OK)


class Surrender(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def send_message(self, event):
        # print("send message")
        self.send(text_data=json.dumps(event))

    def post(self, request):
        # print("surrender")
        # channel_layer = get_channel_layer()
        username = request.user
        user = User.objects.get(username=username)
        game = Game.objects.filter(Q(user1=user) | Q(user2=user) | Q(
            user3=user) | Q(user4=user)).filter(winner=None).last()
        if not game:
            return Response({'error': 'No ongoing game found'}, status=status.HTTP_204_NO_CONTENT)
        if game.type == 'two' or game.type == 'tournament':
            if game.user1 == user:
                game.winner = game.user2
                game.user2_score = 10
                game.user1_score = 0
            else:
                game.winner = game.user1
                game.user1_score = 10
                game.user2_score = 0
            game.save()
        if game.type == 'four':
            if game.user1 == user or game.user3 == user:
                game.winner = game.user2
                game.user2_score = 10
                game.user1_score = 0
            elif game.user2 == user or game.user4 == user:
                game.winner = game.user1
                game.user1_score = 10
                game.user2_score = 0
            game.save()
            return Response({'message': 'Game ended', 'gameId': game.id}, status=status.HTTP_200_OK)
        if game.type == "tournament":
            tournament = Tournament.objects.get(
                Q(semi1=game) | Q(semi2=game) | Q(final=game))
            if game == tournament.semi1:
                tournament.final.user1 = game.winner
                tournament.final.save()
                if (tournament.semi2.winner == tournament.user3 and tournament.user3_left) or (tournament.semi2.winner == tournament.user4 and tournament.user4_left):
                    tournament.final.winner = tournament.final.user1
                    tournament.winner = tournament.final.winner
            elif game == tournament.semi2:
                tournament.final.user2 = game.winner
                tournament.final.save()
                if (tournament.semi1.winner == tournament.user1 and tournament.user1_left) or (tournament.semi1.winner == tournament.user2 and tournament.user2_left):
                    tournament.final.winner = tournament.final.user2
                    tournament.winner = tournament.final.winner
            elif game == tournament.final:
                tournament.winner = tournament.final.winner
            tournament.semi1.save()
            tournament.semi2.save()
            tournament.final.save()
            tournament.save()
            
                # return Response({'message': 'Tournament ended', 'tournamentId': tournament.id}, status=status.HTTP_200_OK)
            return Response({'message': 'Game ended', 'gameId': game.id, 'tournamentId': tournament.id}, status=status.HTTP_200_OK)

        return Response({'message': 'Game ended'}, status=status.HTTP_200_OK)


class LeaveGame(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def post(self, request):
        print("leave game")
        username = request.user
        user = User.objects.get(username=username)
        game = Game.objects.filter(Q(user1=user) | Q(user2=user) | Q(
            user3=user) | Q(user4=user)).filter(winner=None).last()
        if not game:
            return Response({'error': 'No ongoing game found'}, status=status.HTTP_204_NO_CONTENT)
        if game.type == 'two':
            # remove the game from the database
            game.delete()
        elif game.type == 'four':
            if game.user1 == user:
                game.user1 = None
            elif game.user2 == user:
                game.user2 = None
            elif game.user3 == user:
                game.user3 = None
            elif game.user4 == user:
                game.user4 = None
            if game.user1 == None and game.user2 == None and game.user3 == None and game.user4 == None:
                game.delete()
                print("game deleted")
            else:
                game.save()
        return Response({'message': 'Game left'}, status=status.HTTP_200_OK)


class OnGoingTournamentView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def get(self, request):
        print("get ongoing tournament")
        user = request.user
        tournament = Tournament.objects.filter(
            (Q(user1=user) & Q(user1_left=False)) |
            (Q(user2=user) & Q(user2_left=False)) |
            (Q(user3=user) & Q(user3_left=False)) |
            (Q(user4=user) & Q(user4_left=False))
        ).filter(winner=None).last()
        if not tournament or (tournament.user1 and tournament.user1.username == user.username and tournament.user1_left) or (tournament.user2 and tournament.user2.username == user.username and tournament.user2_left) or (tournament.user3 and tournament.user3.username == user.username and tournament.user3_left) or (tournament.user4 and tournament.user4.username == user.username and tournament.user4_left):
            print("no ongoing tournament")
            return Response({'error': 'No ongoing tournament found'}, status=status.HTTP_204_NO_CONTENT)
        serializer = TournamentSerializer(tournament)
        return Response(serializer.data, status=status.HTTP_200_OK)

class TournamentView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def get(self, request, tournament_id):
        user = request.user
        tournaments = Tournament.objects.filter(id=tournament_id).last()
        if not tournaments:
            return Response({'error': 'No ongoing tournament found'}, status=status.HTTP_204_NO_CONTENT)
        serializer = TournamentSerializer(tournaments)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # print("post tournament")
        userid = request.user
        user = User.objects.get(id=userid.id)
        semi1 = Game(user1=user, type="tournament")
        semi1.save()
        semi2 = Game(type="tournament")
        semi2.save()
        final = Game(type="tournament")
        final.save()
        tournament = Tournament(creator=user, user1=user,
                                semi1=semi1, semi2=semi2, final=final)
        tournament.save()
        serializer = TournamentSerializer(tournament)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class DeleteTournament(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def post(self, request):
        print("delete tournament")
        tournament_id = request.data.get('tournamentId')
        try:
            tournament = Tournament.objects.get(id=tournament_id)
        except Tournament.DoesNotExist:
            return Response({'error': 'Tournament not found'}, status=status.HTTP_404_NOT_FOUND)
        if tournament.semi1:
            tournament.semi1.delete()
        if tournament.semi2:
            tournament.semi2.delete()
        if tournament.final:
            tournament.final.delete()
        tournament.delete()
        return Response({'message': 'Tournament deleted'}, status=status.HTTP_200_OK)


class LeaveTournament(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def post(self, request):
        # print("leave tournament")
        user = request.user
        tournamentId = request.data.get('tournamentId')
        tournament = Tournament.objects.get(id=tournamentId)
        if not tournament:
            return Response({'error': 'No ongoing tournament found'}, status=status.HTTP_204_NO_CONTENT)
        if user == tournament.user1:
            tournament.user1_left = True
        elif user == tournament.user2:
            tournament.user2_left = True
        elif user == tournament.user3:
            tournament.user3_left = True
        elif user == tournament.user4:
            tournament.user4_left = True
        if (tournament.semi1.user1 == user or tournament.semi1.user2 == user) and not tournament.semi1.winner:
            if tournament.semi1.user1 == user:
                tournament.user2_score = 10
                tournament.semi1.winner = tournament.semi1.user2
                tournament.final.user1 = tournament.semi1.user2
            elif tournament.semi1.user2 == user:
                tournament.user1_score = 10
                tournament.semi1.winner = tournament.semi1.user1
                tournament.final.user1 = tournament.semi1.user1
            if tournament.final.user2 and ((tournament.final.user2 == tournament.user3 and tournament.user3_left) or (tournament.final.user2 == tournament.user4 and tournament.user4_left)):
                tournament.final.winner = tournament.final.user1
                tournament.winner = tournament.final.winner
        elif (tournament.semi2.user1 == user or tournament.semi2.user2 == user) and not tournament.semi2.winner:
            if tournament.semi2.user1 == user:
                tournament.user4_score = 10
                tournament.semi2.winner = tournament.semi2.user2
                tournament.final.user2 = tournament.semi2.user2
            elif tournament.semi2.user2 == user:
                tournament.user3_score = 10
                tournament.semi2.winner = tournament.semi2.user1
                tournament.final.user2 = tournament.semi2.user1
            if tournament.final.user1 and ((tournament.final.user1 == tournament.user1 and tournament.user1_left) or (tournament.final.user1 == tournament.user2 and tournament.user2_left)):
                tournament.final.winner = tournament.final.user2
                tournament.winner = tournament.final.winner
        elif (tournament.final.user1 == user or tournament.final.user2 == user) and not tournament.final.winner:
            if tournament.final.user1 == user:
                tournament.final.winner = tournament.final.user2
                tournament.winner = tournament.final.winner
            elif tournament.final.user2 == user:
                tournament.final.winner = tournament.final.user1
                tournament.winner = tournament.final.winner
        tournament.semi1.save()
        tournament.semi2.save()
        tournament.final.save()
        tournament.save()
        return Response({'message': 'Tournament left'}, status=status.HTTP_200_OK)


class AcceptInvitationTournament(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def post(self, request):
        # print("accept invitation tournament")
        user = request.user
        invitation_id = request.data.get('invitationId')

        invitation = Invitation.objects.get(id=invitation_id)
        # if invitation does not exist
        if not invitation:
            return Response({'error': 'Invitation not found'}, status=status.HTTP_404_NOT_FOUND)
        sender = invitation.sender
        # if the sender is not a friend
        if sender not in user.friends.all():
            return Response({'error': 'This user is not your friend'}, status=status.HTTP_403_FORBIDDEN)
        invitation.is_accepted = True
        invitation.save()
        user_tournament = Tournament.objects.filter(
            Q(user1=user) | Q(user2=user) | Q(user3=user) | Q(user4=user)).filter(winner=None).last()
        if user_tournament:
            return Response({'error': 'You are already in a tournament'}, status=status.HTTP_200_OK)
        tournament = Tournament.objects.filter(
            Q(user1=sender) | Q(user2=sender) | Q(user3=sender) | Q(user4=sender)).filter(winner=None).last()
        # if tournament does not exist
        if not tournament:
            return Response({'error': 'No ongoing tournament found'}, status=status.HTTP_204_NO_CONTENT)
        if user == tournament.user1 or user == tournament.user2 or user == tournament.user3 or user == tournament.user4:
            return Response({'error': 'User already in the tournament'}, status=status.HTTP_200_OK)
        # if there is already 4 players
        if tournament.user1 and tournament.user2 and tournament.user3 and tournament.user4:
            return Response({'error': 'Tournament is full'}, status=status.HTTP_200_OK)
        if not tournament.user1 and not tournament.semi1.user1:
            tournament.user1 = user
            tournament.semi1.user1 = user
            tournament.semi1.save()
        elif not tournament.user2 and not tournament.semi1.user2:
            tournament.user2 = user
            tournament.semi1.user2 = user
            tournament.semi1.save()
        elif not tournament.user3 and not tournament.semi2.user1:
            tournament.user3 = user
            tournament.semi2.user1 = user
            tournament.semi2.save()
        elif not tournament.user4 and not tournament.semi2.user2:
            tournament.user4 = user
            tournament.semi2.user2 = user
            tournament.semi2.save()

        tournament.save()
        return Response({'message': 'Invitation accepted', 'tournamentId': tournament.id}, status=status.HTTP_200_OK)


class StartTournament(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def post(self, request): 
        # print("start tournament")
        user = request.user
        tournament_id = request.data.get('tournamentId')
        tournament = Tournament.objects.get(id=tournament_id)
        if not tournament:
            return Response({'error': 'No ongoing tournament found'}, status=status.HTTP_204_NO_CONTENT)
        if user.id != tournament.creator.id:
            return Response({'error': 'You are not the creator of this tournament'}, status=status.HTTP_403_FORBIDDEN)
        if not tournament.user1 or not tournament.user2 or not tournament.user3 or not tournament.user4:
            return Response({'error': 'Not enough players'}, status=status.HTTP_400_BAD_REQUEST)
        user1_on_goin_game = Game.objects.filter(Q(user1=tournament.user1) | Q(user2=tournament.user1) | Q(user3=tournament.user1) | Q(user4=tournament.user1)).filter(winner=None).last()
        user2_on_goin_game = Game.objects.filter(Q(user1=tournament.user2) | Q(user2=tournament.user2) | Q(user3=tournament.user2) | Q(user4=tournament.user2)).filter(winner=None).last()
        user3_on_goin_game = Game.objects.filter(Q(user1=tournament.user3) | Q(user2=tournament.user3) | Q(user3=tournament.user3) | Q(user4=tournament.user3)).filter(winner=None).last()
        user4_on_goin_game = Game.objects.filter(Q(user1=tournament.user4) | Q(user2=tournament.user4) | Q(user3=tournament.user4) | Q(user4=tournament.user4)).filter(winner=None).last()
        if user1_on_goin_game or user2_on_goin_game or user3_on_goin_game or user4_on_goin_game:
            return Response({'error': 'Players already in a game'}, status=status.HTTP_400_BAD_REQUEST) #todo:test this
        tournament.started = True
        tournament.save()
        return Response({'message': 'Tournament started', 'tournamentId': tournament.id}, status=status.HTTP_200_OK)


class UserGamesPagination(PageNumberPagination):
    page_size = 1


class UserGames(APIView):
    """
    Retrieve all games of a user
    """
    permission_classes = [permissions.IsAuthenticated]

    pagination_class = UserGamesPagination

    def get(self, request, user_id, format=None):
        user = get_object_or_404(User, pk=user_id)
        games = Game.objects.filter(Q(user1=user) | Q(user2=user)).filter(
            type='two').exclude(winner=None).order_by('timestamp').reverse()
        paginator = self.pagination_class()
        paginated_games = paginator.paginate_queryset(games, request)

        serializer = GameSerializer(paginated_games, many=True)

        return paginator.get_paginated_response(serializer.data)


class TwoVTwoGameView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]
    pagination_class = UserGamesPagination

    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        if request.user in user.blocked.all():
            return Response({'detail': 'You are blocked by this user'}, status=status.HTTP_400_BAD_REQUEST)
        games = Game.objects.filter(((Q(user1=user) | Q(user2=user) | Q(user3=user) | Q(
            user4=user)) & Q(type='four'))).exclude(winner=None).order_by('timestamp').reverse()
        paginator = self.pagination_class()
        paginated_games = paginator.paginate_queryset(games, request)

        serializer = GameSerializer(
            paginated_games, many=True, context={'request': request})

        return paginator.get_paginated_response(serializer.data)


class TournamentsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]
    pagination_class = UserGamesPagination

    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        if request.user in user.blocked.all():
            return Response({'detail': 'You are blocked by this user'}, status=status.HTTP_400_BAD_REQUEST)

        tournaments = Tournament.objects.filter(
            (Q(user1=user)) |
            (Q(user2=user)) |
            (Q(user3=user)) |
            (Q(user4=user))
        ).exclude(final=None).order_by('timestamp').reverse()
        paginator = self.pagination_class()
        paginated_tournaments = paginator.paginate_queryset(
            tournaments, request)
        serializer = TournamentSerializer(
            paginated_tournaments, many=True, context={'request': request})

        return paginator.get_paginated_response(serializer.data)


class GamesStates(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

# send win loses for 1v1 2v2 and tournament
    def oneVoneState(user_id):
        user = get_object_or_404(User, id=user_id)
        games = Game.objects.filter(
            Q(user1=user) | Q(user2=user)).filter(type='two')
        wins = 0
        loses = 0
        for game in games:
            if game.winner == user:
                wins += 1
            else:
                loses += 1
        return wins, loses

    def twoVtwoState(user_id):
        user = get_object_or_404(User, id=user_id)
        games = Game.objects.filter(Q(user1=user) | Q(user2=user) | Q(
            user3=user) | Q(user4=user)).filter(type='four')
        wins = 0
        loses = 0
        for game in games:
            if game.winner == user:
                wins += 1
            else:
                loses += 1
        return wins, loses

    def tournamentState(user_id):
        user = get_object_or_404(User, id=user_id)
        tournaments = Tournament.objects.filter(
            (Q(user1=user)) |
            (Q(user2=user)) |
            (Q(user3=user)) |
            (Q(user4=user))
        ).exclude(final=None)
        wins = 0
        loses = 0
        for tournament in tournaments:
            if tournament.winner == user:
                wins += 1
            else:
                loses += 1
        return wins, loses

    def get(self, request, user_id):
        oneVoneWins, oneVoneLoses = GamesStates.oneVoneState(user_id)
        twoVtwoWins, twoVtwoLoses = GamesStates.twoVtwoState(user_id)
        tournamentWins, tournamentLoses = GamesStates.tournamentState(user_id)
        return Response({
            'oneVoneWins': oneVoneWins,
            'oneVoneLoses': oneVoneLoses,
            'twoVtwoWins': twoVtwoWins,
            'twoVtwoLoses': twoVtwoLoses,
            'tournamentWins': tournamentWins,
            'tournamentLoses': tournamentLoses
        }, status=status.HTTP_200_OK)
