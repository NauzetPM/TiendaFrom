<template>
    <nav id="nav" class="navbar navbar-expand-lg navbar-dark bg-primary hover-primary">
        <div class="container">
            <router-link class="navbar-brand" to="/">
                Tienda
            </router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto ">
                    <li class="nav-item">
                        <router-link class="nav-link text-light" to="/products">
                            <i class="bi bi-shop"></i>
                             Productos
                        </router-link>
                    </li>
                    <li class="nav-item" v-if="authStore.token">
                        <router-link class="nav-link text-light" to="/orders">
                            <i class="bi bi-cart"></i>
                             Carrito 
                        </router-link>
                    </li>
                    <li class="nav-item" v-if="!authStore.token">
                        <router-link class="nav-link text-light" to="/login">
                            <i class="bi bi-box-arrow-in-right"></i>
                             Login
                        </router-link>
                    </li>
                    <li class="nav-item" v-if="authStore.token">
                        <button class="btn btn-link nav-link text-light" @click="authStore.logout">
                            <i class="bi bi-box-arrow-right"></i>
                             Logout
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { useAuthStore } from '@/store/authStore';
const authStore = useAuthStore();
</script>
