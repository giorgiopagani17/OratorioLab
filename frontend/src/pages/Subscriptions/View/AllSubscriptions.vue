<template>
  <q-page class="row items-center justify-evenly q-pa-md">
    <div :class="{'w-95': $q.screen.gt.sm, 'q-py-sm w-100': $q.screen.lt.md}">
      <HeaderSection
        leftColXs="col-12"
        leftColMd="col-md-4"
        rightColXs="col-12"
        rightColMd="col-md-8">

        <template v-slot:left>
          <div class="col-12 margin-bottom-responsive">
            <q-input
              v-model="search"
              dense
              input-style="color: white;"
              :placeholder="$t('placeholders.search')"
              color="white"
              class="custom-input blue-container-input full-width q-pt-auto"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="white"/>
              </template>
            </q-input>
          </div>
        </template>

        <template v-slot:right>
          <div class="col-3 q-px-sm" v-for="button in buttons" :key="button.title">
            <ResponsiveButton
              :text="$t(`buttons.${button.title}`)"
              :icon="button.icon"
              :active="button.active"
            />
          </div>
        </template>
      </HeaderSection>

    </div>
  </q-page>
</template>

<script setup lang="ts">
import ResponsiveButton from '@/components/Buttons/ResponsiveButton.vue';
import HeaderSection from '@/components/Sections/HeaderSection.vue';
import {ref} from 'vue';
import { Button } from '@/Interfaces/Button';

const search = ref<string>('');
const buttons = ref<Button[]>([
  { title: 'major', icon:'person', action: 'over18', active: false },
  { title: 'minor', icon:'child_care', action: 'under18', active: false },
  { title: 'male', icon:'male', action: 'male', active: false },
  { title: 'female', icon:'female', action: 'female', active: false }
]);
</script>
