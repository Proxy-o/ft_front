from rest_framework import serializers
from .models import Friend_Request
from django.contrib.auth import get_user_model
from  django.db.models import Q
from chat_app.models import Message
import urllib.parse
from django.conf import settings
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    
    avatar = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'username', 'avatar', 'status']
        
    def get_avatar(self, obj):
        if obj.avatar :
            avatar_url : str = urllib.parse.unquote(obj.avatar.url)
            if avatar_url.startswith('/https'):
                avatar_url = avatar_url.replace('/https:/', 'https://', 1)
                return avatar_url
            else :
                server_url = settings.SERVER_URL
                return f"{server_url}{obj.avatar.url}"
        return None

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        last_message = Message.objects.filter(
            Q(user=instance, receiver=self.context['request'].user) 
        ).last()
        
        if last_message and not last_message.read:
            representation['has_unread_messages'] = True
        else:
            representation['has_unread_messages'] = False
        return representation


class FriendRequestSerializer(serializers.ModelSerializer):
    from_user = UserSerializer()
    to_user = UserSerializer()

    class Meta:
        model = Friend_Request
        fields = ['id',  'from_user', 'to_user']
