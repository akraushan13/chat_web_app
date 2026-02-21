import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from chat.models import Chat, Message
from django.contrib.auth.models import AnonymousUser

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.chat_slug = self.scope['url_route']['kwargs']['chat_slug']
        self.room_group_name = f"chat_{self.chat_slug}"

        user = self.scope["user"]

        if user == AnonymousUser():
            await self.close()
            return

        chat = await sync_to_async(Chat.objects.get)(slug=self.chat_slug)

        # STRICT participant check
        is_participant = await sync_to_async(
            chat.participants.filter(id=user.id).exists
        )()

        if not is_participant:
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_text = data["message"]

        user = self.scope["user"]
        chat = await sync_to_async(Chat.objects.get)(slug=self.chat_slug)

        message_obj = await sync_to_async(Message.objects.create)(
            chat=chat,
            sender=user,
            text=message_text
        )

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "id": message_obj.id,
                "sender": user.id,
                "message": message_obj.text,
                "time": message_obj.created_at.strftime("%I:%M %p"),
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))
