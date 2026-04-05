<script setup lang="ts">
const props = defineProps({
  type: String,
});
</script>

<template>
  <span
    class="badge"
    :class="{
      urgent: type === 'URGENT',
    }"
  >
    <slot />
  </span>
</template>

<style scoped>
.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  background: #ffedd5;
  color: #ea580c;
}

.urgent {
  background: #fee2e2;
  color: #dc2626;
}
</style>
