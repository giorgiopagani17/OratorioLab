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
    >
      <q-list class="q-mt-md">
        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
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

defineOptions({
  name: 'MainLayout'
});

const search = ref<string>('');

const linksList: EssentialLinkProps[] = [
  {
    title: 'Home',
    icon: 'school',
    link: '/'
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


<style>
.custom-input .q-field__control:before {
  border: none !important;
}
</style>
