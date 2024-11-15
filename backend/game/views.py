from rest_framework.decorators import api_view
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from .models import Game, Invitation
from django.db.models import Q
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializers import GameSerializer, InvitationSerializer
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
            user3=user) | Q(user4=user)).filter(winner=None).last()
        if game:
            if game.type == "two":
                game_type = "1 VS 1"
            elif game.type == "four":
                game_type = "2 VS 2"
                
            invitation.delete()
            return Response({'error': f'You are already in a {game_type} game'}, status=status.HTTP_403_FORBIDDEN)
        invitation.is_accepted = True
        invitation.save()
        other_invitations = Invitation.objects.filter(Q(sender=user) | Q(receiver=user) & Q(is_accepted=None))
        for other_invitation in other_invitations:
            other_invitation.delete()
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
        user = request.user
        game = Game.objects.filter((Q(user1=user) | Q(user2=user)) & Q(winner=None) & Q(type="two")).last()
        if not game:
            user.status = "online"
            user.save()
            return Response({'message': 'No ongoing game found', 'game': 'null'}, status=status.HTTP_204_NO_CONTENT)
        user.status = "playing"
        game.save()
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
            user.status = "playing"
            user.save()
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
            (
                Q(user1=winner_id) | Q(user2=winner_id)
            ) & (
                Q(user1=loser_id) | Q(user2=loser_id)
            ) & Q(user2__isnull=False)
        ).filter(winner=None).last()
        if not game:
            return Response({'error': 'No ongoing game found'}, status=status.HTTP_204_NO_CONTENT)
        user1 = game.user1
        user2 = game.user2
        if user1.id == winner_id:
            game.winner = user1
            user1.score += 1
            user2.score -= 1
        else:
            game.winner = user2
            user2.score += 1
            user1.score -= 1
        
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
        
        game.user1.status = "online"
        game.user1.save()
        game.user2.status = "online"
        game.user2.save()
        if game.user3:
            game.user3.status = "online"
            game.user3.save()
        if game.user4:
            game.user4.status = "online"
            game.user4.save()
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
        if game.user1.id == winner_id:
            game.user1.score += 1
            game.user2.score -= 1
            game.user3.score += 1
            game.user4.score -= 1
        elif game.user2.id == winner_id:
            game.user2.score += 1
            game.user1.score -= 1
            game.user3.score += 1
            game.user4.score -= 1
        game.user1_score = winner_score
        game.user2_score = loser_score
        game.save()
        game.user1.status = "online"
        game.user1.save()
        game.user2.status = "online"
        game.user2.save()
        game.user3.status = "online"
        game.user3.save()
        game.user4.status = "online"
        game.user4.save()
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
        user = request.user
        game_id = request.data.get('gameId')
        game = Game.objects.get(id=game_id)
        if not game:
            return Response({'error': 'No ongoing game found'}, status=status.HTTP_204_NO_CONTENT)
        if game.type == 'two':
            if game.user1 == user:
                game.user1.score -= 1
                game.user2.score += 1
                game.winner = game.user2
                game.user2_score = 3.0000
                game.user1_score = 0
                game.save()
            else:
                game.user2.score -= 1
                game.user1.score += 1
                game.winner = game.user1
                game.user1_score = 3.0000
                game.user2_score = 0
                game.save()
            game.user1.status = "online"
            game.user1.save()
            game.user2.status = "online"
            game.user2.save()
        if game.type == 'four':
            if game.user1 == user or game.user3 == user:
                game.user1.score -= 1
                game.user2.score += 1
                game.user3.score -= 1
                game.user4.score += 1
                game.winner = game.user2
                game.user2_score = 3.0000
                game.user1_score = 0
            elif game.user2 == user or game.user4 == user:
                game.user2.score -= 1
                game.user1.score += 1
                game.user4.score -= 1
                game.user3.score += 1
                game.winner = game.user1
                game.user1_score = 3.0000
                game.user2_score = 0
            game.save()
            game.user1.status = "online"
            game.user1.save()
            game.user2.status = "online"
            game.user2.save()
            game.user3.status = "online"
            game.user3.save()
            game.user4.status = "online"
            game.user4.save()
            return Response({'message': 'Game ended', 'gameId': game.id}, status=status.HTTP_200_OK)
        game.user1.status = "online"
        game.user1.save()
        game.user2.status = "online"
        game.user2.save()
        return Response({'message': 'Game ended', 'gameId': game.id}, status=status.HTTP_200_OK)



class LeaveGame(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def post(self, request):
        # print("leave game")
        username = request.user
        user = User.objects.get(username=username)
        game = Game.objects.filter(Q(user1=user) | Q(user2=user) | Q(
            user3=user) | Q(user4=user)).filter(winner=None).last()
        game_id = game.id
        if not game:
            return Response({'error': 'No ongoing game found'}, status=status.HTTP_204_NO_CONTENT)
        if game.type == 'two':
            game.user1.status = "online"
            game.user1.save()
            game.user2.status = "online"
            game.user2.save()
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
            users = [game.user1, game.user2, game.user3, game.user4]
            num_of_players = 0
            for auser in users:
                if auser:
                    num_of_players += 1
                    
            if num_of_players <= 1:
                for auser in users:
                    if auser:
                        auser.status = "online"
                        auser.save()
                game.delete()
            else:
                game.save()
            user.status = "online"
            user.save()
        return Response({'message': 'Game left', 'gameId': game_id}, status=status.HTTP_200_OK)

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

    # def tournamentState(user_id):
    #     user = get_object_or_404(User, id=user_id)
    #     tournaments = Tournament.objects.filter(
    #         (Q(user1=user)) |
    #         (Q(user2=user)) |
    #         (Q(user3=user)) |
    #         (Q(user4=user))
    #     ).exclude(final=None)
    #     wins = 0
    #     loses = 0
    #     for tournament in tournaments:
    #         if tournament.winner == user:
    #             wins += 1
    #         else:
    #             loses += 1
    #     return wins, loses

    def get(self, request, user_id):
        oneVoneWins, oneVoneLoses = GamesStates.oneVoneState(user_id)
        twoVtwoWins, twoVtwoLoses = GamesStates.twoVtwoState(user_id)
        # tournamentWins, tournamentLoses = GamesStates.tournamentState(user_id)
        return Response({
            'oneVoneWins': oneVoneWins,
            'oneVoneLoses': oneVoneLoses,
            'twoVtwoWins': twoVtwoWins,
            'twoVtwoLoses': twoVtwoLoses,
            # 'tournamentWins': tournamentWins,
            # 'tournamentLoses': tournamentLoses
        }, status=status.HTTP_200_OK)
