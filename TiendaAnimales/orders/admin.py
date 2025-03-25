from django.contrib import admin
from .models import Order, OrderProduct

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['pk','status','user',]

@admin.register(OrderProduct)
class OrderProductmAdmin(admin.ModelAdmin):
    list_display = ['order', 'product','quantity',]