<template>
  <div class="main-container">
    <header v-if="showHeader">
      <BHeader />
    </header>

    <main class="main-box">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BHeader from './components/BHeader.vue'

// Note: CountBookAPI is registered as a route component via vue-router,
// so it doesn't need to be imported here unless used directly in the template.

const route = useRoute()

// Computed property replacing the old computed option
const showHeader = computed(() => {
  return route.name !== 'CountBookAPI'
})
</script>
