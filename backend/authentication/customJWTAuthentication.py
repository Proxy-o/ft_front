from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework.authentication import get_authorization_header
from rest_framework.exceptions import AuthenticationFailed


class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        print("authenticating")
        cookie_token = request.COOKIES.get('access')
        print(cookie_token)
        if cookie_token:
            return super().authenticate(request)
        else:
            # not authenticated
            raise AuthenticationFailed("No token provided")
        