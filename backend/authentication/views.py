from django.contrib.auth.models import User
from rest_framework.pagination import PageNumberPagination
from urllib.parse import urlencode
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from django.conf import settings
from django.shortcuts import redirect
from rest_framework.response import Response
from rest_framework import status, serializers
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
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from authentication.customJWTAuthentication import CustomJWTAuthentication
from authentication.ft_utils import google_get_access_token, google_get_user_info, generate_tokens_for_user
from django.contrib.auth import get_user_model
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

        # Get the token from the response
        token = response.data.get('access')
        # remove the token from the response
        response.data.pop('access')
    
        refresh = response.data.get('refresh')        

        # Create an HttpOnly cookie with the token
        response.set_cookie(
            'access',
            token,
            max_age=36000,
            expires=36000,
            httponly=True,
            secure=True,  # Use secure=True if your site is served over HTTPS
            samesite='None'  # Adjust as needed, could also be 'Strict' or 'None'
        )
        response.set_cookie(
            'refresh',
            refresh,
            max_age=36000,
            expires=36000,
            httponly=False,
            secure=True,  # Use secure=True if your site is served over HTTPS
            samesite='None'  # Adjust as needed, could also be 'Strict' or 'None'
        )


        # Add user data to the response
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
    authentication_classes = []
    def post(self, request, *args, **kwargs):
        response = Response({'detail': 'Successfully logged out'}, status=status.HTTP_200_OK)
        try :
            refresh_token = request.data.get('refresh')
            if  refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
        except Exception as e:
            response
        if request.COOKIES.get('access') or request.COOKIES.get('refresh'):
            response.delete_cookie('access')
            response.delete_cookie('refresh')
        return response

        

            # If the refresh token is invalid, return a success response
            
   
        



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
    # permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    authentication_classes = [CustomJWTAuthentication]

    def get_object(self, pk):
        try:
            obj = User.objects.get(pk=pk)
            # self.check_object_permissions(self.request, obj)
            return obj
        except User.DoesNotExist:
            return Http404

    def get(self, request, pk, format=None):
        user = self.get_object(pk)
        print(request.COOKIES)
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




        
        
        


# 0auth 2.0



class FtLoginApi( APIView):
    authentication_classes = []
    class InputSerializer(serializers.Serializer):
        code = serializers.CharField(required=False)
        error = serializers.CharField(required=False)

    def get(self, request, *args, **kwargs):
        input_serializer = self.InputSerializer(data=request.GET)
        input_serializer.is_valid(raise_exception=True)
        print("input_serializer", input_serializer)

        validated_data = input_serializer.validated_data

        code = validated_data.get('code')
        error = validated_data.get('error')

        login_url = f'{settings.BASE_FRONTEND_URL}/login'
    
        # if error or not code:
        #     params = urlencode({'error': error})
        #     return redirect(f'{login_url}?{params}')

        redirect_uri = f'{settings.BASE_FRONTEND_URL}/google/'
        access_token = google_get_access_token(code=code, 
                                               redirect_uri=redirect_uri)

        user_data = google_get_user_info(access_token=access_token)

        # try:
        #     user = User.objects.get(email=user_data['email'])
        #     access_token, refresh_token = generate_tokens_for_user(user)
        #     response_data = {
        #         'user': UserSerializer(user).data,
        #         'access_token': str(access_token),
        #         'refresh_token': str(refresh_token)
        #     }
        #     return Response(response_data)
        # except User.DoesNotExist:
        #     username = user_data['email'].split('@')[0]
        #     first_name = user_data.get('given_name', '')
        #     last_name = user_data.get('family_name', '')

        #     user = User.objects.create(
        #         username=username,
        #         email=user_data['email'],
        #         first_name=first_name,
        #         last_name=last_name,
        #         registration_method='google',
        #         phone_no=None,
        #         referral=None
        #     )
         
        #     access_token, refresh_token = generate_tokens_for_user(user)
        #     response_data = {
        #         'user': UserSerializer(user).data,
        #         'access_token': str(access_token),
        #         'refresh_token': str(refresh_token)
        #     }
        #     return Response(response_data)