from django.conf import settings
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework.response import Response
from rest_framework import status
import requests
from urllib.parse import urlencode
from datetime import datetime, timedelta
from .models import OAuthCredential

User = get_user_model()

class OAuthService:
    @staticmethod
    def get_redirect_url(provider):
        if provider not in settings.OAUTH_PROVIDERS:
            return None, {'detail': 'Invalid provider'}

        base_url = settings.OAUTH_PROVIDERS[provider]['base_url']
        auth_url = base_url + settings.OAUTH_PROVIDERS[provider]['authorize_url']
        client_id = settings.OAUTH_PROVIDERS[provider]['client_id']
        redirect_uri = settings.OAUTH_PROVIDERS[provider]['redirect_uri']
        scope = settings.OAUTH_PROVIDERS[provider]['scope']
        state = settings.OAUTH_PROVIDERS[provider]['state']
        query_params = {
            'redirect_uri': redirect_uri,
            'client_id': client_id,
            'scope': scope,
            'state': state,
            'response_type': 'code'
        }
        redirect_uri = f'{auth_url}?{urlencode(query_params)}'
        return redirect_uri, None

    @staticmethod
    def handle_callback(provider, code, state):
        if provider not in settings.OAUTH_PROVIDERS:
            return None, None, {'detail': 'Invalid provider'}

        base_url = settings.OAUTH_PROVIDERS[provider]['base_url']
        token_url = base_url + settings.OAUTH_PROVIDERS[provider]['token_url']
        client_id = settings.OAUTH_PROVIDERS[provider]['client_id']
        client_secret = settings.OAUTH_PROVIDERS[provider]['client_secret']
        redirect_uri = settings.OAUTH_PROVIDERS[provider]['redirect_uri']

        data = {
            'grant_type': 'authorization_code',
            'code': code,
            'client_id': client_id,
            'client_secret': client_secret,
            'redirect_uri': redirect_uri
        }

        response = requests.post(token_url, data=data)
        if response.status_code != 200:
            return None, None, {'detail': 'Invalid credentials'}
        data = response.json()
        expires_at = datetime.fromtimestamp(data['created_at']) + timedelta(seconds=data['expires_in'])
        user_credentials = {
            'provider': provider,
            'refresh_token': data['refresh_token'],
            'access_token': data['access_token'],
            'expires_at': expires_at.isoformat()
        }
        user_info_url = base_url + settings.OAUTH_PROVIDERS[provider]['user_info_url']
        response = requests.get(user_info_url, headers={'Authorization': f'Bearer {user_credentials["access_token"]}'})

        user_infos = response.json()
        credentials = OAuthCredential.objects.filter(user_oauth_uid=user_infos['id']).first()
        if not credentials:
            request_data = {
                'username': user_infos['login'],
                'password': User.objects.make_random_password(),
                'has_oauth_credentials': True,
                'avatar': user_infos["image"]["link"]
            }
            prefix = "ft_"
            counter = 1
            new_username = f"{prefix}{request_data['username']}"
            while User.objects.filter(username=new_username).exists():
                new_username = f"{prefix}{request_data['username']}_{counter}"
                print("### try : ", new_username)
                counter += 1
            request_data['username'] = new_username
            user, error = OAuthService.create_user(request_data)
            if error:
                return None, None, error
        else:
            print("### credentials : ", credentials.user.id)
            user = User.objects.filter(id=credentials.user.id).first()

        user_credentials['user'] = user.id
        user_credentials['user_oauth_uid'] = user_infos['id']
        return user, user_credentials, None

    @staticmethod
    def create_user(validated_data):
        try:
            user = User.objects.create(
                username=validated_data['username'],
                # email=validated_data['email'],
                password=validated_data['password'],
                has_oauth_credentials=validated_data['has_oauth_credentials'],
                avatar=validated_data['avatar']
                
            )
            user.set_password(validated_data['password'])
            user.save()
            return user, None
        except Exception as e:
            return None, {'detail': str(e)}
        
        