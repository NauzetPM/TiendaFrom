from functools import wraps

from django.http import JsonResponse


def method_required(method):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            if request.method != method:
                return JsonResponse({'error': 'Method not allowed'}, status=405)
            return view_func(request, *args, **kwargs)

        return _wrapped_view

    return decorator
