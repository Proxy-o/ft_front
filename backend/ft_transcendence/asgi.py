"""
ASGI config for ft_transcendence project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from chat_app.middleware import TokenAuthMiddlewareStack

import chat_app.routing
import game.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ft_transcendence.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": TokenAuthMiddlewareStack(
        URLRouter(
            chat_app.routing.websocket_urlpatterns +
            game.routing.websocket_urlpatterns
        )
    ),
})