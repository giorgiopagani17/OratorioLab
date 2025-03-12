<template>
  <router-view />
  <ConfirmNavigationModal />
</template>

<script setup lang="ts">
import ConfirmNavigationModal from './components/Modals/components/ConfirmNavigationModal.vue';

defineOptions({
  name: 'App'
});
</script>
