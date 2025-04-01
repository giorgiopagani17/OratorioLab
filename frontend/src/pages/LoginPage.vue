<template>
  <div class="flex items-center justify-center wallpaper" style="height: 100vh">
    <div v-if="!isLoading" class="q-mt-lg border" style="width: 45vh">
      <div class="bg-secondary text-bold text-white q-py-sm q-pl-md container-header">
        Login
      </div>
      <div class="text-center q-pa-md container-body">
        <img src="../assets/logos/PNG/OratorioLAB_Logo-01.png" alt="Logo" class="q-mb-sm" style="width: 100%; height: 100px; object-fit: cover;"/>
        <q-input rounded outlined v-model="username" color="secondary" label="Username" />
        <q-input rounded outlined v-model="password" color="secondary" label="Password" type="password" class="q-mt-md"/>
        <q-btn color="primary" label="Login" class="q-mt-lg" style="width: 15vh" @click="handleLogin"/>
      </div>
    </div>
    <LoadingPage v-else />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
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
</script>
