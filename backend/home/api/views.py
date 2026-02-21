from django.contrib.auth import login, authenticate
from home.api import serializers
from rest_framework.views import APIView
from rest_framework import permissions, authentication, generics, response, parsers
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from home.api.serializers import UserSerializer
from home.models import User
from contact.models import Contact


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('phoneNumber')
        user, created = User.objects.get_or_create(username=username)
        token, _ = Token.objects.get_or_create(user=user)
        return response.Response({'token': f'{token}', 'user_id':user.pk})

class CheckUserAPIView(APIView):
    
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        keyword = self.request.GET.get('q', None)
        message = {'message': 'The User with this Number is not on Olofofo', 'can_add':False}
        contacts  = Contact.objects.filter(user=self.request.user).values_list('contact__username', flat=True)
        if keyword:
            try:
                user = User.objects.get(username=keyword)
                message['message'] = f'{user.display_name} {user.bio}'
                message['can_add'] = True
                if user.username == self.request.user.username:
                    message['message'] = "This Number belongs to you"
                    message['can_add'] = False
                elif user.username in contacts:
                    message['message'] = "You already have contact on your contact list"
                    message['can_add'] = False
            except:
                pass
        else:
            message['message'] = None
        return response.Response(message)


class UserDetailAPIView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, format=None):
        user = self.request.user
        serializer = UserSerializer(user, context={"request": request})
        return response.Response(serializer.data)


class UserUpdateAPIView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        data = request.data
        user = self.request.user
        user.display_name = data['name']
        user.bio = data['bio']
        user.save()
        return response.Response({'message':'Profile Updated Successfully', 'status':True}) 

class UserUpdateImageAPIView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.FormParser, parsers.MultiPartParser]
    def post(self, request):
        image = request.data.get('file', None)
        user = self.request.user
        user.image = image
        user.save()
        serializer = UserSerializer(user, context={"request": request})
        return response.Response(serializer.data) 
        


