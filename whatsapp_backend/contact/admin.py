from django.contrib import admin
from .models import Contact


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ("user", "contact", "name", "slug", "chat")
    search_fields = ("user__username", "contact__username", "name")
    list_filter = ("user",)
    readonly_fields = ("slug",)