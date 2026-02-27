from django.urls import path
from .views import ChatMessageListView

urlpatterns = [
    path("messages/<slug:slug>/", ChatMessageListView.as_view()),
]
