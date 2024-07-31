from io import BytesIO
from rest_framework import serializers
from django.contrib.auth import get_user_model
import pyotp
import qrcode
from django.core.files.base import ContentFile
from django.utils.crypto import get_random_string
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from django.conf import settings

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    
    avatar = serializers.SerializerMethodField()
    qr_code = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email',
                  'password', 'avatar', 'status', 'friends', "date_joined", "qr_code", "otp_active")
        extra_kwargs = {'password': {'write_only': True}}

    def get_avatar(self, obj):
        if obj.avatar:
            # Replace 'SERVER_URL' with the actual setting name
            server_url = settings.SERVER_URL
            return f"{server_url}{obj.avatar.url}"
        return None
    
    def get_qr_code(self, obj):
        if obj.qr_code:
            # Replace 'SERVER_URL' with the actual setting name
            server_url = settings.SERVER_URL
            return f"{server_url}{obj.qr_code.url}"
        return None


    def create(self, validated_data):
        otp_base32 = pyotp.random_base32()
        otp_auth_url = pyotp.totp.TOTP(otp_base32).provisioning_uri(
            name=validated_data.get('email'), issuer_name='FT Transcendence')
        stream = BytesIO()
        image = qrcode.make(f"{otp_auth_url}")
        image.save(stream)
        user_info = {
            "email": validated_data.get('email'),
            "username": validated_data.get('username'),
            "otp_base32": otp_base32,
        }
        user = get_user_model().objects.create(**user_info)
        user.qr_code = ContentFile(
            stream.getvalue(), name=f"qr{get_random_string(10)}.png"
        )
        user.save()
        return user


class EditUserSerializer(serializers.ModelSerializer):
    
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email',
                  'password', 'avatar', 'status')
        extra_kwargs = {'password': {'write_only': True}}

    def get_avatar(self, obj):
        if obj.avatar:
            # Replace 'SERVER_URL' with the actual setting name
            server_url = settings.SERVER_URL
            return f"{server_url}{obj.avatar.url}"
        return None

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get(
            'first_name', instance.first_name)
        instance.last_name = validated_data.get(
            'last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        if 'password' in validated_data:
            instance.password = make_password(
                validated_data.get('password'))
        instance.save()
        return instance


class AvatarSerializer(serializers.ModelSerializer):
    
    avatar = serializers.ImageField(write_only=True)

    class Meta:
        model = User
        fields = ['avatar']

    def update(self, instance, validated_data):
        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.save()
        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.avatar:
            server_url = settings.SERVER_URL
            representation['avatar'] = f"{server_url}{instance.avatar.url}"
        else:
            representation['avatar'] = None
        return representation


class VerifyOTPSerializer(serializers.Serializer):
    otp = serializers.CharField(max_length=6)
    user_id = serializers.CharField(max_length=6)

    def validate(self, attrs):
        otp = attrs.get('otp')
        user_id = attrs.get('user_id')
        user = User.objects.filter(id=user_id).first()
        if not otp or not user_id:
            raise serializers.ValidationError(
                {"otp": "OTP is required", "user_id": "Login OTP is required"})
        totp = pyotp.TOTP(user.otp_base32).now()
        if (not totp == otp):
            raise serializers.ValidationError({"otp": "Invalid OTP"})
        attrs['user'] = user
        return attrs

    def create(self, validated_data):
        user = validated_data.get("user")
        refresh = RefreshToken.for_user(user)
        return {
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
