from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model

User = get_user_model()


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("username", "email", "first_name", "last_name", "verified", "is_staff")
    list_filter = ("verified", "is_staff", "is_superuser", "is_active")
    search_fields = ("username", "email")
    ordering = ("username",)

    fieldsets = BaseUserAdmin.fieldsets + (
        ("Additional Info", {
            "fields": ("bio", "image", "verified"),
        }),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("Additional Info", {
            "fields": ("bio", "image", "verified"),
        }),
    )