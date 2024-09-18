import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import Message
from django.contrib.auth import get_user_model


User = get_user_model()


class ChatConsumer(WebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.user = None
        self.user_inbox = None

    def connect(self):
        self.user = self.scope['user']
        self.user_inbox = f'inbox_{self.user.id}'
        # connection has to be accepted
        self.accept()

        if self.user.is_authenticated:
            # -------------------- new --------------------
            # create a user inbox for private messages
            async_to_sync(self.channel_layer.group_add)(
                self.user_inbox,
                self.channel_name,
            )
            # set the status of the user to online in the database
            User.objects.filter(id=self.user.id).update(status='online')

    def disconnect(self, close_code):
        if self.user.is_authenticated:
            # -------------------- new --------------------
            # delete the user inbox for private messages
            async_to_sync(self.channel_layer.group_discard)(
                self.user_inbox,
                self.channel_name,
            )
            # set the status of the user to offline in the database
            User.objects.filter(id=self.user.id).update(status='offline')

    def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        if not self.user.is_authenticated:
            return

        if message.startswith('/request'):
            split = message.split(' ', 2)
            target_id = split[1]
            try:
                target_user = User.objects.get(id=target_id)
            except User.DoesNotExist:
                return

# TODO WHY USING ASYNC TO SYNC
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{target_id}',
                {
                    'type': 'request',
                    'user': self.user.username,
                    "id": self.user.id,
                    "avatar": self.user.avatar.url,
                }
            )

        if message.startswith('/friendUpdate '):
            split = message.split(' ', 2)
            target_id = split[1]
            try:
                target_user = User.objects.get(id=target_id)
            except User.DoesNotExist:
                return


            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{target_id}',
                {
                    'type': 'friendUpdate',
                    'target': self.user.id,
                }
            )
            return

        if message.startswith('/pm '):
            split = message.split(' ', 2)
            target_id = split[1]
            target_msg = split[2]
            try:
                target_user = User.objects.get(id=target_id)
            except User.DoesNotExist:
                return

            if self.user in target_user.blocked.all():
                self.send(json.dumps({
                    'type': 'blocked',
                    'target': target_id,
                    'message': "You are blocked by this user",
                }))
                return

            if target_user in self.user.blocked.all():
                self.send(json.dumps({
                    'type': 'blocked',
                    'target': target_id,
                    'message': "You have blocked this user",
                }))
                return
            if target_user not in self.user.friends.all():
                self.send(json.dumps({
                    'type': 'blocked',
                    'target': target_id,
                    'message': "You are not friend with this user",
                }))
                return

            if len(target_msg) > 1000 or len(target_msg) < 1:
                self.send(json.dumps({
                    'type': 'blocked',
                    'target': target_id,
                    'message': "Message must be between 1 and 1000 characters",
                }))
                return

            # send private message to the target
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{target_id}',
                {
                    'type': 'private_message',
                    'user': self.user.username,
                    'message': target_msg,
                    'id': self.user.id,
                }
            )
            # send private message delivered to the user
            self.send(json.dumps({
                'type': 'private_message_delivered',
                'target': target_id,
                'message': target_msg,

            }))
            Message.objects.create(
                user=self.user,
                receiver=target_user,
                content=target_msg,
            )
            return

    def chat_message(self, event):
        self.send(text_data=json.dumps(event))

    def private_message(self, event):
        self.send(text_data=json.dumps(event))

    def private_message_delivered(self, event):
        self.send(text_data=json.dumps(event))

    def request(self, event):
        self.send(text_data=json.dumps(event))
        
    def friendUpdate(self, event):
        self.send(text_data=json.dumps(event))
