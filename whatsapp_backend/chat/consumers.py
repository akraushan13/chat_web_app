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
        if hasattr(self , "room_group_name"):
            await self.channel_layer.group_discard(
                self.room_group_name ,
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


class GlobalChatConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        print("GLOBAL WS USER:" , self.scope.get("user"))
        self.user = self.scope.get("user")
        
        if not self.user or not self.user.is_authenticated:
            await self.close()
            return
        
        self.user_group = f"user_{self.user.id}"
        
        await self.channel_layer.group_add(
            self.user_group ,
            self.channel_name
        )
        
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "user_group"):
            await self.channel_layer.group_discard(
                self.user_group,
                self.channel_name
            )

    async def receive(self, text_data):
        data = json.loads(text_data)

        chat_slug = data.get("chat_slug")
        if not chat_slug:
            return

        if data["type"] == "message":

            saved_message = await self.save_message(
                chat_slug,
                self.user,
                data["content"]
            )

            participants = await self.get_chat_participants(chat_slug)

            payload = {
                "type": "chat_message",
                "chat_slug": chat_slug,
                "message": {
                    "id": saved_message.id,
                    "sender_id": saved_message.sender.id,
                    "sender_username": saved_message.sender.username,
                    "content": saved_message.content,
                    "timestamp": saved_message.timestamp.isoformat(),
                    "is_delivered": True,
                    "is_read": False,
                }
            }

            for user_id in participants:
                await self.channel_layer.group_send(
                    f"user_{user_id}",
                    payload
                )

        if data["type"] == "typing":

            participants = await self.get_chat_participants(chat_slug)

            for user_id in participants:
                if user_id != self.user.id:
                    await self.channel_layer.group_send(
                        f"user_{user_id}",
                        {
                            "type": "typing_event",
                            "chat_slug": chat_slug,
                            "sender": self.user.id
                        }
                    )

        if data["type"] == "read":

            await self.mark_messages_as_read(chat_slug)

            participants = await self.get_chat_participants(chat_slug)

            for user_id in participants:
                await self.channel_layer.group_send(
                    f"user_{user_id}",
                    {
                        "type": "read_event",
                        "chat_slug": chat_slug,
                        "reader": self.user.id
                    }
                )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    async def typing_event(self, event):
        await self.send(text_data=json.dumps(event))

    async def read_event(self, event):
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def save_message(self, slug, user, content):
        chat = Chat.objects.get(slug=slug)
        return Message.objects.create(
            chat=chat,
            sender=user,
            content=content,
            is_delivered=True
        )

    @database_sync_to_async
    def get_chat_participants(self, slug):
        chat = Chat.objects.get(slug=slug)
        return list(chat.participants.values_list("id", flat=True))

    @database_sync_to_async
    def mark_messages_as_read(self, slug):
        chat = Chat.objects.get(slug=slug)
        Message.objects.filter(
            chat=chat,
            is_read=False
        ).exclude(sender=self.user).update(is_read=True)