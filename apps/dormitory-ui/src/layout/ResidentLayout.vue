<script setup lang="ts">
import ResidentNavbar from "../components/navbar/ResidentNavbar.vue";
</script>

<template>
  <div class="min-h-screen bg-orange-50">
    <ResidentNavbar />

    <main class="pt-20 px-6 max-w-4xl mx-auto">
      <router-view />
    </main>
  </div>
</template>
