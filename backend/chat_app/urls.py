from django.urls import path

from . import views

urlpatterns = [
    # url for sender/receiver takes sender/receiver username
    path('<int:user_pk>/<int:receiver_pk>', views.Conversation.as_view()),
    path('unread_messages/<int:friend_id>', views.unread_messages),

    


]
