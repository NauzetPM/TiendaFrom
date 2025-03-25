from django.urls import path
from . import views

app_name = 'products'
urlpatterns = [
    path('', views.products_list, name='products_list'),
    path('<str:product_slug>/', views.product_details, name='product_details'),
]
