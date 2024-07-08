
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import render

from chat_app.models import Room
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.http import Http404
from .models import Message
from .serializers import MessageSerializer
from rest_framework.response import Response
from authentication.permissions import IsOwner
from django.db.models import Q
from .pagination import ChatPagination
from django.shortcuts import get_object_or_404

from django.contrib.auth import get_user_model
User = get_user_model()




class Conversation(APIView):
    permission_classes = [IsAuthenticated, IsOwner]
    pagination_class = PageNumberPagination
    pagination_class.page_size = 40  # Set page size to 10 messages per page

    def get_object(self, pk):
        try:
            obj = User.objects.get(pk=pk)
            self.check_object_permissions(self.request, obj)
            return obj
        except User.DoesNotExist:
            raise Http404

    def get(self, request, user_pk, receiver_pk):
        # Get messages exchanged between the two users
        messages = Message.objects.filter(
            Q(user_id=user_pk, receiver_id=receiver_pk) | Q(
                user_id=receiver_pk, receiver_id=user_pk)
        ).order_by('timestamp').reverse()

        # Paginate the queryset
        paginator = self.pagination_class()
        paginated_messages = paginator.paginate_queryset(messages, request)

        # Serialize the paginated messages
        serializer = MessageSerializer(paginated_messages, many=True)

        # Return the paginated serialized data as a response
        return paginator.get_paginated_response(serializer.data)
    
@api_view(['POST'])
def unread_messages(request,friend_id):
    
    user = request.user
    friend = get_object_or_404(User,pk=friend_id)
    messages = Message.objects.filter(user=friend,receiver=user,read=False)
    for message in messages:
        message.read = True
        message.save()
    return Response({'detail':'All messages marked as read'},status=200)
         
