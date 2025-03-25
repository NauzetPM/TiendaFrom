<template>
  <div class="container mt-4 p-2 full-screen">
    <h2>
      Detalles Pedido
    </h2>
    <div v-if="order">
      <p>
        <strong>
          Identificador:
        </strong>
         {{ order.id }}
        </p>
      <p>
        <strong>
          Estado:
        </strong>
         {{ order.status }}
        </p>
      <p>
        <strong>
          Total:
        </strong>
         {{ order.price }}
        </p>
      <h4>
        Productos:
      </h4>
      <ul class="list-group">
        <li class="list-group-item" v-for="item in order.products" :key="item.id">
          {{ item.name }} - {{ item.price }}€  x  {{item.quantity}}
        </li>
      </ul>
      <div class="text-center">
        <button class="btn btn-primary mt-3 text-light" @click="payOrder" v-if="order.status !== 'Paid'">
          Pagar
        </button>
      </div>
    </div>
    <p v-else>
      Cargando Detalles...
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from '@/store/orderStore';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();
const order = ref(null);
const authStore = useAuthStore();
const fetchOrderDetails = async () => {
  const orderId = route.params.id;
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/orders/${orderId}/`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        'Content-Type': 'application/json',
      },
    });
    order.value = response.data;
  } catch (error) {
    console.error('Error obteniendo detalles:', error);
  }
};
onMounted(fetchOrderDetails);
const payOrder = async () => {
  try {
    await orderStore.payOrder(order.value.id);
    alert('Pago Correcto!');
    router.push('/');
  } catch (error) {
    console.error('Error pagando:', error);
  }
};
</script>
