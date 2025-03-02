<template>
  <q-page class="row items-center justify-evenly q-pa-md page-background">
      <div class="container-border" style="width: 95%">
        <div class="bg-secondary text-bold text-white q-py-sm q-pl-md container-header">
          <div class="flex justify-between">
            <div>
              <span>{{ isEvent ? 'Evento' : 'Attività' }} <span v-if="eventActivity" class="text-primary">{{ eventActivity.name }}</span></span>
            </div>
            <div>
              <span @click="router.push(`/${isEvent ? 'events' : 'activities'}/view`)" class="cursor-pointer text-grey-5 q-mr-md hover-underline" style="font-size: 15px">
                {{ $t(`buttons.backTo${isEvent ? 'Events' : 'Activities'}`) }}
              </span>
            </div>
          </div>
        </div>
        <div class="q-pa-lg container-body" style="height: 75vh;">
          <div class="flex justify-between">
            <div  v-if="eventActivity">
              <q-img :src="eventActivity.image" style="width: 275px; height: 275px; border-radius: 12px"/>
            </div>

            <div  v-if="eventActivity" style="width: 40%" class="flex column justify-center">
              <div>
                <span class="text-h6 text-bold text-secondary">Nome: </span>
                <span class="text-h6 q-ml-md">{{ eventActivity.name }}</span>
              </div>

              <div class="q-mt-md">
                <span class="text-h6 text-bold text-secondary">Data: </span>
                <span class="text-h6 q-ml-md">{{ formatDates(eventActivity.startDate, eventActivity.endDate) }}</span>
              </div>

              <div class="q-mt-md">
                <span class="text-h6 text-bold text-secondary">Ora di Inizio: </span>
                <span class="text-h6 q-ml-md">{{ formatHours(eventActivity.startDate) }}</span>
              </div>

              <div class="q-mt-md">
                <span class="text-h6 text-bold text-secondary">Luogo: </span>
                <span class="text-h6 q-ml-md">Oratorio S. Maria</span>
              </div>

              <div class="q-mt-md">
                <span class="text-h6 text-bold text-secondary">Note: </span>
                <span class="text-h6 q-ml-md">{{ eventActivity.note }}</span>
              </div>
            </div>

            <div  v-if="eventActivity" style="width: 25%" class="flex column justify-center items-center text-center q-pr-md">
              <div>
                <span class="text-h6 text-bold text-secondary">Organizzatore:</span><br/>
                <span style="font-size: 15px">Chiesa di Bergamo</span>
              </div>

              <div class="q-mt-md">
                <span class="text-h6 text-bold text-secondary">Telefono:</span><br/>
                <span style="font-size: 15px">3924444141</span>
              </div>

              <div class="q-mt-md">
                <span class="text-h6 text-bold text-primary">Prezzo {{ isEvent ? 'Evento' : 'Attività' }}:</span><br/>
                <span style="font-size: 15px">200€</span>
              </div>
            </div>

            <div v-if="eventActivity" class="flex justify-center q-mt-md">
              <div>
                <span class="text-h6 text-bold text-secondary">Descrizione:</span> <br/>
                <span style="font-size: 15px">{{ eventActivity.description }}</span>
              </div>
            </div>

            <div v-else>
              Nessun Evento Trovato
            </div>
          </div>

        </div>
      </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import activities from '@/data/activities.json';
import events from '@/data/events.json';

const props = defineProps<{
  id: number
}>();

const route = useRoute();
const router = useRouter();
const isEvent = computed(() => route.path.includes('events'));
const eventActivity = computed(() => {
  const data = isEvent.value ? events.events : activities.activities;
  const item = data.find(item => item.id === props.id);

  if (!item) return null;

  return {
    id: item.id,
    name: item.name,
    description: item.description,
    note: item.notes,
    startDate: item.startDate,
    endDate: item.endDate,
    image: item.image || 'https://cdn.quasar.dev/img/paris.jpg',
    price: 'targets' in item ? item.targets[0].price : item.price
  };
});

const formatDates = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const formattedStart = start.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });

  if (!endDate || startDate >= endDate) {
    return formattedStart;
  }

  const end = new Date(endDate);
  const formattedEnd = end.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });

  return `${formattedStart} - ${formattedEnd}`;
};

const formatHours = (dateString: string): string => {
  return dateString.split('T')[1].substring(0, 5);
};
</script>

