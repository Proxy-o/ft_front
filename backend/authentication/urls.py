from django.urls import path
from . import views

urlpatterns = [
    path('signup', views.signup, name='signup'),
    path('login', views.Login.as_view()),
    path('logout', views.CustomLogoutView.as_view()),
    path('refresh', views.CustomTokenRefreshView.as_view()),
    path('verify_otp', views.verifyOTPView, name='verify_otp'),
    path('toggle_otp', views.toggleOTP, name='toggle_otp'),
    # oauth
    path('redirect/<str:provider>', views.OAuthRedirect.as_view(), name='oauth_redirect'),
    path('callback/<str:provider>', views.OAuthCallback.as_view(), name='oauth_callback'),
]

urlpatterns += [
    path('user', views.UserList.as_view()),
    path('user/<int:pk>', views.UserDetail.as_view()),
    path('user/<int:pk>/avatar', views.UserAvatar.as_view()),
]
