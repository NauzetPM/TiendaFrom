<template>
    <div class="container p-4 full-screen">
        <h2 class="text-center mb-4">Productos</h2>

        <div class="row">
            <!-- FILTROS -->
            <div class="col-md-3 mb-4">
                <div class="card shadow-sm p-3">
                    <div class="dropdown mb-3">
                        <button class="btn btn-secondary w-100 d-flex align-items-center justify-content-between"
                            type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-filter"></i> Seleccionar Categoría
                        </button>
                        <ul class="dropdown-menu w-100 p-2">
                            <li class="dropdown-item">
                                <input type="checkbox" v-model="selectAll" @change="toggleAll" />
                                <label class="ms-2">Todas</label>
                            </li>
                            <li v-for="category in categories" :key="category.id" class="dropdown-item">
                                <input type="checkbox" v-model="selectedCategories" :value="category.id" />
                                <label class="ms-2">{{ category.name }}</label>
                            </li>
                        </ul>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Rango de precio</label>
                        <input type="range" v-model="priceRange.min" min="0" :max="priceRange.max" class="form-range">
                        <input type="range" v-model="priceRange.max" :min="priceRange.min" :max="maxPrice"
                            class="form-range">
                        <p class="text-center">
                            ${{ priceRange.min }} - ${{ priceRange.max }}
                        </p>
                    </div>

                    <div>
                        <label class="form-label">Ordenar por Precio</label>
                        <select v-model="sortOrder" class="form-select">
                            <option value="asc">Menor a Mayor</option>
                            <option value="desc">Mayor a Menor</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- PRODUCTOS -->
            <div class="col-md-9">
                <div class="mb-4">
                    <input v-model="filter" class="form-control" placeholder="Buscar productos" />
                </div>

                <div class="row">
                    <div v-for="product in paginatedProducts" :key="product.id" class="col-md-4 mb-4">
                        <router-link :to="'/products/' + product.slug" class="text-decoration-none">
                            <div class="card h-100 shadow-sm">
                                <img :src="product.images.length ? product.images[0].image : '/default-image.jpg'"
                                    class="card-img-top" alt="Product Image">
                                <div class="card-body text-center">
                                    <h5 class="card-title">{{ product.name }}</h5>
                                    <p class="card-text"><strong>Precio:</strong> ${{ product.price }}</p>
                                </div>
                            </div>
                        </router-link>
                    </div>
                </div>

                <p v-if="filteredProducts.length === 0" class="text-center">No se encontraron productos.</p>

                <!-- PAGINACIÓN -->
                <nav aria-label="Paginación" class="mt-4">
                    <ul class="pagination justify-content-center">
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <button class="page-link" @click="prevPage">
                                <i class="bi bi-chevron-left"></i>
                            </button>
                        </li>

                        <li v-for="page in visiblePages" :key="page" class="page-item"
                            :class="{ active: currentPage === page }">
                            <button class="page-link" @click="goToPage(page)">{{ page }}</button>
                        </li>

                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                            <button class="page-link" @click="nextPage">
                                <i class="bi bi-chevron-right"></i>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useProductStore } from '@/store/productStore';
import { fetchCategories } from '@/api/categories';

const productStore = useProductStore();
const filter = ref('');
const selectedCategories = ref([]);
const categories = ref([]);
const selectAll = ref(false);
const priceRange = ref({ min: 0, max: 1000 });
const maxPrice = ref(1000);
const sortOrder = ref("asc");

const currentPage = ref(1);
const itemsPerPage = 18;

onMounted(async () => {
    await productStore.loadProducts();
    categories.value = await fetchCategories();

    if (productStore.products.length > 0) {
        maxPrice.value = Math.max(...productStore.products.map(p => p.price));
        priceRange.value.max = maxPrice.value;
    }
});

const filteredProducts = computed(() => {
    let products = productStore.products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(filter.value.toLowerCase());
        const matchesCategory = selectedCategories.value.length === 0 || selectedCategories.value.includes(product.category.id);
        const matchesPrice = product.price >= priceRange.value.min && product.price <= priceRange.value.max;

        return matchesSearch && matchesCategory && matchesPrice;
    });

    if (sortOrder.value === "asc") {
        products = products.sort((a, b) => a.price - b.price);
    } else {
        products = products.sort((a, b) => b.price - a.price);
    }

    return products;
});

watch([filter, selectedCategories, priceRange, sortOrder], () => {
    currentPage.value = 1;
});

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage));

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredProducts.value.slice(start, end);
});

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        window.scrollTo(0, 0);
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        window.scrollTo(0, 0);
    }
};

const goToPage = (page) => {
    currentPage.value = page;
    window.scrollTo(0, 0);
};

const visiblePages = computed(() => {
    let pages = [];
    let startPage = Math.max(1, currentPage.value - 3);
    let endPage = Math.min(totalPages.value, currentPage.value + 3);

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }
    return pages;
});
</script>


<style scoped>
.card {
    transition: transform 0.2s ease-in-out;
}

.card:hover {
    transform: scale(1.05);
}

.page-link {
    cursor: pointer;
}
</style>
