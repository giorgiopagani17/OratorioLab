<template>
  <div class="flex items-center justify-center" style="height: 100vh">
    <div v-if="!isLoading" class="q-mt-lg border" style="width: 45vh">
      <div class="bg-secondary text-bold text-white q-py-sm q-pl-md container-header">
        Login
      </div>
      <div class="text-center q-pa-md container-body">
        <p class="text-secondary text-bold text-25 q-pa-sm">ORATORI<span class="text-primary">360</span></p>
        <q-input rounded outlined v-model="username" color="secondary" label="Username" />
        <q-input rounded outlined v-model="password" color="secondary" label="Password" type="password" class="q-mt-md"/>
        <q-btn color="primary" label="Login" class="q-mt-lg" style="width: 15vh" @click="handleLogin"/>
      </div>
    </div>
    <LoadingPage v-else />
  </div>
</template>

<script setup lang="ts">
import {onMounted, onBeforeUnmount, ref} from 'vue';
import { useRouter } from 'vue-router';
import LoadingPage from 'components/LoadingPage.vue';

const username = ref('');
const password = ref('');
const isLoading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  isLoading.value = true;
  await new Promise(resolve => setTimeout(resolve, 2000));
  isLoading.value = false;
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
