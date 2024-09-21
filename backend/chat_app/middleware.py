from urllib.parse import parse_qs

from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from channels.auth import AuthMiddleware
from channels.db import database_sync_to_async
from channels.sessions import CookieMiddleware, SessionMiddleware
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


@database_sync_to_async
def get_user(scope):
    close_old_connections()
    query_string = parse_qs(scope['query_string'].decode())
    refresh_token = query_string.get('refresh')
    if not refresh_token:
        return AnonymousUser()
    # get the user_id from the query string
    query_user_id = query_string.get('user_id')
    if not query_user_id:
        return AnonymousUser()
    try:

        payload = RefreshToken(refresh_token[0]).payload
        user_id = payload['user_id']
        print("user_id",type(user_id))
        print("query_user_id",type(query_user_id[0]))
        print("wach am3lm ",str(user_id) == str(query_user_id[0] ))
        
        if str(user_id) != str(query_user_id[0] ):
            return AnonymousUser()
        user = User.objects.get(pk=user_id)
    except Exception as exception:
        return AnonymousUser()
    if not user.is_active:
        return AnonymousUser()
    return user

class TokenAuthMiddleware(AuthMiddleware):
    async def resolve_scope(self, scope):
        scope['user']._wrapped = await get_user(scope)


def TokenAuthMiddlewareStack(inner):
    return CookieMiddleware(SessionMiddleware(TokenAuthMiddleware(inner)))
