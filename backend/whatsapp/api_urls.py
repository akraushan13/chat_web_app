from django.urls import path, include

urlpatterns = [
    path('', include('home.api.urls')),
    path('contacts/', include('contact.api.urls')),
]
