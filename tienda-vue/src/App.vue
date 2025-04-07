<template>
  <div>
    <CookieBanner />
    <NavbarComponent />
    <router-view />
    <FooterComponent />
  </div>
</template>

<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import CookieBanner from '@/components/CookieBanner.vue';
document.addEventListener("DOMContentLoaded", () => {
  document.body.style.cursor = "url('/Paw.cur'), auto";
});
</script>
<style>

</style>