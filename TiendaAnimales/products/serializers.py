from shared.serializers import BaseSerializer
from categories.serializers import CategoriesSerializer

class ProductSerializer(BaseSerializer):
    def __init__(self, to_serialize, *, fields=[], request=None):
        super().__init__(to_serialize, fields=fields, request=request)
    def serialize_instance(self, instance) -> dict:
        return {
            'id': instance.pk,
            'name': instance.name,
            'slug': instance.slug,
            'description': instance.description,
            'price': float(instance.price),
            'stock': instance.stock,
            'created_at': instance.created_at.isoformat(),
            'updated_at': instance.updated_at.isoformat(),
            'category': CategoriesSerializer(instance.category).serialize(),
            'images': ProductImageSerializer(
                instance.images.all(), request=self.request
            ).serialize(),
        }

class ProductImageSerializer(BaseSerializer):
    def __init__(self, to_serialize, *, fields=[], request=None):
        super().__init__(to_serialize, fields=fields, request=request)
    def serialize_instance(self, instance) -> dict:
        return {
            'id': instance.pk,
            'image': self.build_url(instance.image.url),
            'created_at': instance.created_at.isoformat(),
        }

