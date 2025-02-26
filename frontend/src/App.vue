<template>
  <router-view />
  <ConfirmNavigationModal />
</template>

<script setup lang="ts">
import ConfirmNavigationModal from './components/Modals/ConfirmNavigationModal.vue';

defineOptions({
  name: 'App'
});
</script>
