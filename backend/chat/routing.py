from django.urls import path

from chat import consumers

websocket_urlpatterns = [
    path('ws/<str:chat_slug>/', consumers.ChatConsumer.as_asgi()),
]
