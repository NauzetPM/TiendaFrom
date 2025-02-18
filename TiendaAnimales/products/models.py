from django.db import models


class ProductImage(models.Model):
    product = models.ForeignKey('Product', related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(
        blank=True, upload_to='products_images/', default='products_images/default.jpg'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.image.url if self.image else 'No image available'


class Product(models.Model):
    name = models.TextField(unique=True)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    images = models.ImageField(blank=True, upload_to='covers', default='covers/default.jpg')
    price = models.DecimalField(max_digits=5, decimal_places=2)
    stock = models.PositiveIntegerField()
    category = models.ForeignKey(
        'categories.Category', on_delete=models.SET_NULL, null=True, related_name='games'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.name}'
