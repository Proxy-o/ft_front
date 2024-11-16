from django.contrib.auth.models import User
from authentication.custom_token import AccessToken
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from django.http import Http404
from rest_framework import permissions
from .permissions import IsOwnerOrReadOnly
from rest_framework_simplejwt.views import TokenViewBase
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model
from .services import OAuthService
from .serializers import UserSerializer, AvatarSerializer, VerifyOTPSerializer, EditUserSerializer, OAuthCredentialSerializer, TokenSerializer
User = get_user_model()

@api_view(['POST'])
@authentication_classes([])  # No authentication required
@permission_classes([])  # No permissions required
def signup(request):
    serializer = UserSerializer(
        data=request.data, context={'request': request})

    if serializer.is_valid():
        try:
            validate_password(request.data['password'])
        except Exception as e:
            return Response({'password': e}, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.save()
        user.set_password(request.data['password'])
        # set a code to s_token
        user.s_token = User.objects.make_random_password()
        user.save()
        return Response({'user': serializer.data}, status=200)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def set_auth_cookies_and_response(user, access_token, request):
    response = Response({
        'user': UserSerializer(user, context={'request': request}).data,
    })

    response.set_cookie(
        'access',
        str(access_token),
        max_age=36000,
        expires=36000,
        httponly=True,
        secure=True,  # Use secure=True if your site is served over HTTPS
        samesite='None'  # Adjust as needed, could also be 'Strict' or 'None'
    )

    return response


class Login(TokenViewBase):
    serializer_class = TokenSerializer
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        if username is None or password is None:
            return Response({'detail': 'No credentials provided'}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, username=username)
        if not user.check_password(password):
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

        if user.otp_active:
            return Response({'detail': '2FA required', 'user_id': user.id}, status=status.HTTP_200_OK)

        response = super().post(request, *args, **kwargs)

        # Get the token from the response
        access_token = response.data.get('access')

        # Use the helper function
        return set_auth_cookies_and_response(user, access_token, request)

# Oauth 2.0


@authentication_classes([])
@permission_classes([])
class OAuthRedirect(APIView):
    def get(self, request, *args, **kwargs):
        provider = kwargs.get('provider')
        redirect_url, error = OAuthService.get_redirect_url(provider)
        if error:
            return Response(error, status=status.HTTP_400_BAD_REQUEST)
        return Response({'redirect_url': redirect_url})


@authentication_classes([])
@permission_classes([])
class OAuthCallback(APIView):

    def get(self, request, *args, **kwargs):
        provider = kwargs.get('provider')
        code = request.query_params.get('code')
        state = request.query_params.get('state')

        user, user_credentials, error = OAuthService.handle_callback(
            provider, code, state)
        if error:
            return Response(error, status=status.HTTP_400_BAD_REQUEST)

        if user.otp_active:
            return Response({'detail': '2FA required', 'user_id': user.id}, status=status.HTTP_200_OK)

        serializer = OAuthCredentialSerializer(data=user_credentials)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        access_token = str(AccessToken.for_user(user=user))
        return set_auth_cookies_and_response(user, access_token, request)


@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def verifyOTPView(request):
    serializer = VerifyOTPSerializer(
        context={'request': request}, data=request.data)
    serializer.is_valid(raise_exception=True)
    login_info = serializer.save()
    response = set_auth_cookies_and_response(
        login_info['user'], login_info['access'], request)
    return response


@api_view(['POST'])
def toggleOTP(request):
    status = request.data.get('status')
    user = request.user
    if status == 'enable':
        user.otp_active = True
        user.save()
        return Response({'detail': 'OTP enabled'}, status=200)
    elif status == 'disable':
        user.otp_active = False
        user.save()
        return Response({'detail': 'OTP disabled'}, status=200)


# class CustomTokenRefreshView(TokenRefreshView):
#     def post(self, request, *args, **kwargs):
#         # Extract the refresh token from the request data
#         refresh_token = request.data.get('refresh')

#         if not refresh_token:
#             return Response({'detail': 'No refresh token provided'}, status=status.HTTP_400_BAD_REQUEST)

#         # Decode the refresh token to get the user ID
#         decoded_payload = RefreshToken(refresh_token).payload
#         user_id = decoded_payload['user_id']

#         # Fetch the user from the database
#         user = User.objects.get(id=user_id)

#         # Use the refresh token to get a new access token
#         response = super().post(request, *args, **kwargs)

#         # Include additional user information in the response
#         user_serializer = UserSerializer(user, context={'request': request})
#         user_data = user_serializer.data
#         response.data['user'] = user_data

#         return response

class CustomLogoutView(APIView):
    authentication_classes = []

    def get(self, request, *args, **kwargs):
        response = Response(
            {'detail': 'Successfully logged out'}, status=status.HTTP_200_OK)
        try:
            access_token = request.COOKIES.get('access')
            if access_token:
                user = User.objects.get(id=request.user.id)
                user.status = 'offline'
                user.save()
                token = AccessToken(access_token)
                token.blacklist()
        except Exception:
            pass

        response.delete_cookie('access')
        return response

        # If the refresh token is invalid, return a success response

# upload avatar
class UserAvatar(APIView):

    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    parser_classes = [MultiPartParser, FormParser]

    def get_object(self, pk):
        try:
            obj = User.objects.get(pk=pk)
            self.check_object_permissions(self.request, obj)
            return obj
        except User.DoesNotExist:
            return Http404

    def put(self, request, pk, format=None):
        user = self.get_object(pk)
        serializer = AvatarSerializer(instance=user, data=request.data, context={
                                      'request': request}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class UserList(APIView):
    """
    List all users, or create a new user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        users = User.objects.all()
        serializer = UserSerializer(
            users, context={'request': request}, many=True)
        return Response(serializer.data)
class UserDetail(APIView):
    """
    Retrieve, update or delete a user instance
    """
    # permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_object(self, pk):
        try:
            obj = User.objects.get(pk=pk)
            # self.check_object_permissions(self.request, obj)
            return obj
        except User.DoesNotExist:
            return Http404

    def get(self, request, pk, format=None):
        if pk == 0:
            user = request.user
        else:
            user = self.get_object(pk)

        if user is Http404:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        user = self.get_object(pk)
        serializer = EditUserSerializer(
            user, data=request.data, partial=True, context={'request': request})

        if serializer.is_valid():
            if 'password' in serializer.validated_data:
                try:
                    validate_password(serializer.validated_data['password'])
                except Exception as e:
                    return Response({'password': e}, status=status.HTTP_400_BAD_REQUEST)
                user.set_password(serializer.validated_data['password'])
                user.save()
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        user = self.get_object(pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

