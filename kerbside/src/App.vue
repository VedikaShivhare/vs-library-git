<script setup>
import NavBar from './components/NavBar.vue'
</script>

<template>
  <a href="#main-content" class="kerb-skip-link">Skip to main content</a>
  <NavBar />
  <main id="main-content">
    <router-view />
  </main>
</template>
