from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    bio = models.TextField(blank=True)
    image = models.ImageField(upload_to='profiles/', null=True, blank=True)
    verified = models.BooleanField(default=False)