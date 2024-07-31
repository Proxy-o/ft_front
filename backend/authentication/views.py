from django.contrib.auth.models import User
import pyotp
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view

from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, AvatarSerializer, VerifyOTPSerializer, EditUserSerializer
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from django.http import Http404
from rest_framework import permissions
from .permissions import IsOwnerOrReadOnly
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.hashers import make_password
from game.serializers import GameSerializer
from game.models import Game
from django.db.models import Q
from django.contrib.auth.password_validation import validate_password


from django.contrib.auth import get_user_model
User = get_user_model()


@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(
        data=request.data, context={'request': request})

    if serializer.is_valid():
        try:
            print("shiiit")
            validate_password(request.data['password'])
        except Exception as e:
            print(e)
            return Response({'password': e}, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.save()
        user.set_password(request.data['password'])
        user.save()
        return Response({'user': serializer.data}, status=200)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class Login(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        if username is None or password is None:
            return Response({'detail': 'No credentials provided'}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, username=username)
        if not user.check_password(password):
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

        if user.otp_active:
            return Response({'detail': '2FA required', 'user_id': user.id}, status=status.HTTP_400_BAD_REQUEST)

        response = super().post(request, *args, **kwargs)

        user_serializer = UserSerializer(user, context={'request': request})
        user_data = user_serializer.data

        response.data['user'] = user_data

        return response


@api_view(['POST'])
def verifyOTPView(request):
    serializer = VerifyOTPSerializer(
        context={'request': request}, data=request.data)
    serializer.is_valid(raise_exception=True)
    login_info = serializer.save()
    return Response(login_info, status=200)


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


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        # Extract the refresh token from the request data
        refresh_token = request.data.get('refresh')

        if not refresh_token:
            return Response({'detail': 'No refresh token provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Decode the refresh token to get the user ID
        decoded_payload = RefreshToken(refresh_token).payload
        user_id = decoded_payload['user_id']

        # Fetch the user from the database
        user = User.objects.get(id=user_id)

        # Use the refresh token to get a new access token
        response = super().post(request, *args, **kwargs)

        # Include additional user information in the response
        user_serializer = UserSerializer(user, context={'request': request})
        user_data = user_serializer.data
        response.data['user'] = user_data

        return response


class CustomLogoutView(APIView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get('refresh')

        if not refresh_token:
            return Response({'detail': 'No refresh token provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()

        except Exception as e:
            return Response({'detail': 'Invalid refresh token'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'detail': 'Logout successful'}, status=status.HTTP_200_OK)


# upload avatar
class UserAvatar(APIView):

    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    authentication_classes = [JWTAuthentication]

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
    authentication_classes = [JWTAuthentication]

    def get(self, request, format=None):
        users = User.objects.all()
        serializer = UserSerializer(
            users, context={'request': request}, many=True)
        return Response(serializer.data)


class UserDetail(APIView):
    """
    Retrieve, update or delete a user instance
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_object(self, pk):
        try:
            obj = User.objects.get(pk=pk)
            self.check_object_permissions(self.request, obj)
            return obj
        except User.DoesNotExist:
            return Http404

    def get(self, request, pk, format=None):
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


class UserGames(APIView):
    """
    Retrieve all games of a user
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk, format=None):
        user = get_object_or_404(User, pk=pk)
        # games the user participated in
        games = Game.objects.filter(Q(user1=user) | Q(user2=user) | Q(user3=user) | Q(user4=user))