from django.db import models
from django.contrib.auth.models import AbstractUser
from whatsapp.utils.choices import GenderChoices
from whatsapp.utils.image import uploaded_image_path

# Create your models here.

class User(AbstractUser):
    bio = models.TextField(default='Something Amazing about Me')
    display_name = models.CharField(max_length=100, null=True, blank=True)
    image = models.ImageField(
            null=True, blank=True
        )
    gender = models.CharField(max_length=20, 
            choices=GenderChoices.choices, default=GenderChoices.others
        )
    verified = models.BooleanField(default=False)