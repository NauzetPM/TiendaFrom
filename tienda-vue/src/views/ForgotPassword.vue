<template>
    <div class="container full-screen d-flex align-items-center justify-content-center">
        <div class="card p-4 shadow-lg">
            <h2 class="text-center">Recuperar Contraseña</h2>
            <p class="text-center">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
            <form @submit.prevent="requestPasswordReset">
                <input v-model="email" type="email" class="form-control" placeholder="Correo electrónico" required>
                <button class="btn btn-primary text-light mt-3 w-100">Enviar enlace</button>
            </form>
            <p v-if="message" :class="'mt-3 text-' + status + ' text-center'">{{ message }}</p>
        </div>
    </div>
</template>

<style scoped>
.card {
    width: 100%;
    max-width: 400px;
}
</style>


<script setup>
import { ref } from 'vue';
import axios from 'axios';

const email = ref('');
const message = ref('');
const status = ref('')

const requestPasswordReset = async () => {
    try {
        await axios.post('http://127.0.0.1:8000/api/auth/password-reset/', { email: email.value });
        message.value = 'Se ha enviado un enlace a tu correo';
        status.value = 'success';
    } catch (error) {
        console.error('Error enviando correo de recuperación:', error.response?.data || error.message);
        message.value = error.response?.data.error || error.message;
        status.value = 'danger';
    }
};
</script>

