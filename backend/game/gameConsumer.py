import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.db.models import Q
from django.contrib.auth import get_user_model
from .models import Game, Tournament
import datetime

User = get_user_model()



class GameConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = None
        self.user_inbox = None

    def connect(self):
        self.user = self.scope['user']
        self.user_inbox = f'game_{self.user.username}'
        self.accept()

        if self.user.is_authenticated:
            print("User authenticated")
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
        elif command == '/readyFour':
            self.handle_ready_four(split)
        elif command == '/changeBallDirection':
            self.handle_change_ball_direction(split)
        elif command == '/fourDebut':
            print("Four debut")
            self.handle_four_debut(split)
        elif command == '/readyToStartFour':
            print("Ready to start four")
            self.handle_ready_to_start_four(split)
        elif command == '/fourChangeBallDirection':
            self.handle_four_change_ball_direction(split)
        elif command == '/time':
            self.handle_time(split)
        elif command == '/surrender': # todo: fix surrender in tournament    done, to be tested
            self.handle_surrender(split)
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
        elif command == '/endGame':
            self.handle_end_game(split)

    def disconnect(self, close_code):
        if self.user.is_authenticated:
            async_to_sync(self.channel_layer.group_discard)(
                self.user_inbox,
                self.channel_name,
            )



    def handle_debut(self, split):
        user1 = split[1]
        user2 = split[2]
        gameId = split[3]
        # print("gaaaaame group", self.game_group, self.user.username)
        user = ''
        if self.user.username == user1:
            user = user2
        else:
            user = user1
        async_to_sync(self.channel_layer.group_send)(
            f'game_{user}',
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
            return
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user1.username}',
            {
                'type': 'send_message',
                'user': surrenderer,
                'message': f'/fourSurrender {surrenderer}'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user2.username}',
            {
                'type': 'send_message',
                'user': surrenderer,
                'message': f'/fourSurrender {surrenderer}'
            }
        )
        if game.user3:
            async_to_sync(self.channel_layer.group_send)(
                f'game_{game.user3.username}',
                {
                    'type': 'send_message',
                    'user': surrenderer,
                    'message': f'/fourSurrender {surrenderer}'
                }
            )
        if game.user4:
            async_to_sync(self.channel_layer.group_send)(
                f'game_{game.user4.username}',
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
        direction = split[2]
        user = split[3]
        self.send_four_move_message(paddle_y, direction, user)

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
        game = Game.objects.filter(Q(user1=self.user) | Q(user2=self.user) | Q(user3=self.user) | Q(user4=self.user)).filter(winner=None).last()
        if not game:
            return
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user1.username}',
            {
                'type': 'send_message',
                'user': sender,
                'message': f'/fourBallDirection {ball_x} {ball_y} {ball_angle} {user}'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user2.username}',
            {
                'type': 'send_message',
                'user': sender,
                'message': f'/fourBallDirection {ball_x} {ball_y} {ball_angle} {user}'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user3.username}',
            {
                'type': 'send_message',
                'user': sender,
                'message': f'/fourBallDirection {ball_x} {ball_y} {ball_angle} {user}'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user4.username}',
            {
                'type': 'send_message',
                'user': sender,
                'message': f'/fourBallDirection {ball_x} {ball_y} {ball_angle} {user}'
            }
        )
    
    def handle_time(self, split):
        # print("Handling time")
        time = split[1]
        game = Game.objects.filter(Q(user1=self.user) | Q(user2=self.user) | Q(user3=self.user) | Q(user4=self.user)).filter(winner=None).last()
        if not game:
            return
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user1.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/time {time} {self.user.username}'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user2.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/time {time} {self.user.username}'
            }
        )
        # if game.user3:
        #     async_to_sync(self.channel_layer.group_send)(
        #         f'game_{game.user3.username}',
        #         {
        #             'type': 'send_message',
        #             'user': self.user.username,
        #             'message': f'/time {time} {self.user.username}'
        #         }
        #     )
        # if game.user4:
        #     async_to_sync(self.channel_layer.group_send)(
        #         f'game_{game.user4.username}',
        #         {
        #             'type': 'send_message',
        #             'user': self.user.username,
        #             'message': f'/time {time} {self.user.username}'
        #         }
        #     )

    def handle_surrender(self, split):
        surrenderer = split[1]
        winner_username = split[2]
        async_to_sync(self.channel_layer.group_send)(
            f'game_{surrenderer}',
            {
                'type': 'send_message',
                'user': surrenderer,
                'message': f'/surrender {surrenderer} {winner_username}'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{winner_username}',
            {
                'type': 'send_message',
                'user': winner_username, 'message':
                f'/surrender {surrenderer} {winner_username}'
            }
        )

    def handle_four_debut(self, split): # this is sending to invitation socket wtf
        time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        user = split[1]
        game = Game.objects.filter(Q(user1=self.user) | Q(user2=self.user) | Q(user3=self.user) | Q(user4=self.user)).filter(winner=None).last()
        if not game:
            return
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user1.username}',
            {
                'type': 'send_message',
                'user': user,
                'message': f'/showFour {user} {split[2]} {time}'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user2.username}',
            {
                'type': 'send_message',
                'user': user,
                'message': f'/showFour {user} {split[3]} {time}'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user3.username}',
            {
                'type': 'send_message',
                'user': user,
                'message': f'/showFour {user} {split[4]} {time}'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user4.username}',
            {
                'type': 'send_message',
                'user': user,
                'message': f'/showFour {user} {split[5]} {time}'
            }
        )

        # async_to_sync(self.channel_layer.group_send)(
        #     f'game_{split[2]}',
        #     {'type': 'send_message', 'user': split[2], 'message': f'/showFour {user} {split[2]} {time}'}
        # )
        # async_to_sync(self.channel_layer.group_send)(
        #     f'game_{split[3]}',
        #     {'type': 'send_message', 'user': split[3], 'message': f'/showFour {user} {split[3]} {time}'}
        # )
        # async_to_sync(self.channel_layer.group_send)(
        #     f'game_{split[4]}',
        #     {'type': 'send_message', 'user': split[4], 'message': f'/showFour {user} {split[4]} {time}'}
        # )
        # async_to_sync(self.channel_layer.group_send)(
        #     f'game_{split[5]}',
        #     {'type': 'send_message', 'user': split[5], 'message': f'/showFour {user} {split[5]} {time}'}
        # )
        print(split[1], split[2], split[3], split[4], split[5])


    
    def handle_four_time(self, split):
        # print("Handling four time")
        time = split[1]
        game = Game.objects.filter(Q(user1=self.user) | Q(user2=self.user) | Q(user3=self.user) | Q(user4=self.user)).filter(winner=None).last()
        if not game:
            return
        # async_to_sync(self.channel_layer.group_send)(
        #     self.game_group,
        #     {
        #         'type': 'send_message',
        #         'user': self.user.username,
        #         'message': f'/fourTime {time} {self.user.username}'
        #     }
        # )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user1.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/fourTime {time} {self.user.username}'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user2.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/fourTime {time} {self.user.username}'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user3.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/fourTime {time} {self.user.username}'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user4.username}',
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
            f'game_{user}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/timeResponse {time} {user}'
            }
        )

    def handle_who_left_game(self, split):
        # print("Handling who left game")
        game = Game.objects.filter(Q(user1=self.user) | Q(user2=self.user) | Q(user3=self.user) | Q(user4=self.user)).filter(winner=None).last()
        if not game:
            return
        # async_to_sync(self.channel_layer.group_send)(
        #     self.game_group,
        #     {
        #         'type': 'send_message',
        #         'user': self.user.username,
        #         'message': f'/whoLeftGame {self.user.username}'
        #     }
        # )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user1.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/whoLeftGame {self.user.username}'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user2.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/whoLeftGame {self.user.username}'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user3.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/whoLeftGame {self.user.username}'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user4.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/whoLeftGame {self.user.username}'
            }
        )

    def handle_ready_four(self, split):
        print("Handling ready four")
        user = split[1]
        async_to_sync(self.channel_layer.group_send)(
            f'game_{user}',
            {'type': 'send_message', 'user': user, 'message': f'/readyFour {user} {split[2]}'}
        )

    def handle_refetch_tournament(self, split):
        print("Refetching tournament")
        time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        tournamentId = split[1]
        tournament = Tournament.objects.get(id=tournamentId)
        if not tournament:
            return
        self.refresh_tournament(tournament)


    def handle_still_playing(self, split):
        who_asked = split[2]
        async_to_sync(self.channel_layer.group_send)(
            f'game_{who_asked}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/stillPlaying {self.user.username} {who_asked}'
            }
        )

    def handle_ready_to_start_four(self, split):
        print("Handling ready to start four")
        time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        async_to_sync(self.channel_layer.group_send)(
            f'game_{split[1]}',
            {'type': 'send_message', 'user': split[1], 'message': f'/startFour {split[1]} {split[2]} {split[3]} {split[4]} {time}'}
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{split[2]}',
            {'type': 'send_message', 'user': split[2], 'message': f'/startFour {split[1]} {split[2]} {split[3]} {split[4]} {time}'}
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{split[3]}',
            {'type': 'send_message', 'user': split[3], 'message': f'/startFour {split[1]} {split[2]} {split[3]} {split[4]} {time}'}
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{split[4]}',
            {'type': 'send_message', 'user': split[4], 'message': f'/startFour {split[1]} {split[2]} {split[3]} {split[4]} {time}'}
        )

    def handle_user_left_game(self, split):
        # print("Handling user left game")
        user = split[1]
        game = Game.objects.filter(Q(user1=self.user) | Q(user2=self.user) | Q(user3=self.user) | Q(user4=self.user)).filter(winner=None).last()
        if not game:
            return
        # async_to_sync(self.channel_layer.group_send)(
        #     self.game_group,
        #     {
        #         'type': 'send_message',
        #         'user': self.user.username,
        #         'message': f'/userLeftGame {user} {self.user.username}'
        #     }
        # )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user1.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/userLeftGame {user} {self.user.username}'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user2.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/userLeftGame {user} {self.user.username}'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user3.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/userLeftGame {user} {self.user.username}'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user4.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/userLeftGame {user} {self.user.username}'
            }
        )

    

    def send_score_message(self, gameId):
        print("Sending score message")
        game = Game.objects.get(id=gameId)
        if not game:
            return
        if game.user1 == self.user:
            game.user2_score += 1
        else:
            game.user1_score += 1
        game.save()
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user1.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/score'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user2.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/score'
            }
        )

    def send_four_score_message(self):
        # print("Sending four score message")
        game = Game.objects.filter(Q(user1=self.user) | Q(user2=self.user) | Q(user3=self.user) | Q(user4=self.user)).filter(winner=None).last()
        if game.user1 == self.user or game.user3 == self.user:
            game.user2_score += 1
        else:
            game.user1_score += 1
        game.save()
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user1.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/score'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user2.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/score'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user3.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/score'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user4.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/score'
            }
        )

    def send_move_message(self, direction, paddle_y):
        # print("Sending move message")
        game = Game.objects.filter(Q(user1=self.user) | Q(user2=self.user) | Q(user3=self.user) | Q(user4=self.user)).filter(winner=None).last()
        if not game:
            return
        # async_to_sync(self.channel_layer.group_send)(
        #     self.game_group,
        #     {
        #         'type': 'send_message',
        #         'user': self.user.username,
        #         'message': f'/move {direction} {paddle_y} {self.user.username}'
        #     }
        # )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user1.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/move {direction} {paddle_y} {self.user.username}'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user2.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/move {direction} {paddle_y} {self.user.username}'
            }
        )
        if game.user3:
            async_to_sync(self.channel_layer.group_send)(
                f'game_{game.user3.username}',
                {
                    'type': 'send_message',
                    'user': self.user.username,
                    'message': f'/move {direction} {paddle_y} {self.user.username}'
                }
            )
        if game.user4:
            async_to_sync(self.channel_layer.group_send)(
                f'game_{game.user4.username}',
                {
                    'type': 'send_message',
                    'user': self.user.username,
                    'message': f'/move {direction} {paddle_y} {self.user.username}'
                }
            )

    def send_four_move_message(self, paddle_y, direction, user):
        # print("Sending four move message")
        time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        game = Game.objects.filter(Q(user1=self.user) | Q(user2=self.user) | Q(user3=self.user) | Q(user4=self.user)).filter(winner=None).last()
        if not game:
            return
        # async_to_sync(self.channel_layer.group_send)(
        #     self.game_group,
        #     {
        #         'type': 'send_message',
        #         'message': f'/move {paddle_y} {user}'
        #     }
        # )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user1.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/fourMove {paddle_y} {direction} {user} {time}'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user2.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/fourMove {paddle_y} {direction} {user} {time}'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user3.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/fourMove {paddle_y} {direction} {user} {time}'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user4.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/fourMove {paddle_y} {direction} {user} {time}'
            }
        )


    def send_ball_direction_message(self, ball_x, ball_y, ball_angle):
        # print("Sending ball direction message")
        game = Game.objects.filter(Q(user1=self.user) | Q(user2=self.user) | Q(user3=self.user) | Q(user4=self.user)).filter(winner=None).last()
        if not game:
            return
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user1.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/ballDirection {ball_x} {ball_y} {ball_angle} {self.user.username}'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user2.username}',
            {
                'type': 'send_message',
                'user': self.user.username,
                'message': f'/ballDirection {ball_x} {ball_y} {ball_angle} {self.user.username}'
            }
        )
        if game.user3:
            async_to_sync(self.channel_layer.group_send)(
                f'game_{game.user3.username}',
                {
                    'type': 'send_message',
                    'user': self.user.username,
                    'message': f'/ballDirection {ball_x} {ball_y} {ball_angle} {self.user.username}'
                }
            )
        if game.user4:
            async_to_sync(self.channel_layer.group_send)(
                f'game_{game.user4.username}',
                {
                    'type': 'send_message',
                    'user': self.user.username,
                    'message': f'/ballDirection {ball_x} {ball_y} {ball_angle} {self.user.username}'
                }
            )
    
    def handle_end_game(self, split):
        user = self.user.username
        game = Game.objects.filter(Q(user1=self.user) | Q(user2=self.user) | Q(user3=self.user) | Q(user4=self.user)).last()
        if not game:
            return
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user1.username}',
            {
                'type': 'send_message',
                'user': user,
                'message': f'/endGame {user}'
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            f'game_{game.user2.username}',
            {
                'type': 'send_message',
                'user': user,
                'message': f'/endGame {user}'
            }
        )
        if game.user3:
            async_to_sync(self.channel_layer.group_send)(
                f'game_{game.user3.username}',
                {
                    'type': 'send_message',
                    'user': user,
                    'message': f'/endGame {user}'
                }
            )
        if game.user4:
            async_to_sync(self.channel_layer.group_send)(
                f'game_{game.user4.username}',
                {
                    'type': 'send_message',
                    'user': user,
                    'message': f'/endGame {user}'
                }
            )


    def send_message(self, event):
        self.send(text_data=json.dumps(event))

    def send_error(self, message):
        self.send(text_data=json.dumps({'status': 'error', 'message': message}))
