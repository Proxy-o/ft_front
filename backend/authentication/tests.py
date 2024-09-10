
from django.test import Client, TestCase
from django.contrib.auth import get_user_model
import pyotp

from authentication.models import User


class TestCreateUser(TestCase):
    def setUp(self):
        self.client = Client()

    def test_create_user(self):
        data = {"email": "user@ridwanray.com",
                "username": "us1", "password": "12345"}
        response = self.client.post("/api/signup", data)
        assert response.status_code == 200
        user_obj = User.objects.get(email=data["email"])
        assert user_obj.check_password(data["password"])
        assert user_obj.qr_code is not None

    # def test_deny_create_user_duplicate_email(self):
    #     """Deny create user; deplicate email"""
    #     data = {"email": active_user.email, "password": "simplepass@"}
    #     response = api_client.post(self.register_url, data)
    #     assert response.status_code == 400

class CreateFourUsers(TestCase):
    def setUp(self):
        self.client = Client()

    def test_create_four_users(self):
        self.user1 = User.objects.create_user(
            username="t",
            password="ttt",
            email="e1@e1.e1"
        )
        self.user2 = User.objects.create_user(
            username="y",
            password="yyy",
            email="e2@e2.e2"
        )
        self.user3 = User.objects.create_user(
            username="u",
            password="uuu",
            email="e3.e3@e3"
        )
        self.user4 = User.objects.create_user(
            username="i",
            password="iii",
            email="e4.e4@e4"
        )


class TestVerifyOTP(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            email="us1@gmail.com", username="us1", password="12345", login_otp="12345")

    def test_verify_otp(self):
        data = {"user_id": "1", "otp": "12345"}
        response = self.client.post("/api/verify_otp", data)
        assert response.status_code == 200


class TestLogin(TestCase):
    def setUp(self):
        self.client = Client()
        # register user
        self.user = User.objects.create_user(
            email="us1@gmail.com", username="test", password="12345")
        self.user.otp_base32 = pyotp.random_base32()

    def test_login(self):
        data = {"username": "test", "password": "12345"}
        response = self.client.post("/api/login", data)
        assert response.status_code == 200
        assert self.user.otp_active == False
        assert "access" in response.data
        assert "refresh" in response.data
        assert "user" in response.data

    def test_login_2fa(self):
        self.user.otp_active = True
        self.user.save()
        data = {"username": "test", "password": "12345"}
        response = self.client.post("/api/login", data)
        assert response.status_code == 400

    def test_verify_otp(self):
        self.test_login_2fa()
        totp = pyotp.TOTP(self.user.otp_base32).now()
        data = {"user_id": "1", "otp": totp}
        response = self.client.post("/api/verify_otp", data)
        assert response.status_code == 200
