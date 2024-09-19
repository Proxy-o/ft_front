
from django.urls import re_path

from . import gameConsumer
from . import invitationConsumer

websocket_urlpatterns = [
    re_path(r'ws/game/game/', gameConsumer.GameConsumer.as_asgi()),
    re_path(r'ws/game/invitation/', invitationConsumer.InvitationConsumer.as_asgi()),
]
