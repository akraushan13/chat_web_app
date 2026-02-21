from django.urls import path
from rest_framework.authtoken import views
from home.api import views as user_api_views 

urlpatterns = [
    path('token/', views.obtain_auth_token),
    path('login/', user_api_views.LoginView.as_view()),
    path('profile/', user_api_views.UserDetailAPIView.as_view()),
    path('edit-profile/', user_api_views.UserUpdateAPIView.as_view()),
    path('edit-profile-image/', user_api_views.UserUpdateImageAPIView.as_view()),
    path('check-user/', user_api_views.CheckUserAPIView.as_view()),
]