from rest_framework import generics
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from contact.models import Contact
from .serializers import ContactSerializer
from chat.models import Chat

from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.db.models import Count

User = get_user_model()

from django.db import transaction

def get_or_create_private_chat(user1, user2):
    chats = Chat.objects.filter(
        participants=user1
    ).filter(
        participants=user2
    )

    if chats.exists():
        return chats.first()

    with transaction.atomic():
        chat = Chat.objects.create()
        chat.participants.set([user1, user2])
        return chat


class ContactListCreateView(generics.ListCreateAPIView):
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        print("Logged user:" , self.request.user)
        return Contact.objects.filter(user=self.request.user).select_related("contact")
    
    from django.db.models import Count
    
    def post(self , request):
        phone = request.data.get("phoneNumber")
        display_name = request.data.get("displayName")
        
        if not phone or not display_name:
            return Response(
                {"error": "Phone number and display name required"} ,
                status=400
            )
        
        try:
            other_user = User.objects.get(username=phone)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"} ,
                status=404
            )
        
        contact = Contact.objects.create(
            user=request.user ,
            name=display_name ,
            contact=other_user
        )
        
        # SAFE CHECK
        chat = get_or_create_private_chat(request.user, other_user)
        
        serializer = ContactSerializer(contact)
        return Response(serializer.data , status=201)

class ContactDetailView(RetrieveAPIView):
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "slug"

    def get_queryset(self):
        return Contact.objects.filter(user=self.request.user)