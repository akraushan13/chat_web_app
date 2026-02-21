from rest_framework import serializers
from home.models import User
from django.conf import settings

class UserSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['bio','display_name', 'image', 'gender', 'verified']
    
    def get_image(self, obj):
        if obj.image:
            return self.context['request'].build_absolute_uri(obj.image.url)
        return ''