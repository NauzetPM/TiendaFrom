from django.http import JsonResponse
import json
from django.contrib.auth.models import User
from .models import Token

from shared.decorators import method_required, login_required
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@method_required('POST')
@login_required
def login(request):
    return JsonResponse({'token': request.user.token.key}, safe=False)

@csrf_exempt
@method_required('POST')
def register(request):
    try:
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return JsonResponse({'error': 'Todos los campos son obligatorios'}, status=400)
        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'El usuario ya existe'}, status=400)
        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'El email ya está en uso'}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        user.is_staff = False
        user.is_superuser = False
        user.save()

        token = Token.objects.create(user=user)

        return JsonResponse({'message': 'Usuario registrado correctamente', 'token': str(token.key)}, status=201)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'JSON inválido'}, status=400)
