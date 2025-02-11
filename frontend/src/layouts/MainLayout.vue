<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-secondary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title header class="text-bold text-white" style="font-size: 1.7em">
          Oratori<span class="text-primary">360</span>
        </q-toolbar-title>

        <q-input
          v-model="search"
          dense
          input-style="color: white;"
          placeholder="Search..."
          color="white"
          class="custom-input"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="white"/>
          </template>
        </q-input>
      </q-toolbar>
    </q-header>


    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      elevated
      class="custom-shadow"
      :width="250"
    >
      <div class="drawer-container">
        <q-list class="q-mt-md">
          <EssentialLink
            v-for="link in linksList"
            :key="link.title"
            v-bind="link"
          />
        </q-list>

        <div class="q-mb-md q-mt-auto border-top-primary flex justify-center">
          <q-btn
            color="primary"
            label="Logout"
            class="q-mt-md"
            style="width: 200px;"
            @click="logout"
          />
        </div>
      </div>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import {EssentialLinkProps} from '@/components/EssentialLink.vue';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'MainLayout'
});

const search = ref<string>('');
const router = useRouter();

const logout = () => {
  router.push('/');
};

const linksList: EssentialLinkProps[] = [
  {
    title: 'Home',
    icon: 'school',
    link: '/home'
  },
  {
    title: 'Anagrafiche',
    icon: 'record_voice_over',
    link: '/users'
  },
  {
    title: 'Eventi',
    icon: 'code',
    link: '/events'
  },
  {
    title: 'Attività',
    icon: 'chat',
    link: '/activities'
  }
];

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const leftDrawerOpen = ref(false);
</script>


<style lang="scss">
.drawer-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

.border-top-primary {
  border-top: 2px solid $primary;
}
</style>
