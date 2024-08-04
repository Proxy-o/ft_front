from django.contrib.auth.models import AbstractUser

from django.db import models


def upload_to(instance, filename):
    ext = filename.split('.')[-1]
    return f'images/{instance.username}.{ext}'


def get_default_avatar():
    return 'images/default_avatar.jpg'

class User(AbstractUser):
    username = models.CharField(max_length=10, unique=True)
    
    avatar = models.ImageField(
        upload_to=upload_to, default=get_default_avatar)
    status = models.CharField(max_length=100, blank=True)
    friends = models.ManyToManyField("self", blank=True)
    blocked = models.ManyToManyField("self", blank=True, symmetrical=False)
    status = models.CharField(max_length=100, default='offline')
    # 2FA
    otp_active = models.BooleanField(default=False)
    otpauth_url = models.CharField(max_length=225, blank=True, null=True)
    otp_base32 = models.CharField(max_length=255, null=True)
    qr_code = models.ImageField(upload_to="qrcode/", blank=True, null=True)
