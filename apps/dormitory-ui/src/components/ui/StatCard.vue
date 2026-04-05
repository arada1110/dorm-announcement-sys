<script setup lang="ts">
defineProps({
  title: String,
  value: Number,
});
</script>

<template>
  <div class="card">
    <div class="text-gray-500 text-sm">
      {{ title }}
    </div>

    <div class="text-3xl font-bold mt-2 text-orange-600">
      {{ value }}
    </div>
  </div>
</template>

<style scoped>
.card {
  background: white;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #eee;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.03);
}
</style>
