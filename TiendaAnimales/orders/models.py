import uuid
from django.conf import settings
from django.db import models

class OrderProduct(models.Model):
    order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='order_products')
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE, related_name='product_orders')
    quantity = models.PositiveIntegerField(default=1)
    class Meta:
        unique_together = ('order', 'product')
    @property
    def total_price(self):
        return self.product.price * self.quantity
    def __str__(self):
        return f"{self.order} - {self.product} ({self.quantity})"

class Order(models.Model):
    class Status(models.IntegerChoices):
        INITIATED = 1
        CONFIRMED = 2
        PAID = 3
        CANCELLED = -1
    status = models.SmallIntegerField(choices=Status, default=Status.INITIATED)
    key = models.UUIDField(default=uuid.uuid4)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_orders'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    @property
    def price(self):
        return sum(op.product.price * op.quantity for op in self.order_products.all())
    def __str__(self):
        return f'{self.key}'
