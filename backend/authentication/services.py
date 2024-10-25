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
import pyotp
import qrcode
from django.core.files.base import ContentFile
from io import BytesIO
from django.utils.crypto import get_random_string

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

        if not code:
            return None, None, {'detail': 'Code is required'}
       
        if state != settings.OAUTH_PROVIDERS[provider]['state']:
            return None, None, {'detail': 'Invalid state'}

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
        headers = {
            'Accept': 'application/json'
        }
        response = requests.post(token_url, data=data, headers=headers)
        data = response.json()
        if response.status_code != 200 or 'access_token' not in data:
            return None, None, {'detail': 'Invalid credentials'}


        user_credentials = {
            'provider': provider,
            'access_token': data['access_token'],
        }
        headers['Authorization'] = f'Bearer {user_credentials["access_token"]}'
        user_infos, error = OAuthService.get_user_infos(provider, headers)
        if error:
            return None, None, error
        
        credentials = OAuthCredential.objects.filter(user_oauth_uid=user_infos['id']).first()
        if not credentials:
            request_data = {
                'username': user_infos['login'],
                'password': User.objects.make_random_password(),
                'has_oauth_credentials': True,
                'avatar': user_infos['avatar_url']
            }
            counter = 1
            new_username = f"{request_data['username']}"
            while User.objects.filter(username=new_username).exists():
                new_username = f"{request_data['username']}_{counter}"
                # print("### try : ", new_username)
                counter += 1
            request_data['username'] = new_username
            user, error = OAuthService.create_user(request_data)
            if error:
                return None, None, error
        else:
            user = User.objects.filter(id=credentials.user.id).first()
        user_credentials['user'] = user.id
        user_credentials['user_oauth_uid'] = user_infos['id']
        return user, user_credentials, None

    @staticmethod
    def create_user(validated_data):
        try:
            otp_base32 = pyotp.random_base32()
            otp_auth_url = pyotp.totp.TOTP(otp_base32).provisioning_uri(
                name=validated_data.get('email'), issuer_name='FT Transcendence')
            stream = BytesIO()
            image = qrcode.make(f"{otp_auth_url}")
            image.save(stream)
            user = User.objects.create(
                username=validated_data['username'],
                # email=validated_data['email'],
                password=validated_data['password'],
                has_oauth_credentials=validated_data['has_oauth_credentials'],
                avatar=validated_data['avatar'],
                otp_base32= otp_base32,
                s_token=User.objects.make_random_password()
                
            )
            user.set_password(validated_data['password'])
            user.qr_code = ContentFile(
            stream.getvalue(), name=f"qr{get_random_string(10)}.png")
            user.save()
            return user, None
        except Exception as e:
            return None, {'detail': str(e)}
    
    @staticmethod
    def get_user_infos(provider, headers):
        user_info_url = settings.OAUTH_PROVIDERS[provider]['user_info_url']

        response = requests.get(user_info_url, headers=headers)
        if response.status_code != 200 or 'error' in response.json():
            return None, {'detail': 'Invalid credentials'}
        
        user_infos = response.json()
        # if 'email' not in user_infos or not user_infos['email']:
        #     email_response = requests.get(f"{user_info_url}/emails", headers=headers)
        #     if email_response.status_code == 200:
        #         emails = email_response.json()
        #         print('emails:', emails)
        #         primary_emails = [email for email in emails if email.get('primary') and email.get('verified')]
        #         if primary_emails:
        #             user_infos['email'] = primary_emails[0]['email']
        if 'image' in user_infos:
            user_infos['avatar_url'] = user_infos['image']['link']
        return user_infos, None
        
        