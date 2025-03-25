from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from shared.decorators import method_required, token_required
from shared.utils import custom_403, custom_404 ,custom_400
from shared.tasks import send_gmail
from .decorators import (
    validate_order_pay_exist,
    validate_order_status_exist,
    validate_orders_products_add_data,
    validate_pay_data,
    validate_status_data,
)
from .models import Order ,OrderProduct
from .serializers import OrdersSerializer

@csrf_exempt
@method_required('GET')
@token_required
def orders_list(request):
    user = request.user
    orders = Order.objects.filter(user=user) 
    
    if not orders.exists():
        return JsonResponse({'message': 'No orders found'}, status=404)

    orders_serialized = OrdersSerializer(orders,request=request).serialize()
    
    return JsonResponse(orders_serialized, safe=False)

@csrf_exempt
@method_required('POST')
@token_required
def order_add(request):
    user = request.user
    order = Order.objects.create(user=user)
    return JsonResponse({'id': order.pk}, status=200)

@csrf_exempt
@method_required('GET')
@token_required
def order_details(request, pk):
    user = request.user
    try:
        order = Order.objects.get(id=pk)
    except Order.DoesNotExist:
        return custom_404('Order not found')
    if order.user != user:
        return custom_403('User is not the owner of requested order')
    order_ = OrdersSerializer(order, request=request)
    return JsonResponse(order_.serialize(), safe=False)

@csrf_exempt
@method_required('GET')
@token_required
def order_products(request, pk):
    user = request.user
    try:
        order = Order.objects.prefetch_related('order_products__product').get(id=pk)
    except Order.DoesNotExist:
        return custom_404('Order not found')
    if order.user != user:
        return custom_403('User is not the owner of requested order')

    products_data = [
        {
            "id": op.product.id,
            "name": op.product.name,
            "price": float(op.product.price),
            "quantity": op.quantity
        }
        for op in order.order_products.all()
    ]

    return JsonResponse(products_data, safe=False)


@csrf_exempt
@method_required('POST')
@validate_orders_products_add_data
@token_required
def order_products_add(request, pk):
    user = request.user
    order = request.order
    product = request.product
    quantity = request.POST.get('quantity', 1) 
    quantity = int(quantity)

    if order.user != user:
        return custom_403('User is not the owner of requested order')

    order_product, created = OrderProduct.objects.get_or_create(order=order, product=product)
    if not created:
        order_product.quantity += quantity
    else:
        order_product.quantity = quantity
    order_product.save()

    if product.stock < quantity:
        return custom_400('Not enough stock available')
    product.stock -= quantity
    product.save()

    return JsonResponse({'num-products-in-order': order.order_products.count()}, safe=False)


@csrf_exempt
@method_required('POST')
@validate_status_data
@token_required
@validate_order_status_exist
def order_status(request, pk):
    order = request.order
    status = request.status
    user = request.user
    if order.user != user:
        return custom_403('User is not the owner of requested order')
    order.status = status
    order.save()
    return JsonResponse({'status': order.get_status_display()}, safe=False)


@csrf_exempt
@method_required('POST')
@validate_pay_data
@token_required
@validate_order_pay_exist
def order_pay(request, pk):
    order = request.order

    if order.status == Order.Status.PAID:
        return JsonResponse({'error': 'La orden ya ha sido pagada'}, status=400)


    order.status = Order.Status.PAID
    order.save()


    recipient = order.user.email
    subject = "Tu Factura"
    template_name = "emails/invoice.html"
    context = {
        "cliente": order.user.username,
        "total": order.price,
        "fecha": order.created_at.strftime("%d de %B, %Y"),
        "items": [
            {
                "nombre": op.product.name,
                "cantidad": op.quantity,
                "precio_unitario": op.product.price,
                "precio_total": op.total_price, 
            }
            for op in order.order_products.all()
        ]
    }
    
    send_gmail.delay(subject, recipient, template_name, context, "factura.pdf")

    return JsonResponse({'status': order.get_status_display(), 'key': order.key}, safe=False)


