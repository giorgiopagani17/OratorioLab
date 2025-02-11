<template>
  <div class="flex items-center justify-center" style="height: 100vh">
    <div class="q-mt-lg border" style="width: 45vh">
      <div class="bg-secondary text-bold text-white q-py-sm q-pl-md container-header">
        Login
      </div>
      <div class="text-center q-pa-md container-body">
        <p class="text-secondary text-bold text-25 q-pa-sm">ORATORI<span class="text-primary">360</span></p>
        <q-input rounded outlined v-model="username" color="secondary" label="Username" />
        <q-input rounded outlined v-model="password" color="secondary" label="Password" type="password" class="q-mt-md"/>
        <q-btn color="primary" label="Login" class="q-mt-lg" style="width: 15vh" @click="navigateToHome"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onBeforeUnmount, ref} from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const router = useRouter();

const navigateToHome = () => {
  router.push('/home');
};

onMounted(() => {
  document.documentElement.classList.add('wallpaper');
});

onBeforeUnmount(() => {
  document.documentElement.classList.remove('wallpaper');
});
</script>

<style scoped lang="scss">

</style>
