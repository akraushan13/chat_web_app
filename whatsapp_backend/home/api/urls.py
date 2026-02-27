from django.urls import path
from .views import SignupView, LoginView, ProfileView, CheckUserView, EditProfileView

urlpatterns = [
    path("signup/", SignupView.as_view()),
    path("login/", LoginView.as_view()),
    path("profile/", ProfileView.as_view()),
    path("check-user/", CheckUserView.as_view()),
    path("edit-profile/", EditProfileView.as_view()),
]
