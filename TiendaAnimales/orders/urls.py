from django.urls import path

from . import views

app_name = 'orders'

urlpatterns = [
    path('', views.orders_list, name='order_list'),
    path('add/', views.order_add, name='order_add'),
    path('<int:pk>/', views.order_details, name='order_details'),
    path('<int:pk>/status/', views.order_status, name='order_status'),
    path('<int:pk>/pay/', views.order_pay, name='order_pay'),
    path('<int:pk>/products/', views.order_products, name='order_products'),
    path('<int:pk>/products/add/', views.order_products_add, name='order_products_add'),
]
