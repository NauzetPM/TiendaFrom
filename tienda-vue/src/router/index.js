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
import ResetPassword from '@/views/ResetPassword.vue';
import ForgotPassword from '@/views/ForgotPassword.vue';
import TermsConditions from '@/views/TermsConditions.vue';

const routes = [
    { path: '/', component: HomeView },
    { path: '/login', component: LoginView },
    { path: '/register', component: RegisterView },
    { path: '/privacidad', component: PolitictPrivacity },
    { path: '/condiciones', component: TermsConditions },
    { path: '/forgot-password', component: ForgotPassword },
    { path: '/cookies', component: CookiesView },
    { path: '/orders', component: OrderView },
    { path: '/order/:id', component: OrderDetails },
    { path: '/products', component: ProductListView },
    { path: '/products/:slug', component: ProductDetailView },
    { path: '/reset-password/:uid/:token', component: ResetPassword },
];
const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router;

