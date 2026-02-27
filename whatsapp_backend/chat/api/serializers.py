from rest_framework import serializers
from chat.models import Message

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.CharField(source="sender.username")
    # timestamp = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = [
            "id", "sender",
            "content",
            "timestamp",
            "is_delivered",
            "is_read",
        ]
    
    # def get_timestamp(self , obj):
    #     return obj.timestamp.strftime("%H:%M")