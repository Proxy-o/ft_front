
from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/game/game/', consumers.GameConsumer.as_asgi()),
    re_path(r'ws/game/invitation/', consumers.InvitationConsumer.as_asgi()),
]
