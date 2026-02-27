from rest_framework import serializers
from contact.models import Contact
from chat.models import Chat
from home.api.serializers import UserSerializer

class ContactSerializer(serializers.ModelSerializer):
    chat_slug = serializers.SerializerMethodField()
    contact = UserSerializer(read_only=True)

    class Meta:
        model = Contact
        fields = ["id", "name", "slug", "contact", "chat_slug"]

    def get_chat_slug(self, obj):
        chat = Chat.objects.filter(participants=obj.user)\
                           .filter(participants=obj.contact)\
                           .first()
        return chat.slug if chat else None
