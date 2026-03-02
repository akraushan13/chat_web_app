from django.contrib import admin
from .models import Chat, Message


class MessageInline(admin.TabularInline):
    model = Message
    extra = 0
    readonly_fields = ("timestamp",)
    ordering = ("-timestamp",)


@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = ("slug", "participant_list")
    search_fields = ("slug",)
    filter_horizontal = ("participants",)
    inlines = [MessageInline]

    def participant_list(self, obj):
        return ", ".join([user.username for user in obj.participants.all()])
    participant_list.short_description = "Participants"


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("chat", "sender", "short_content", "timestamp", "is_delivered", "is_read")
    list_filter = ("is_delivered", "is_read", "timestamp")
    search_fields = ("content", "sender__username")
    readonly_fields = ("timestamp",)
    ordering = ("-timestamp",)

    def short_content(self, obj):
        return obj.content[:40]
    short_content.short_description = "Message"