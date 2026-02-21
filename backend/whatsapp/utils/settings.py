import os
def get_app_settings():
    """
    set default settings module or get from environment variable
    """
    setting = os.getenv(
        "DJANGO_SETTINGS_MODULE", "whatsapp.settings.dev"
    )
    return setting
