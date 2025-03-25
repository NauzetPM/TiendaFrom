from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from categories.models import Category
from shared.decorators import method_required
from shared.utils import custom_404
from .models import Product
from .serializers import ProductSerializer

@csrf_exempt
@method_required('GET')
def products_list(request):
    category = request.GET.get('category', None)
    products = Product.objects.all()
    if category:
        category_instance = Category.objects.get(slug=category)
        products = products.filter(category=category_instance)
    serializes_games = ProductSerializer(products, request=request)
    return JsonResponse(serializes_games.serialize(), safe=False)

@csrf_exempt
@method_required('GET')
def product_details(request, product_slug):
    try:
        product = ProductSerializer(Product.objects.get(slug=product_slug), request=request)
    except Product.DoesNotExist:
        return custom_404('Product not found')
    return JsonResponse(product.serialize(), safe=False)