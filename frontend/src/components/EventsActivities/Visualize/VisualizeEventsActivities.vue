<template>
  <q-page class="row items-center justify-evenly q-pa-md page-background">
    <div style="width: 90%; height: 100%">
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
          {{ $t(`titles.all${pageType}`) }}
        </div>
        <div class="q-pa-lg container-body">
          <div class="q-px-md" style="height: calc(100vh - 310px); overflow-y: auto;">
            <div
              v-for="(eventActivity, index) in eventsActivities"
              :key="index"
              class="flex justify-between container-event-activity"
              :class="{ 'q-mt-md': index > 0 }"
              style="width: 100%"
            >
              <div>
                <q-img :src="eventActivity.image" style="width: 150px; height: 150px; border-bottom-left-radius: 9px; border-top-left-radius: 9px"/>
              </div>

              <div style="width: 50%" class="flex column justify-center">
                <span class="text-h5 text-bold text-secondary q-mb-sm">{{ eventActivity.name }}</span>
                <span class="text-grey-7 description-text">{{ eventActivity.description }}</span>
              </div>

              <div style="width: 24%" class="flex column justify-center items-end q-pr-md">
                <span class="text-secondary text-right" style="font-size: 16px">{{ formatDates(eventActivity.startingDate, eventActivity.endingDate) }}</span>
                <span class="text-grey-8 text-right description-text q-mb-lg" style="font-size: 16px">Prezzo: 200€</span>
                <q-btn color="primary" style="width: 100px">
                  Visualizza
                </q-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import { useRoute } from 'vue-router';

defineOptions({
  name: 'UserPage'
});

interface EventActivity {
  name: string;
  description: string;
  note: string;
  maxParticipants: number;
  startingDate: string;
  endingDate: string;
  image: string;
}

interface Button {
  title: string;
  action: string;
}

const search = ref<string>('');
const route = useRoute();
const pageType = computed(() => route.path.includes('events') ? 'Events' : 'Activities');

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

const eventsActivities: EventActivity[] = [
  {
    name: 'Event 1',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus luctus urna sed urna ultricies ac tempor dui sagittis. In condimentum facilisis porta. Sed nec diam eu diam mattis viverra. Nulla fringilla, orci ac euismod semper, magna diam porttitor mauris, quis sollicitudin sapien justo in libero. Nulla facilisi. Pellentesque convallis ultricies, dolor nec venenatis sollicitudin, nisi ante interdum nunc, ac varius sapien odio in ante.',
    note: 'Note 1',
    maxParticipants: 100,
    startingDate: '2022-01-01',
    endingDate: '2022-01-02',
    image: 'https://www.altrasoluzione.com/images/blog/come-creare-le-immagini-per-un-sito-web/gioconda1000x1000.jpg'
  },
  {
    name: 'Event 2',
    description: 'Description 2',
    note: 'Note 2',
    maxParticipants: 200,
    startingDate: '2022-02-01',
    endingDate: '2022-02-02',
    image: 'https://www.altrasoluzione.com/images/blog/come-creare-le-immagini-per-un-sito-web/gioconda1000x1000.jpg'
  },
  {
    name: 'Event 3',
    description: 'Description 3',
    note: 'Note 3',
    maxParticipants: 300,
    startingDate: '2022-03-01',
    endingDate: '2022-03-02',
    image: 'https://www.altrasoluzione.com/images/blog/come-creare-le-immagini-per-un-sito-web/gioconda1000x1000.jpg'
  }
];

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
</script>

<style lang="scss">
.input-blue {
  border: none !important;
  border-radius: 100px;
}
</style>
