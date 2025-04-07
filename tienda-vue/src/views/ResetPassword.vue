<template>
    <div class="d-flex justify-content-center align-items-center full-screen">
        <div class="card p-4 shadow-lg" style="max-width: 400px; width: 100%;">
            <h2 class="text-center mb-4">
                Restablecer Contraseña
            </h2>
            <p class="text-center mb-4">
                Ingresa tu nueva contraseña.
            </p>
            <form @submit.prevent="resetPassword" autocomplete="on">
                <div class="mb-3">
                    <label for="input1" class="form-label">
                        Nueva Contraseña
                    </label>
                    <input id="input1" name="password" v-model="password" type="password" class="form-control" placeholder="Nueva contraseña" required autocomplete="new-password" />
                </div>
                <div class="mb-3">
                    <label for="input2" class="form-label">
                        Confirmar Contraseña
                    </label>
                    <input id="input2" name="confirmPassword" v-model="confirmPassword" type="password" class="form-control" placeholder="Confirmar contraseña" required autocomplete="new-password" />
                </div>
                <button type="submit" class="btn btn-primary text-light w-100 mt-3">
                    Restablecer
                </button>
            </form>
            <p v-if="message" class="mt-3 text-danger">
                {{ message }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { urlPeticiones } from '@/global.js';
const route = useRoute();
const router = useRouter();
const password = ref('');
const confirmPassword = ref('');
const message = ref('');

const resetPassword = async () => {
    if (password.value !== confirmPassword.value) {
        message.value = 'Las contraseñas no coinciden';
        return;
    }
    try {
        await axios.post(urlPeticiones+`/api/auth/password-reset-confirm/${route.params.uid}/${route.params.token}/`, {
            password: password.value
        });  
        alert('Contraseña restablecida con éxito');
        setTimeout(() => router.push('/login'), 1000);
    } catch (error) {
        message.value = error.response?.data.error || error.message;
        console.error('Error restableciendo contraseña:', error.response?.data || error.message);
    }
};
</script>

