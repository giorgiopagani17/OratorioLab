<template>
  <q-dialog v-model="show" persistent>
    <q-card class="bg-white q-pa-md">
      <q-card-section class="text-center">
        <q-avatar icon="warning" size="70px" color="warning" text-color="white"/>
        <div class="q-mt-md" style="font-size: 22px">{{ $t('warnings.warningProgressTitle') }}</div>
        <div class="text-grey-7 q-mt-xs" style="font-size: 16px">{{ $t('warnings.warningProgressDescription1') }} <br/> {{ $t('warnings.warningProgressDescription2') }}</div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn label="Elimina" class="q-mr-md" color="negative" @click="deleteData" />
        <q-btn label="Recupera" color="positive" @click="recoverData" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted, watch} from 'vue';
import { useEventsActivitiesStore } from '@/stores/eventsActivities';
import { useRouter, useRoute } from 'vue-router';

const show = ref(false);
const store = useEventsActivitiesStore();
const router = useRouter();
const route = useRoute();

const checkRoute = () => {
  if (localStorage.getItem('eventsActivities') && router.currentRoute.value.path !== '/' && router.currentRoute.value.path !== '/events/create' && router.currentRoute.value.path !== '/activities/create' && router.currentRoute.value.path !== '/events/create/' && router.currentRoute.value.path !== '/activities/create/') {
    show.value = true;
  } else {
    show.value = false;
  }
};

watch(route, checkRoute);


const deleteData = () => {
  show.value = false;
  store.clearEventActivities();
  window.dispatchEvent(new CustomEvent('confirmNavigation', {
    detail: { confirm: true }
  }));
};

const recoverData = () => {
  show.value = false;
  const eventsActivities = JSON.parse(localStorage.getItem('eventsActivities') || '[]');
  const firstType = eventsActivities[0]?.type;
  const path = firstType === 'activity' ? '/activities/create' : '/events/create';
  router.push(path);
};

const open = () => {
  show.value = true;
};

onMounted(() => {
  window.addEventListener('showConfirmModal', () => {
    show.value = true;
  });
});

// Clean up the event listener when the component is unmounted
onUnmounted(() => {
  window.removeEventListener('showConfirmModal', () => {
    show.value = true;
  });
});


defineExpose({ open });
</script>
