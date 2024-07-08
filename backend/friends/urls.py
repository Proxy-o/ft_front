from django.urls import path
from . import views

urlpatterns = [
    path('friend_request', views.get_friend_requests),
    path('friend_request/<int:pk>', views.send_friend_request),
    path('friend_request/accept/<int:pk>', views.accept_friend_request),
    path('friend_request/delete/<int:pk>', views.delete_friend_request),
    path('friends/<int:userId>', views.get_friends),
    path('friends/remove/<int:pk>', views.remove_friend),
    path('friends/block/<int:pk>', views.block_user),
    path('friends/unblock/<int:pk>', views.unblock_user),
    path('friends/blocked', views.get_blocked_users),
    path('friends/search/<str:search_query>', views.search_users),
]
