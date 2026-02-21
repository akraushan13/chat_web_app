from django.contrib import admin
from chat.models import Chat
# Register your models here.


@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    filter_horizontal = ["participants"]
    list_display = [
        "__str__",
    ]

