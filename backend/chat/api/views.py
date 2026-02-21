from rest_framework import generics, permissions, response
from contact.models import Contact


class ChatDetailApiView(generics.APIView):
    permission_classes = [permissions.AllowAny]
    
