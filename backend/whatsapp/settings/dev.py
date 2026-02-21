from whatsapp.settings.base import *


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-j!na^n)ah#vinsg+-3yzblna4xdc)5e608_!&8e)9*tgf!jk92'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

DATABASES['default'] = {
    'ENGINE': 'django.db.backends.sqlite3',
    'NAME': BASE_DIR / 'whatsapp.db',
}


STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'assets'

STATICFILES_DIRS = [
    # BASE_DIR / 'whatsapp/assets',
]


MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'