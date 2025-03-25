from django.http import JsonResponse
import json
from django.contrib.auth.models import User
from .models import Token
from shared.utils import custom_400,custom_404
from shared.decorators import method_required, login_required
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from shared.tasks import send_reset_gmail

@csrf_exempt
@method_required("POST")
def password_reset_request(request):
    url = 'http://localhost:8080/reset-password/'
    try:
        data = json.loads(request.body)
        email = data.get("email")
        if not email:
            return custom_400("El email es obligatorio")
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return custom_404("Usuario no encontrado")
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_link = f"{url}{uid}/{token}"
        send_reset_gmail.delay(email,reset_link)
        return JsonResponse({"message": "Se ha enviado un enlace de restablecimiento a tu correo"})
    except json.JSONDecodeError:
        return custom_400("Formato JSON inválido")
    
@csrf_exempt
@method_required("POST")
def password_reset_confirm(request, uidb64, token):
    try:
        data = json.loads(request.body)
        new_password = data.get("password")
        if not new_password:
            return custom_400("La nueva contraseña es obligatoria")
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError):
            return custom_404("Usuario inválido")
        if not default_token_generator.check_token(user, token):
            return custom_400("Token inválido o expirado")
        user.set_password(new_password)
        user.save()
        return JsonResponse({"message": "Contraseña cambiada exitosamente"})
    except json.JSONDecodeError:
        return custom_400("Formato JSON inválido")

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
