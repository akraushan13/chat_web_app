from django.db import models
from django.core.exceptions import ValidationError
from whatsapp.utils.models import TimeBasedModel
from whatsapp.utils.slug import gen_slug
from django.utils.functional import cached_property
# Create your models here.

class Chat(TimeBasedModel):
    slug = models.SlugField(
        unique=True,
        max_length=200,
        default=gen_slug)
    participants = models.ManyToManyField('home.User')

    def __str__(self):
        return f"Chat {self.slug}"

    # @cached_property
    # def members(self):
    #     return ", ".join(self.participants.values_list(
    #         'user__username', flat=True))

    # @property
    # def last_message(self):
    #     message = []
    #     if self.message_set.all().count > 0:
    #         message = self.message_set.last()
    #     return message


    def clean(self, *args, **kwargs):
        if self.participants.count() > 2:
            raise ValidationError("You can't be more than 2 users in a chat")
        super(Chat, self).clean(*args, **kwargs)

# class Message(TimeBasedModel):
#     chat = models.ForeignKey(
#         'chat.Chat',
#         null=True,
#         blank=True,
#         on_delete=models.SET_NULL)
#     sender = models.ForeignKey(
#         'home.User',
#         verbose_name='sender',
#         on_delete=models.CASCADE)
#     text = models.TextField(verbose_name="Message text")
#     read = models.BooleanField(verbose_name="Read", default=False)

#     def __str__(self):
#         return self.text # TODO
        