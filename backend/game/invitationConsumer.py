import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.db.models import Q
from django.contrib.auth import get_user_model
from .models import Invitation, Game, Tournament
import datetime

User = get_user_model()


class InvitationConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = None
        self.user_inbox = None
        self.tournement_inbox = None

    def connect(self):
        self.user = self.scope['user']
        print("connecting in invitation consumer")
        if self.user.is_anonymous:
            print("User not authenticated")
            self.close(401)
            return
        self.user_inbox = f'inbox_{self.user.username}'
        self.accept()
        print("connected in invitation consumer")

        if self.user.is_authenticated:
            async_to_sync(self.channel_layer.group_add)(
                self.user_inbox,
                self.channel_name,
            )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        if not self.user.is_authenticated:
            self.send_error('User not authenticated')
            return

        split = message.split(' ')
        command = split[0]
        # print(command)
        if command == '/notif':
            self.handle_notif(split)
        elif command == '/accept':
            self.handle_accept(split)
        elif command == '/refetchPlayers':
            self.handle_refetch_players(split)
        elif command == '/acceptTournament':
            self.handle_accept_tournament(split)
        elif command == '/leaveGame':
            self.handle_leave_game(split)
        elif command == '/startTournament':
            self.handle_start_tournament(split)
        elif command == '/refetchTournament':
            self.handle_refetch_tournament(split)
        elif command == '/decline':
            self.handle_decline(split)

# todo: check if user is friend with sender     done, to be tested
    def disconnect(self, close_code):
        if self.user.is_authenticated:
            async_to_sync(self.channel_layer.group_discard)(
                self.user_inbox,
                self.channel_name,
            )

    def send_message(self, event):
        self.send(text_data=json.dumps(event))

    def send_error(self, message):
        self.send(text_data=json.dumps(
            {'status': 'error', 'message': message}))

    def handle_notif(self, split):
        import datetime
        time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        receiver = User.objects.get(id=split[2])
        if not receiver:
            return
        async_to_sync(self.channel_layer.group_send)(
            f'inbox_{receiver.username}',
            {'type': 'send_message', 'user': self.user.username,
                'message': ' '.join(split) + ' ' + time}
        )

    def handle_accept(self, split):
        game_id = split[1]
        game = Game.objects.get(id=game_id)
        if not game:
            return
        if game.user1:
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{game.user1.username}',
                {'type': 'send_message', 'user': self.user.username,
                    'message': f'/start {game_id}'}
            )
        if game.user2:
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{game.user2.username}',
                {'type': 'send_message', 'user': self.user.username,
                    'message': f'/start {game_id}'}
            )
        if game.user3:
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{game.user3.username}',
                {'type': 'send_message', 'user': self.user.username,
                    'message': f'/start {game_id}'}
            )
        if game.user4:
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{game.user4.username}',
                {'type': 'send_message', 'user': self.user.username,
                    'message': f'/start {game_id}'}
            )
        self.send(text_data=json.dumps({'status': 'success'}))

    def handle_refetch_players(self, split):
        # print(split)
        game = Game.objects.filter(id=split[1]).last()
        if not game:
            return
        time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        participants = []
        if game.type == 'two':
            participants = [game.user1, game.user2]
        elif game.type == 'four':
            participants = [game.user1, game.user2, game.user3, game.user4]
        elif game.type == 'tournament':
            tournament = Tournament.objects.filter(Q(semi1=game) | Q(semi2=game) | Q(final=game)).filter(
                Q(user1=self.user) | Q(user2=self.user) | Q(user3=self.user) | Q(user4=self.user)).last()
            if not tournament:
                return
            participants = [tournament.user1, tournament.user2,
                            tournament.user3, tournament.user4]
        for participant in participants:
            if participant:
                async_to_sync(self.channel_layer.group_send)(
                    f'inbox_{participant.username}',
                    {
                        'type': 'send_message',
                        'user': self.user.username,
                        'message': f'/refetchPlayers {game.id} {time}'
                    }
                )

    def handle_accept_tournament(self, split):
        # print("Accepting tournament")
        id = split[1]
        # print('toooornament ', id)
        tournament = Tournament.objects.get(id=id)
        if not tournament:
            return
        # check this is working todo
        # print(id)
        # if not tournament:
            # print("Tournament not found")
        # if tournament.user1:
            # print("User1")
            # print(tournament.user1_left)
            # print(tournament.user1.username)
        if tournament.user1 and tournament.user1_left == False:
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{tournament.user1.username}',
                {'type': 'send_message', 'user': self.user.username,
                    'message': f'/acceptTournament {tournament.id}'}
            )
        if tournament.user2 and tournament.user2_left == False:
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{tournament.user2.username}',
                {'type': 'send_message', 'user': self.user.username,
                    'message': f'/acceptTournament {tournament.id}'}
            )
        if tournament.user3 and tournament.user3_left == False:
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{tournament.user3.username}',
                {'type': 'send_message', 'user': self.user.username,
                    'message': f'/acceptTournament {tournament.id}'}
            )
        if tournament.user4 and tournament.user4_left == False:
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{tournament.user4.username}',
                {'type': 'send_message', 'user': self.user.username,
                    'message': f'/acceptTournament {tournament.id}'}
            )

    def handle_start_tournament(self, split):
        # print("Starting tournament")
        id = split[1]
        tournament = Tournament.objects.get(id=id)
        # if not tournament:
        # print("Tournament not found")
        if tournament.user1 and tournament.user1_left == False:
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{tournament.user1.username}',
                {'type': 'send_message', 'user': self.user.username,
                    'message': f'/startTournament {tournament.id}'}
            )
        if tournament.user2 and tournament.user2_left == False:
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{tournament.user2.username}',
                {'type': 'send_message', 'user': self.user.username,
                    'message': f'/startTournament {tournament.id}'}
            )
        if tournament.user3 and tournament.user3_left == False:
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{tournament.user3.username}',
                {'type': 'send_message', 'user': self.user.username,
                    'message': f'/startTournament {tournament.id}'}
            )
        if tournament.user4 and tournament.user4_left == False:
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{tournament.user4.username}',
                {'type': 'send_message', 'user': self.user.username,
                    'message': f'/startTournament {tournament.id}'}
            )

    def handle_refetch_tournament(self, split):
        id = split[1]
        tournament = Tournament.objects.get(id=id)
        if not tournament:
            return
        if tournament.user1 and tournament.user1_left == False:
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{tournament.user1.username}',
                {'type': 'send_message', 'user': self.user.username,
                    'message': f'/refetchTournament {tournament.id}'}
            )
        if tournament.user2 and tournament.user2_left == False:
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{tournament.user2.username}',
                {'type': 'send_message', 'user': self.user.username,
                    'message': f'/refetchTournament {tournament.id}'}
            )
        if tournament.user3 and tournament.user3_left == False:
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{tournament.user3.username}',
                {'type': 'send_message', 'user': self.user.username,
                    'message': f'/refetchTournament {tournament.id}'}
            )
        if tournament.user4 and tournament.user4_left == False:
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{tournament.user4.username}',
                {'type': 'send_message', 'user': self.user.username,
                    'message': f'/refetchTournament {tournament.id}'}
            )

    def handle_decline(self, split):
        # print("Declining invitation")
        invitation = Invitation.objects.get(id=split[1])
        return
        invitation.delete()
        async_to_sync(self.channel_layer.group_send)(
            f'inbox_{invitation.sender.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/decline {invitation.receiver}'
            }
        )

    def handle_leave_game(self, split):
        right_user = split[1]
        left_user = split[2]
        print("Handling leave game")
        print(right_user, left_user)
        async_to_sync(self.channel_layer.group_send)(
            f'inbox_{right_user}',
            {
                'type': 'send_message',
                'user': right_user,
                'message': f'/refetchPlayers {right_user} {left_user}'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'inbox_{left_user}',
            {
                'type': 'send_message',
                'user': left_user,
                'message': f'/refetchPlayers {right_user} {left_user}'
            }
        )