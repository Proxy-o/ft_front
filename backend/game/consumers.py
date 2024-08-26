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
        self.user_inbox = f'inbox_{self.user.username}'
        self.accept()

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
        elif command == '/fourDebut':
            self.handle_four_debut(split)
        elif command == '/readyFour':
            self.handle_ready_four(split)
        elif command == '/readyToStartFour':
            self.handle_ready_to_start_four(split)
        elif command == '/surrender': # todo: fix surrender in tournament    done, to be tested
            self.handle_surrender(split)
        elif command == '/refetchTournament':
            self.handle_refetch_tournament(split)
        elif command == '/acceptTournament':
            self.handle_accept_tournament(split)
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
        self.send(text_data=json.dumps({'status': 'error', 'message': message}))

    def handle_notif(self, split):
        import datetime
        time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        receiver = User.objects.get(id=split[2])
        async_to_sync(self.channel_layer.group_send)(
            f'inbox_{receiver.username}',
            {'type': 'send_message', 'user': self.user.username, 'message': ' '.join(split) + ' '}
        )

    def handle_accept(self, split):
        game_id = split[1]
        try:
            game = Game.objects.get(id=game_id)
        except Game.DoesNotExist:
            self.send_error('Game not found')
            return
        if game.user1:
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{game.user1.username}',
                {'type': 'send_message', 'user': self.user.username, 'message': f'/start {game_id}'}
            )
        if game.user2:
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{game.user2.username}',
                {'type': 'send_message', 'user': self.user.username, 'message': f'/start {game_id}'}
            )
        if game.user3:
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{game.user3.username}',
                {'type': 'send_message', 'user': self.user.username, 'message': f'/start {game_id}'}
            )
        if game.user4:
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{game.user4.username}',
                {'type': 'send_message', 'user': self.user.username, 'message': f'/start {game_id}'}
            )
        self.send(text_data=json.dumps({'status': 'success'}))

    def handle_refetch_players(self, split):
        game = Game.objects.filter(id=split[1]).last()
        if not game:
            self.send_error('Game not found')
            return
        time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        participants = [game.user1, game.user2, game.user3, game.user4]
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

    def handle_four_debut(self, split):
        user = split[1]
        async_to_sync(self.channel_layer.group_send)(
            f'inbox_{split[2]}',
            {'type': 'send_message', 'user': split[2], 'message': f'/showFour {user} {split[2]}'}
        )
        async_to_sync(self.channel_layer.group_send)(
            f'inbox_{split[3]}',
            {'type': 'send_message', 'user': split[3], 'message': f'/showFour {user} {split[3]}'}
        )
        async_to_sync(self.channel_layer.group_send)(
            f'inbox_{split[4]}',
            {'type': 'send_message', 'user': split[4], 'message': f'/showFour {user} {split[4]}'}
        )
        async_to_sync(self.channel_layer.group_send)(
            f'inbox_{split[5]}',
            {'type': 'send_message', 'user': split[5], 'message': f'/showFour {user} {split[5]}'}
        )
        print(split[1], split[2], split[3], split[4], split[5])


    
    

    def handle_ready_four(self, split):
        user = split[1]
        async_to_sync(self.channel_layer.group_send)(
            f'inbox_{user}',
            {'type': 'send_message', 'user': user, 'message': f'/readyFour {user} {split[2]}'}
        )

    def handle_ready_to_start_four(self, split):
        async_to_sync(self.channel_layer.group_send)(
            f'inbox_{split[1]}',
            {'type': 'send_message', 'user': split[1], 'message': f'/startFour {split[1]} {split[2]} {split[3]} {split[4]}'}
        )
        async_to_sync(self.channel_layer.group_send)(
            f'inbox_{split[2]}',
            {'type': 'send_message', 'user': split[2], 'message': f'/startFour {split[1]} {split[2]} {split[3]} {split[4]}'}
        )
        async_to_sync(self.channel_layer.group_send)(
            f'inbox_{split[3]}',
            {'type': 'send_message', 'user': split[3], 'message': f'/startFour {split[1]} {split[2]} {split[3]} {split[4]}'}
        )
        async_to_sync(self.channel_layer.group_send)(
            f'inbox_{split[4]}',
            {'type': 'send_message', 'user': split[4], 'message': f'/startFour {split[1]} {split[2]} {split[3]} {split[4]}'}
        )

    def handle_surrender(self, split):
        surrenderer = split[1]
        winner_username = split[2]
        async_to_sync(self.channel_layer.group_send)(
            f'inbox_{surrenderer}',
            {
                'type': 'send_message',
                'user': surrenderer,
                'message': f'/surrender {surrenderer} {winner_username}'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'inbox_{winner_username}',
            {
                'type': 'send_message',
                'user': winner_username, 'message':
                f'/surrender {surrenderer} {winner_username}'
            }
        )
    

    def handle_refetch_tournament(self, split):
        print("Refetching tournament")
        time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        tournamentId = split[1]
        tournament = Tournament.objects.get(id=tournamentId)
        self.refresh_tournament(tournament)

    def handle_accept_tournament(self, split):
        print("Accepting tournament")
        id = split[1]
        tournament = Tournament.objects.get(id=id)
        self.refresh_tournament(tournament)

    def refresh_tournament(self, tournament):
        print("Refreshing tournament")
        time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        participants = [tournament.user1, tournament.user2, tournament.user3, tournament.user4]
        for participant in participants:
            if participant:
                async_to_sync(self.channel_layer.group_send)(
                    f'inbox_{participant.username}',
                    {
                        'type': 'send_message',
                        'user': self.user.username,
                        'message': f'/refetchTournament {tournament.id} {time}'
                    }
                )

    def handle_decline(self, split):
        print("Declining invitation")
        invitation = Invitation.objects.get(id=split[1])
        invitation.delete()
        async_to_sync(self.channel_layer.group_send)(
            f'inbox_{invitation.sender.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/decline {invitation.receiver}'
            }
        )


class GameConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = None
        self.user_inbox = None
        self.game_group = None

    def connect(self):
        self.user = self.scope['user']
        self.user_inbox = f'inbox_{self.user.username}'
        game = Game.objects.filter(Q(user1=self.user) | Q(user2=self.user) | Q(user3=self.user) | Q(user4=self.user)).filter(winner=None).last()
        if game:
            self.game_group = f'game_{game.id}'

        self.accept()

        if self.user.is_authenticated:
            async_to_sync(self.channel_layer.group_add)(
                self.user_inbox,
                self.channel_name,
            )
            if self.game_group:
                async_to_sync(self.channel_layer.group_add)(
                    self.game_group,
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
        if command == '/enemyScore':
            self.handle_enemy_score(split)
        elif command == '/debut':
            self.handle_debut(split)
        elif command == '/fourEnemyScore':
            self.handle_four_enemy_score(split)
        elif command == '/fourSurrender':
            self.handle_four_surrender(split)
        elif command == '/move':
            self.handle_move(split)
        elif command == '/fourMove':
            self.handle_four_move(split)
        elif command == '/changeBallDirection':
            self.handle_change_ball_direction(split)
        elif command == '/fourChangeBallDirection':
            self.handle_four_change_ball_direction(split)
        elif command == '/time':
            self.handle_time(split)
        elif command == '/fourTime':
            self.handle_four_time(split)
        elif command == '/timeResponse':
            self.handle_time_response(split)
        elif command == '/whoLeftGame':
            self.handle_who_left_game(split)
        elif command == '/stillPlaying':
            self.handle_still_playing(split)
        elif command == '/userLeftGame':
            self.handle_user_left_game(split)
        elif command == '/disconnect':
            self.disconnect(1000)

    def disconnect(self, close_code):
        if self.user.is_authenticated:
            async_to_sync(self.channel_layer.group_discard)(
                self.user_inbox,
                self.channel_name,
            )
            if self.game_group:
                async_to_sync(self.channel_layer.group_discard)(
                    self.game_group,
                    self.channel_name,
                )

    def send_message(self, event):
        self.send(text_data=json.dumps(event))

    def send_error(self, message):
        self.send(text_data=json.dumps({'status': 'error', 'message': message}))


    def handle_debut(self, split):
        user1 = split[1]
        user2 = split[2]
        self.game_group = f'game_{split[3]}'
        # print("gaaaaame group", self.game_group, self.user.username)
        if self.game_group:
            async_to_sync(self.channel_layer.group_add)(
                self.game_group,
                self.channel_name,
            )
        user = ''
        if self.user.username == user1:
            user = user2
        else:
            user = user1
        async_to_sync(self.channel_layer.group_send)(
            f'inbox_{user}',
            {'type': 'send_message', 'user': user1, 'message': f'/show {user1} {user2}'}
        )
    def handle_enemy_score(self, split):
        # print("Handling enemy score")
        score = split[1]
        self.send_score_message(score)

    def handle_four_enemy_score(self, split):
        # print("Handling four enemy score")
        self.send_four_score_message()

    def handle_four_surrender(self, split):
        # print("Handling four surrender")
        surrenderer = self.user.username
        gameId = split[1]
        game = Game.objects.get(id=gameId)
        if not game:
            self.send_error('Game not found')
            return
        async_to_sync(self.channel_layer.group_send)(
            f'inbox_{game.user1.username}',
            {
                'type': 'send_message',
                'user': surrenderer,
                'message': f'/fourSurrender {surrenderer}'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'inbox_{game.user2.username}',
            {
                'type': 'send_message',
                'user': surrenderer,
                'message': f'/fourSurrender {surrenderer}'
            }
        )
        if game.user3:
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{game.user3.username}',
                {
                    'type': 'send_message',
                    'user': surrenderer,
                    'message': f'/fourSurrender {surrenderer}'
                }
            )
        if game.user4:
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{game.user4.username}',
                {
                    'type': 'send_message',
                    'user': surrenderer,
                    'message': f'/fourSurrender {surrenderer}'
                }
            )

    def handle_move(self, split):
        # print("Handling move")
        direction = split[1]
        paddle_y = split[2]
        self.send_move_message(direction, paddle_y)

    def handle_four_move(self, split):
        # print("Handling four move")
        paddle_y = split[1]
        user = split[2]
        self.send_four_move_message(paddle_y, user)

    def handle_change_ball_direction(self, split):
        # print("Handling change ball direction")
        ball_x = split[1]
        ball_y = split[2]
        ball_angle = split[3]
        user = split[4]
        self.send_ball_direction_message(ball_x, ball_y, ball_angle)

    def handle_four_change_ball_direction(self, split):
        # print("Handling four change ball direction")
        sender = self.user.username
        ball_x = split[1]
        ball_y = split[2]
        ball_angle = split[3]
        user = split[4]
        async_to_sync(self.channel_layer.group_send)(
                self.game_group,
                {
                    'type': 'send_message',
                    'user': sender,
                    'message': f'/fourBallDirection {ball_x} {ball_y} {ball_angle} {user}'
                }
            )
    
    def handle_time(self, split):
        # print("Handling time")
        time = split[1]
        async_to_sync(self.channel_layer.group_send)(
            self.game_group,
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/time {time} {self.user.username}'
            }
        )
    
    def handle_four_time(self, split):
        # print("Handling four time")
        time = split[1]
        async_to_sync(self.channel_layer.group_send)(
            self.game_group,
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/fourTime {time} {self.user.username}'
            }
        )

    def handle_time_response(self, split):
        # print("Handling time response")
        time = split[1]
        user = split[2]
        async_to_sync(self.channel_layer.group_send)(
            f'inbox_{user}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/timeResponse {time} {user}'
            }
        )

    def handle_who_left_game(self, split):
        # print("Handling who left game")
        async_to_sync(self.channel_layer.group_send)(
            self.game_group,
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/whoLeftGame {self.user.username}'
            }
        )

    def handle_still_playing(self, split):
        who_asked = split[2]
        async_to_sync(self.channel_layer.group_send)(
            f'inbox_{who_asked}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/stillPlaying {self.user.username} {who_asked}'
            }
        )

    def handle_user_left_game(self, split):
        # print("Handling user left game")
        user = split[1]
        async_to_sync(self.channel_layer.group_send)(
            self.game_group,
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/userLeftGame {user} {self.user.username}'
            }
        )

    

    def send_score_message(self, gameId):
        print("Sending score message")
        game = Game.objects.get(id=gameId)
        if game.user1 == self.user:
            game.user2_score += 1
        else:
            game.user1_score += 1
        game.save()
        async_to_sync(self.channel_layer.group_send)(
            f'inbox_{game.user1.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/score'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'inbox_{game.user2.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/score'
            }
        )

    def send_four_score_message(self):
        # print("Sending four score message")
        gameId = self.game_group.split('_')[1]
        game = Game.objects.get(id=gameId)
        if game.user1 == self.user or game.user3 == self.user:
            game.user1_score += 1
        else:
            game.user2_score += 1
        game.save()
        async_to_sync(self.channel_layer.group_send)(
            self.game_group,
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/score'
            }
        )

    def send_move_message(self, direction, paddle_y):
        # print("Sending move message")
        async_to_sync(self.channel_layer.group_send)(
            self.game_group,
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/move {direction} {paddle_y} {self.user.username}'
            }
        )

    def send_four_move_message(self, paddle_y, user):
        # print("Sending four move message")
        async_to_sync(self.channel_layer.group_send)(
            self.game_group,
            {
                'type': 'send_message',
                'message': f'/move {paddle_y} {user}'
            }
        )

    def send_ball_direction_message(self, ball_x, ball_y, ball_angle):
        # print("Sending ball direction message")
        async_to_sync(self.channel_layer.group_send)(
            self.game_group,
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/ballDirection {ball_x} {ball_y} {ball_angle} {self.user.username}'
            }
        )
