import dj_database_url, os
from whatsapp.settings.base import *
from whatsapp.settings.packages.aws import *
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv("DEBUG", 'False') == 'True'

INSTALLED_APPS.append("storages")

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases
DATABASES["default"] = dj_database_url.parse(
    os.getenv("DATABASE_URL"), conn_max_age=600
)

MIDDLEWARE.insert(2, "whitenoise.middleware.WhiteNoiseMiddleware")

MEDIA_URL = "/uploads/"

MEDIA_ROOT = os.getenv("MEDIA_ROOT", BASE_DIR / "vtu/media")

STATIC_ROOT = BASE_DIR / "assets"

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'assets'

STATICFILES_DIRS = [
    # BASE_DIR / 'whatsapp/assets',
]