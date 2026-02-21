from django.db import models
from whatsapp.utils.slug import gen_slug

from whatsapp.utils.models import NameBasedModel

# Create your models here.

class Contact(NameBasedModel):
    user = models.ForeignKey('home.User', on_delete=models.CASCADE, related_name='contact_user')
    contact = models.ForeignKey('home.User', on_delete=models.CASCADE, related_name='contact')
    slug = models.SlugField(null=True, blank=True, default=gen_slug)

    def __str__(self):
        return f'{self.user.username} saved Contact {self.name}'