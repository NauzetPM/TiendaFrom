from django.urls import path
from . import views

app_name = 'users'
urlpatterns = [
    path('login/', views.login, name='auth'),
    path('register/', views.register, name='register'),
    path('password-reset/', views.password_reset_request, name='password_reset_request'),
    path('password-reset-confirm/<uidb64>/<token>/', views.password_reset_confirm, name='password_reset_confirm'),
]
