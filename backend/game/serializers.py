from django.conf import settings
from rest_framework import serializers
from .models import Game, Tournament, Invitation
from django.contrib.auth import get_user_model
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'avatar']

    def get_avatar(self, obj):
        if obj.avatar:
            # Replace 'SERVER_URL' with the actual setting name
            server_url = settings.SERVER_URL
            return f"{server_url}{obj.avatar.url}"
        return None


class GameSerializer(serializers.ModelSerializer):
    user1 = UserSerializer(read_only=True)
    user2 = UserSerializer(read_only=True)
    user3 = UserSerializer(read_only=True)
    user4 = UserSerializer(read_only=True)
    winner = UserSerializer(read_only=True)

    class Meta:
        model = Game
        fields = ['id', 'user1', 'user2', 'user3', 'user4', 'user1_score',
                  'user2_score', 'winner', 'type', 'timestamp']


class TournamentSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    winner = UserSerializer(read_only=True)
    user1 = UserSerializer(read_only=True)
    user2 = UserSerializer(read_only=True)
    user3 = UserSerializer(read_only=True)
    user4 = UserSerializer(read_only=True)
    semi1 = GameSerializer(read_only=True)
    semi2 = GameSerializer(read_only=True)
    final = GameSerializer(read_only=True)

    class Meta:
        model = Tournament
        fields = ['id', 'creator', 'user1', 'user2', 'user3', 'user4',
                    'user1_left', 'user2_left', 'user3_left', 'user4_left'
                    ,'semi1', 'semi2', 'final',
                  'started', 'winner', 'timestamp']


class InvitationSerializer(serializers.ModelSerializer):
    sender = UserSerializer()
    receiver = UserSerializer()

    class Meta:
        model = Invitation
        fields = ['id', 'sender', 'receiver',
                  'timestamp', 'type', 'is_accepted']
