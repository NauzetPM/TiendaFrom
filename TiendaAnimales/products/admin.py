from django.contrib import admin
from .models import Product, ProductImage
from django.utils.html import format_html

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)} 
    list_display = ['name', 'created_at','price','stock']

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    def image_tag(self, obj):
        return format_html('<img src="{}" />'.format(obj.image.url))
    image_tag.short_description = 'Image'
    readonly_fields = ['image_tag']
    list_display = ['product', 'created_at','image_tag',]
        
        