from django.db import models
from django.conf import settings
import uuid

class Contact(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    contact = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="contact_user")
    name = models.CharField(max_length=100)
    slug = models.SlugField(default=uuid.uuid4, unique=True)
