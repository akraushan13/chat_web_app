from home.api.serializers import UserSerializer
from contact.api.serializers import ContactSerializer
from rest_framework import generics, permissions, authentication, response, status
from contact.models import Contact
from home.models import User
from chat.models import Chat

class ContactListCreateView(generics.ListCreateAPIView):
    serializer_class = ContactSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        keyword = self.request.GET.get('q', None)
        contacts = Contact.objects.filter(user=self.request.user)
        if keyword:
            return contacts.filter(
                name__icontains=keyword
                )
        return contacts
    
    # def post(self, request):
    #     data = request.data
    #     user = User.objects.get(username=data.get('phoneNumber'))
    #     contact = Contact.objects.create(
    #         user=self.request.user, name=data.get('displayName'),
    #         contact = user
    #         )
    #     serializer = ContactSerializer(contact, context= {'request':request})
    #     return response.Response(serializer.data)
    
    def post(self , request):
        data = request.data
        current_user = request.user
        other_user = User.objects.get(username=data.get('phoneNumber'))
        
        #  Create contact for current user
        contact , _ = Contact.objects.get_or_create(
            user=current_user ,
            contact=other_user ,
            defaults={"name": data.get("displayName")}
        )
        
        #  Create reverse contact automatically
        Contact.objects.get_or_create(
            user=other_user ,
            contact=current_user ,
            defaults={"name": current_user.display_name or current_user.username}
        )
        
        #  Strict 2-user chat check
        chat = Chat.objects.filter(
            participants=current_user
        ).filter(
            participants=other_user
        ).first()
        
        if not chat:
            chat = Chat.objects.create()
            chat.participants.set([current_user , other_user])
        
        serializer = ContactSerializer(contact , context={'request': request})
        return response.Response(serializer.data , status=201)


class ContactDetailApiView(generics.RetrieveAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'slug'
