from django.urls import path
from contact.api import views


urlpatterns = [
    path('', views.ContactListCreateView.as_view()),
    path('<str:slug>/', views.ContactDetailApiView.as_view()),
]