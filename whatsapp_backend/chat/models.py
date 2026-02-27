from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class Chat(models.Model):
    slug = models.SlugField(unique=True, blank=True)
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL)
    
    def save(self , *args , **kwargs):
        if not self.slug:
            self.slug = uuid.uuid4().hex
        super().save(*args , **kwargs)

    def __str__(self):
        return self.slug


class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    is_delivered = models.BooleanField(default=False)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["timestamp"]
        indexes = [
            models.Index(fields=["chat" , "timestamp"]) ,
            models.Index(fields=["sender"]) ,
        ]

    def __str__(self):
        return f"{self.sender} - {self.content[:20]}"
