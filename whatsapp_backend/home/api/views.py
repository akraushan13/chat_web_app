from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, get_user_model

from rest_framework.authentication import TokenAuthentication
from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

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
        

        return Response({
            "user": user.username
        }, status=201)

from rest_framework_simplejwt.tokens import RefreshToken

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if not user:
            return Response(
                {"error": "Invalid credentials"},
                status=400
            )

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": user.username
        })


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"message": "Logout successful"})
        except Exception:
            return Response({"error": "Invalid token"}, status=400)


class ProfileView(APIView):
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