<template>
    <div class="full-screen">
    <div class="container mt-4">
        <h2>Tus Pedidos</h2>
        <ul class="list-group" v-if="orders.length">
            <li class="list-group-item d-flex justify-content-between align-items-center" v-for="order in orders"
                :key="order.id">
                <router-link :to="`/order/${order.id}`" class="text-decoration-none">
                    <strong>Pedido #{{ order.id }}</strong> - <span class="text-success">{{ order.status }}</span>
                </router-link>
                <button class="btn btn-primary btn-sm" v-if="order.status !== 'Paid'"
                    @click="handlePayment(order.id)">Pagar</button>
            </li>
        </ul>
        <p v-else>Sin Compras Anteriores</p>
    </div>

    <div class="container mt-4">
        <h2>Tu Carrito</h2>
        <ul class="list-group" v-if="cart.length">
            <li class="list-group-item" v-for="item in cart" :key="item.id">
                {{ item.name }} - ${{ item.price }}
            </li>
        </ul>
        <p v-else>Sin productos en el carrito</p>

        <button class="btn btn-success mt-3 w-100" v-if="cart.length" @click="confirmOrder">
            Confirmar Pedido
        </button>
    </div>
</div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useOrderStore } from '@/store/orderStore';

const orderStore = useOrderStore();
const orders = computed(() => orderStore.orders);
const cart = computed(() => orderStore.cart);

onMounted(() => {
    orderStore.loadOrders();
});

const confirmOrder = async () => {
    if (!cart.value.length) {
        alert("Your cart is empty! Add items before confirming.");
        return;
    }

    try {
        await orderStore.checkout();
        alert("Your order has been placed successfully!");
    } catch (error) {
        console.error('Error confirming order:', error);
    }
};

const handlePayment = async (orderId) => {
    const cardInfo = {
        cardNumber: prompt("Enter card number (4111-1111-1111-1111)"),
        expDate: prompt("Enter expiration date (MM/YYYY)"),
        cvc: prompt("Enter CVC")
    };

    if (!cardInfo.cardNumber || !cardInfo.expDate || !cardInfo.cvc) {
        alert("Payment cancelled.");
        return;
    }

    try {
        await orderStore.payOrder(orderId, cardInfo);
    } catch (error) {
        console.error('Error paying order:', error);
    }
};
</script>
