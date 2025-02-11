<template>
  <q-page class="row items-center justify-evenly q-pa-md page-background">
    <div style="width: 90%">
      <div class="container flex justify-center q-mb-lg" style="padding: 12px">
        <div class="flex items-center justify-center q-pr-sm border-right-grey-custom">
          <q-input
            v-model="search"
            dense
            input-style="color: white;"
            placeholder="Search..."
            color="white"
            class="custom-input blue-container-input"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="white"/>
            </template>
          </q-input>
        </div>
        <div class="flex items-center justify-center q-pl-sm">
          <q-btn v-for="button in buttons" :key="button.title" color="primary" class="button" style="width: 150px;">
            {{ button.title }}
          </q-btn>
        </div>
      </div>

      <div class="q-mt-lg container-border">
        <div class="bg-secondary text-bold text-white q-py-sm q-pl-md container-header">
          Eventi
        </div>
        <div class="flex items-center justify-center q-pa-md container-body">
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {ref} from 'vue';

defineOptions({
  name: 'UserPage'
});

interface Button {
  title: string;
  action: string;
}

const search = ref<string>('');

const buttons: Button[] = [
  {
    title: 'Filtro 1',
    action: 'https://quasar.dev'
  },
  {
    title: 'Filtro 2',
    action: 'https://quasar.dev'
  },
  {
    title: 'Filtro 3',
    action: 'https://quasar.dev'
  },
  {
    title: 'Filtro 4',
    action: 'https://quasar.dev'
  }
];
</script>004AAD

<style lang="scss">
.input-blue {
  border: none !important;
  border-radius: 100px;
}
</style>
