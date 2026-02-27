import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from chat.models import Chat, Message

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        self.user = self.scope["user"]
        
        if not self.user or not self.user.is_authenticated:
            await self.close()
            return
        
        self.room_slug = self.scope["url_route"]["kwargs"]["slug"]
        
        
        # Check if user is part of this chat
        is_valid = await self.is_user_in_chat(self.user , self.room_slug)
        
        if not is_valid:
            await self.close()
            return
        
        self.room_group_name = f"chat_{self.room_slug}"
        
        updated = await self.mark_messages_as_read(self.user)
        
        if updated:
            await self.channel_layer.group_send(
                self.room_group_name ,
                {
                    "type": "read_event" ,
                    "reader": self.user.id ,
                }
            )
        
        await self.channel_layer.group_add(
            self.room_group_name ,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        
        if data["type"] == "typing":
            await self.channel_layer.group_send(
                self.room_group_name ,
                {
                    "type": "typing_event" ,
                    "sender": self.user.id ,
                }
            )
            return
        
        if data["type"] == "read":
            await database_sync_to_async(
                Message.objects.filter(
                    chat__slug=self.room_slug ,
                    is_read=False
                ).exclude(sender=self.user).update
            )(is_read=True)
            
            await self.channel_layer.group_send(
                self.room_group_name ,
                {
                    "type": "read_event" ,
                    "reader": self.user.id ,
                }
            )
            
            return
        
        content = data["content"]
        user = self.scope["user"]

        saved_message = await self.save_message(user, content)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": {
                    "id": saved_message.id,
                    "sender_id": saved_message.sender.id,
                    "sender_username": saved_message.sender.username,
                    "content": saved_message.content,
                    "timestamp": saved_message.timestamp.isoformat(),
                    "is_delivered": True ,
                    "is_read": False ,
                }
            }
        )
    
    async def typing_event(self , event):
        await self.send(text_data=json.dumps({
            "type": "typing" ,
            "sender": event["sender"]
        }))
    
    async def read_event(self , event):
        await self.send(text_data=json.dumps({
            "type": "read" ,
            "reader": event["reader"]
        }))
    
    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event["message"]))

    @database_sync_to_async
    def save_message(self, user, content):
        chat = Chat.objects.get(slug=self.room_slug)
        return Message.objects.create(
            chat=chat,
            sender=user,
            content=content,
            is_delivered = True
        )
    
    @database_sync_to_async
    def is_user_in_chat(self , user , slug):
        return Chat.objects.filter(slug=slug , participants=user).exists()
    
    @database_sync_to_async
    def mark_messages_as_read(self , user):
        chat = Chat.objects.get(slug=self.room_slug)
        
        updated = Message.objects.filter(
            chat=chat ,
            is_read=False
        ).exclude(sender=user).update(is_read=True)
        
        return updated > 0
