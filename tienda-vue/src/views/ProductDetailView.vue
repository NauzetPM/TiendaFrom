<template>
    <div class="container mt-4">
        <div v-if="product" class="card shadow-lg">
            <div id="productCarousel" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-indicators">
                    <button v-for="(image, index) in productImages" :key="index" type="button" 
                        :data-bs-target="'#productCarousel'" :data-bs-slide-to="index" 
                        :class="{ active: index === 0 }" aria-label="Slide {{ index + 1 }}">
                    </button>
                </div>

                <div class="carousel-inner">
                    <div v-for="(image, index) in productImages" :key="index" 
                        class="carousel-item" :class="{ active: index === 0 }">
                        <img :src="image" class="d-block w-100 product-image"
                            alt="Product Image" @error="imageError">
                    </div>
                </div>

                <button class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                </button>
            </div>

            <div class="card-body">
                <h2 class="card-title">{{ product.name }}</h2>
                <p class="text-muted">Categoría: {{ product.category.name }}</p>
                <p class="card-text">{{ product.description }}</p>
                <h4 class="text-primary">Precio: ${{ product.price }}</h4>

                <!-- Input para seleccionar cantidad -->
                <div class="mb-3">
                    <label for="quantity" class="form-label">Cantidad:</label>
                    <input type="number" id="quantity" v-model="quantity" class="form-control" 
                        :min="1" :max="product.stock" />
                </div>

                <button class="btn btn-success w-100" @click="addToCart">Añadir al carrito</button>

                <div v-if="addedToCart" class="alert alert-success mt-3" role="alert">
                    <i class="bi bi-check-circle"></i> {{ quantity }} {{ product.name }} añadido(s) al carrito!
                </div>
            </div>
        </div>

        <div v-else class="text-center">
            <p>Cargando detalles del producto...</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '@/store/productStore';
import { useOrderStore } from '@/store/orderStore';
import { useAuthStore } from '@/store/authStore';

const authStore = useAuthStore();
const route = useRoute();
const productStore = useProductStore();
const orderStore = useOrderStore();
const product = ref(null);
const addedToCart = ref(false);
const quantity = ref(1); // Estado para la cantidad seleccionada

onMounted(async () => {
    await productStore.loadProducts();
    product.value = productStore.products.find(p => p.slug === route.params.slug);
});

const productImages = computed(() => {
    return product.value && product.value.images.length > 0
        ? product.value.images.map(img => img.image)
        : ["/default-image.jpg"];
});

const addToCart = () => {
    if (!authStore.token) {  
        alert("Debes iniciar sesión para agregar productos al carrito.");
        return;
    }
    if (!product.value || product.value.stock <= 0) {
        alert("Producto no disponible.");
        return;
    }
    if (quantity.value < 1 || quantity.value > product.value.stock) {
        alert("Cantidad no válida.");
        return;
    }

    orderStore.addToCart({ ...product.value, quantity: quantity.value });
    addedToCart.value = true;
    setTimeout(() => (addedToCart.value = false), 3000);
};

const imageError = (event) => {
    event.target.src = '/default-image.jpg';
};
</script>

<style scoped>
.product-image {
    width: 100%;
    max-height: 400px;
    object-fit: contain;
    display: block;
    background-color: #f8f9fa;
}

.card {
    border-radius: 15px;
    overflow: hidden;
}

.carousel-control-prev, .carousel-control-next {
    filter: invert(100%);
}
</style>
