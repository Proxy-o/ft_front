
from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import FriendRequestSerializer, UserSerializer
from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import permissions
from chat_app.models import Message
from .models import Friend_Request
User = get_user_model()


@api_view(['GET'])
def get_friends(request, userId):
    user = get_object_or_404(User, pk=userId)
    friends = user.friends.all()
    # add a has_unread_messages field to each friend if the last message is unread
    for friend in friends:
        has_unread_messages = False
        last_message = Message.objects.filter(
            Q(user=friend, receiver=user)).last()
        if last_message and last_message.user == friend and not last_message.read:
            has_unread_messages = True

    serializer = UserSerializer(
        friends, context={'request': request, }, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def search_users(request, search_query):
    if not search_query:
        return Response({'detail': 'Search query is empty'}, status=status.HTTP_400_BAD_REQUEST)
    # if no alphanumeric characters in search query
    if not any(char.isalnum() for char in search_query):
        return Response({'detail': 'Search query is invalid'}, status=status.HTTP_400_BAD_REQUEST)
    users = User.objects.filter(
        Q(username__icontains=search_query) | Q(
            first_name__icontains=search_query) | Q(last_name__icontains=search_query))
    users = users.exclude(pk=request.user.pk)
    serializer = UserSerializer(
        users, context={'request': request}, many=True)
    return Response(serializer.data)


@ api_view(['POST'])
def send_friend_request(request, pk):
    from_user = request.user
    to_user = get_object_or_404(User, pk=pk)
    if from_user in to_user.friends.all():
        return Response({'detail': 'You are already friends'}, status=status.HTTP_400_BAD_REQUEST)
    if from_user == to_user:
        return Response({'detail': 'You cannot send a friend request to yourself'}, status=status.HTTP_400_BAD_REQUEST)
    # if the firend is blocked
    if to_user in from_user.blocked.all():
        return Response({'detail': 'This user is blocked'}, status=status.HTTP_400_BAD_REQUEST)
    if from_user in to_user.blocked.all():
        return Response({'detail': 'You are blocked by this user'}, status=status.HTTP_400_BAD_REQUEST)
    friend_request, created = Friend_Request.objects.get_or_create(
        from_user=from_user, to_user=to_user)
    if created:
        return Response({'detail': 'Friend request sent'}, status=status.HTTP_201_CREATED)
    else:
        return Response({'detail': 'Friend request already sent'}, status=status.HTTP_400_BAD_REQUEST)


@ api_view(['POST'])
def accept_friend_request(request, pk):
    friend_request = Friend_Request.objects.get(pk=pk)
    if friend_request.to_user == request.user:
        friend_request.from_user.friends.add(friend_request.to_user)
        friend_request.to_user.friends.add(friend_request.from_user)
        friend_request.delete()
        return Response({'detail': 'Friend request accepted'}, status=status.HTTP_201_CREATED)
    else:
        return Response({'detail': 'You cannot accept this friend request'}, status=status.HTTP_400_BAD_REQUEST)


@ api_view(['POST'])
def delete_friend_request(request, pk):
    friend_request = get_object_or_404(Friend_Request, pk=pk)
    if friend_request.to_user == request.user or friend_request.from_user == request.user:
        friend_request.delete()
        return Response({'detail': 'Friend request declined'}, status=status.HTTP_201_CREATED)
    else:
        return Response({'detail': 'You cannot decline this friend request'}, status=status.HTTP_400_BAD_REQUEST)


@ api_view(['GET'])
def get_friend_requests(request):
    friend_requests = Friend_Request.objects.filter(Q(from_user=request.user) | Q(
        to_user=request.user)).order_by('timestamp').reverse()
    serializer = FriendRequestSerializer(
        friend_requests, context={'request': request}, many=True)
    return Response(serializer.data)


@ api_view(['POST'])
def remove_friend(request, pk):
    friend = get_object_or_404(User, pk=pk)
    if friend in request.user.friends.all():
        request.user.friends.remove(friend)
        friend.friends.remove(request.user)
        return Response({'detail': 'Friend removed'}, status=status.HTTP_201_CREATED)
    else:
        return Response({'detail': 'You are not friends with this user'}, status=status.HTTP_400_BAD_REQUEST)


@ api_view(['POST'])
@ permission_classes([permissions.IsAuthenticated])
def block_user(request, pk):
    user = get_object_or_404(User, pk=pk)
    if user in request.user.blocked.all():
        return Response({'detail': 'User is already blocked'}, status=status.HTTP_400_BAD_REQUEST)
    if user == request.user:
        return Response({'detail': 'You cannot block yourself'}, status=status.HTTP_400_BAD_REQUEST)
    if user in request.user.friends.all():
        request.user.friends.remove(user)
        user.friends.remove(request.user)
    friend_requests = Friend_Request.objects.filter(
        Q(from_user=request.user, to_user=user) | Q(from_user=user, to_user=request.user))
    for friend_request in friend_requests:
        friend_request.delete()
    request.user.blocked.add(user)
    return Response({'detail': 'User blocked'}, status=status.HTTP_201_CREATED)


@ api_view(['POST'])
def unblock_user(request, pk):
    user = get_object_or_404(User, pk=pk)
    if user in request.user.blocked.all():
        request.user.blocked.remove(user)
        return Response({'detail': 'User unblocked'}, status=status.HTTP_201_CREATED)
    else:
        return Response({'detail': 'User is not blocked'}, status=status.HTTP_400_BAD_REQUEST)


@ api_view(['GET'])
def get_blocked_users(request):
    # Get users who are either blocked by the current user or have blocked the current user
    blocked_by_user = request.user.blocked.all()
    blocked_users = User.objects.filter(blocked=request.user)
    serialized_data = []
    for user in blocked_by_user:
        user_data = UserSerializer(user, context={'request': request}).data
        user_data['blocked_by_user'] = True
        serialized_data.append(user_data)

    for user in blocked_users:
        user_data = UserSerializer(user, context={'request': request}).data
        user_data['blocked_by_user'] = False
        serialized_data.append(user_data)

    return Response(serialized_data, status=status.HTTP_200_OK)
