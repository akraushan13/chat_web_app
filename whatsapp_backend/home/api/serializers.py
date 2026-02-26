from rest_framework import serializers
from home.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "bio", "image", "verified"]
