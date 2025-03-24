<template>
  <div class="bg-color4">
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
  // Cursor predeterminado
  document.body.style.cursor = "url('/Paw.cur'), auto";

  // Cursor al pasar sobre enlaces
  document.querySelectorAll("a").forEach(el => {
    el.style.cursor = "url('/Paw-click.ani'), pointer";
  });
});

</script>
<style></style>