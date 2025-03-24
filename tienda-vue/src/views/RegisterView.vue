<template>
    <div class="register-page d-flex align-items-center justify-content-center">
        <div class="card p-4 shadow-lg">
            <div class="card-body">
                <h2 class="text-center mb-4">Crear Cuenta</h2>
                <form @submit.prevent="handleRegister">
                    <div class="mb-3">
                        <label class="form-label">Nombre de Usuario</label>
                        <input v-model="username" type="text" class="form-control" placeholder="TuUsuario" required />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Correo Electrónico</label>
                        <input v-model="email" type="email" class="form-control" placeholder="tuemail@gmail.com" required />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Contraseña</label>
                        <input v-model="password" type="password" class="form-control" placeholder="********" required />
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Registrarse</button>
                    <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
                </form>
                <div class="text-center mt-3">
                    <router-link to="/login" class="text-decoration-none">¿Ya tienes una cuenta? Inicia sesión</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const username = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');

const handleRegister = async () => {
    try {
        await authStore.registerUser(username.value, email.value, password.value);
        router.push('/');
    } catch (error) {
        errorMessage.value = error.error || "Error en el registro";
    }
};
</script>

<style scoped>
.register-page {
    background: url('@/assets/background.jpg') no-repeat center center/cover;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
    padding: 20px;
}

.card {
    width: 100%;
    max-width: 400px;
    border-radius: 10px;
}

.form-control {
    border-radius: 8px;
}
</style>
