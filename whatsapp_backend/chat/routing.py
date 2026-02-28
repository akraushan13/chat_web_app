from django.urls import re_path
from .consumers import ChatConsumer, GlobalChatConsumer

websocket_urlpatterns = [
    
    re_path(r"ws/chat/$", GlobalChatConsumer.as_asgi()),
    re_path(r'ws/(?P<slug>[\w-]+)/$', ChatConsumer.as_asgi()),
]
