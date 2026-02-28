from rest_framework import generics, permissions
from chat.models import Message, Chat
from .serializers import MessageSerializer
from rest_framework.pagination import PageNumberPagination

class MessagePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 50

class ChatMessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = MessagePagination

    def get_queryset(self):
        slug = self.kwargs["slug"]
        chat = Chat.objects.get(slug=slug)
        
        return Message.objects.filter(chat=chat).order_by("timestamp")
