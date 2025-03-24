import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import ProductListView from '@/views/ProductListView.vue';
import ProductDetailView from '@/views/ProductDetailView.vue';
import OrderView from '@/views/OrderView.vue';
import OrderDetails from '@/views/OrderDetails.vue';
import CookiesView from '@/views/CookiesView.vue';
import PolitictPrivacity from '@/views/PolitictPrivacity.vue';
import RegisterView from '@/views/RegisterView.vue';
const routes = [
    { path: '/', component: HomeView },
    { path: '/login', component: LoginView },
    { path: '/register', component: RegisterView },
    { path: '/privacidad', component: PolitictPrivacity },
    { path: '/cookies', component: CookiesView },
    { path: '/orders', component: OrderView },
    { path: '/order/:id', component: OrderDetails },
    { path: '/products', component: ProductListView },
    { path: '/products/:slug', component: ProductDetailView }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;