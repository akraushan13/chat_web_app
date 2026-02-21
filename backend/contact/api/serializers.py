from rest_framework import serializers
from contact.models import Contact
from chat.models import Chat
from home.api.serializers import UserSerializer

class ContactSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    contact = UserSerializer()
    chat_slug = serializers.SerializerMethodField()
    class Meta:
        model = Contact
        depth = 1
        fields = ['pk','user', 'name', 'contact', 'slug', 'created_at', 'modified_at', 'chat_slug']
    
    def get_chat_slug(self , obj):
        chat = Chat.objects.filter(
            participants=obj.user
        ).filter(
            participants=obj.contact
        ).first()
        
        return chat.slug if chat else None
