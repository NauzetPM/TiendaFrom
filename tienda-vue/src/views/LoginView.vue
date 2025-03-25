<template>
    <div class="home-page login-container d-flex align-items-center justify-content-center">
        <div class="card p-4 shadow-lg">
            <div class="card-body">
                <h2 class="text-center mb-4">
                    Iniciar Sesión
                </h2>
                <form @submit.prevent="handleLogin" autocomplete="on">
                    <div class="mb-3">
                        <label for="username" class="form-label">
                            Usuario
                        </label>
                        <input v-model="username" id="username" type="text" class="form-control" placeholder="Usuario"
                            required autocomplete="username" aria-describedby="usernameHelp" />
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">
                            Contraseña
                        </label>
                        <input v-model="password" id="password" type="password" class="form-control"
                            placeholder="********" required autocomplete="current-password"
                            aria-describedby="passwordHelp" />
                    </div>
                    <button type="submit" class="btn btn-primary w-100">
                        Ingresar
                    </button>
                    <p v-if="message" id="message" :class="'mt-3 text-danger text-center'">
                        {{ message }}
                    </p>
                </form>
                <div class="text-center mt-3">
                    <router-link to="/register" class="text-decoration-none" aria-label="Crear una cuenta">
                        ¿No Tienes Cuenta? Crea Una
                    </router-link>
                    <br>
                    <router-link to="/forgot-password" class="text-decoration-none" aria-label="Recuperar contraseña">
                        ¿Olvidaste tu contraseña?
                    </router-link>
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
const password = ref('');
const message = ref('');
const handleLogin = async () => {
    try {
        await authStore.loginUser(username.value, password.value);
        router.push('/');
    } catch (error) {
        message.value ='Error en el inicio de sesión correo o contraseña incorrecto';
    }
};
</script>

<style scoped>
.home-page {
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
