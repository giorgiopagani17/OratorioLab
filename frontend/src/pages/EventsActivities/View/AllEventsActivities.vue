<template>
  <q-page class="row items-center justify-evenly q-pa-md">
    <div style="width: 90%; height: 100%">
      <div class="container flex justify-center q-mb-lg" style="padding: 12px">
        <div class="flex items-center justify-center q-pr-sm border-right-grey-responsive">
          <q-input
            v-model="search"
            dense
            input-style="color: white;"
            :placeholder="$t('placeholders.search')"
            color="white"
            class="custom-input blue-container-input"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="white"/>
            </template>
          </q-input>
        </div>
        <div class="flex items-center justify-center q-pl-sm">
          <q-btn v-for="button in buttons" :key="button.title" :color="button.active ? 'secondary' : 'primary'" class="button" style="width: 150px;" @click="toggleFilter(button)">
            {{ $t(`buttons.${button.title}`) }}
          </q-btn>

          <q-btn color="grey" class="button" style="width: 150px;" @click="router.push('/'+ pageType)">
            {{ $t('buttons.back') }}
          </q-btn>
        </div>
      </div>

      <div class="q-mt-lg container-border">
        <div class="bg-secondary text-bold text-white q-py-sm q-pl-md container-header">
          {{ $t(`titles.${pageType}All`) }}
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

              <div style="width: 50%" class="flex column justify-center q-pl-md">
                <span class="text-h5 text-bold text-secondary q-mb-sm">{{ eventActivity.name }}</span>
                <span class="text-grey-7 description-text">{{ eventActivity.description }}</span>
              </div>

              <div style="width: 24%" class="flex column justify-center items-end q-pr-md">
                <span class="text-secondary text-right" style="font-size: 16px">{{ formatDates(eventActivity.startDate, eventActivity.endDate) }}</span>
                <span class="text-grey-8 text-right description-text q-mb-lg" style="font-size: 16px">Prezzo: {{ eventActivity.price }}€</span>
                <q-btn color="primary" style="width: 100px" @click="navigateToDetail(eventActivity.id)">
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
import { useRoute, useRouter } from 'vue-router';
import activities from '@/data/activities.json'
import events from '@/data/events.json'

defineOptions({
  name: 'UserPage'
});

interface EventActivityDisplay {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  image: string;
  price: number;
}

interface Button {
  title: string;
  action: string;
  active: boolean;
}

const search = ref<string>('');
const route = useRoute();
const router = useRouter();
const pageType = computed(() => route.path.includes('events') ? 'events' : 'activities');

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

const toggleFilter = (button: Button) => {
  buttons.value = buttons.value.map(btn => ({
    ...btn,
    active: btn === button ? !btn.active : false
  }));
  applyFilters();
};

const applyFilters = (items?: EventActivityDisplay[]): EventActivityDisplay[] => {
  let filteredItems = items ? [...items] : [...eventsActivities.value];
  const activeFilter = buttons.value.find(btn => btn.active);

  if (activeFilter) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (activeFilter.action) {
      case 'tomorrow':
        filteredItems = filteredItems.filter((item: EventActivityDisplay) => {
          const startDate = new Date(item.startDate);
          startDate.setHours(0, 0, 0, 0);
          return startDate.getTime() === tomorrow.getTime();
        });
        break;
      case 'gratis':
        filteredItems = filteredItems.filter((item: EventActivityDisplay) => item.price === 0);
        break;
      case 'current':
        filteredItems = filteredItems.filter((item: EventActivityDisplay) => {
          const startDate = new Date(item.startDate);
          const endDate = new Date(item.endDate);
          const now = new Date();
          return startDate <= now && endDate >= now;
        });
        break;
    }
  }

  if (search.value) {
    const searchLower = search.value.toLowerCase();
    filteredItems = filteredItems.filter((item: EventActivityDisplay) =>
      item.name.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower)
    );
  }

  return filteredItems;
};

const eventsActivities = computed<EventActivityDisplay[]>(() => {
  const data = pageType.value === 'activities' ? activities.activities : events.events;
  const items: EventActivityDisplay[] = data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    startDate: item.startDate.split('T')[0],
    endDate: item.endDate.split('T')[0],
    image: item.image || 'https://cdn.quasar.dev/img/paris.jpg',
    fullData: item,
    price: 'targets' in item ? item.targets[0].price : item.price
  }));
  return applyFilters(items);
});

const buttons = ref<Button[]>([
  { title: 'tomorrow', action: 'tomorrow', active: false },
  { title: 'gratis', action: 'gratis', active: false },
  { title: 'current', action: 'current', active: false },
]);

const navigateToDetail = (id: number) => {
  const currentPath = route.path;
  router.push(`${currentPath}/${id}`);
};
</script>

<style lang="scss">
.input-blue {
  border: none !important;
  border-radius: 100px;
}
</style>
