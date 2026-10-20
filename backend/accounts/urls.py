from django.urls import path
from .views import register_view, login_view, current_user_view

urlpatterns = [
    path('register/', register_view, name='auth_register'),
    path('login/', login_view, name='auth_login'),
    path('me/', current_user_view, name='auth_me'),
]
