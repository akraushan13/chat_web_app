from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, get_user_model
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from rest_framework import status

from .serializers import UserSerializer

User = get_user_model()


class SignupView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Username and password required"}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": "User already exists"}, status=400)

        user = User.objects.create_user(username=username, password=password)
        # token = Token.objects.create(user=user)

        return Response({
            # "token": token.key,
            "user": user.username
        }, status=201)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        
        if user is None:
            return Response(
                {"error": "Invalid credentials"} ,
                status=status.HTTP_400_BAD_REQUEST
            )

        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            "token": token.key,
            "user": user.username
        })


class ProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    
class CheckUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        phone = request.GET.get("q")

        if not phone:
            return Response({
                "message": "Enter phone number",
                "can_add": False
            })

        try:
            user = User.objects.get(username=phone)

            if user == request.user:
                return Response({
                    "message": "You cannot add yourself",
                    "can_add": False
                })

            return Response({
                "message": "User found",
                "can_add": True
            })

        except User.DoesNotExist:
            return Response({
                "message": "User not found",
                "can_add": False
            })
        
class EditProfileView(generics.UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser , FormParser, JSONParser, ]

    def get_object(self):
        return self.request.user