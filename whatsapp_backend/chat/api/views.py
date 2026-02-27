from rest_framework import generics, permissions
from chat.models import Message, Chat
from .serializers import MessageSerializer

class ChatMessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        slug = self.kwargs["slug"]
        chat = Chat.objects.get(slug=slug)
        return Message.objects.filter(chat=chat).order_by("timestamp")
