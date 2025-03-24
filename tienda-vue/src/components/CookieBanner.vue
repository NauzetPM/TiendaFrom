<template>
    <div v-if="showBanner" class="cookie-banner fixed-bottom d-flex justify-content-between align-items-center p-3 bg-light shadow">
      <p class="mb-0">
        Este sitio web utiliza cookies para mejorar tu experiencia. 
        <router-link  class="primary" :to="{ path: '/cookies' }">
            Leer más
        </router-link>
      </p>
      <button @click="acceptCookies" class="btn bg-primary btn-sm">Aceptar</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        showBanner: true,
      };
    },
    methods: {
      acceptCookies() {
        this.showBanner = false;
        localStorage.setItem('cookiesAccepted', 'true');
      }
    },
    mounted() {
      if (localStorage.getItem('cookiesAccepted') === 'true') {
        this.showBanner = false;
      }
    }
  };
  </script>
  
  <style scoped>
  .cookie-banner {
    z-index: 9999;
  }
  </style>
  