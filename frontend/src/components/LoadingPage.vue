<template>
  <div class="loading-container">
    <q-spinner size="50px" color="primary" />
    <p class="text-white text-bold text-25">Oratorio<span class="text-primary">LAB</span></p>
  </div>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted} from 'vue';

onMounted(() => {
  document.documentElement.classList.add('bg-secondary');
});

onBeforeUnmount(() => {
  document.documentElement.classList.remove('bg-secondary');
});
</script>

<style lang="scss" scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background-color: $secondary;
}
</style>
