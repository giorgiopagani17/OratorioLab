<template>
  <q-dialog v-model="show" persistent>
    <div class="bg-white">
      <div class="row items-center">
        <q-avatar icon="warning" color="warning" text-color="white"/>
        <span class="q-ml-sm">Sei sicuro di voler uscire? Le modifiche non salvate andranno perse.</span>
      </div>

      <div>
        <q-btn flat label="Recuperalo" color="primary" @click="deny" />
        <q-btn flat label="Eliminalo" color="primary" @click="confirm" />
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useEventsActivitiesStore } from '../../stores/eventsActivities';
import { useRouter } from 'vue-router';

const show = ref(false);
const store = useEventsActivitiesStore();
const router = useRouter();

if (localStorage.getItem('eventsActivities') && router.currentRoute.value.path !== '/' ) {
  show.value = true;
}

const confirm = () => {
  show.value = false;
  store.clearEventActivities();
  window.dispatchEvent(new CustomEvent('confirmNavigation', {
    detail: { confirm: true }
  }));
};

const deny = () => {
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
