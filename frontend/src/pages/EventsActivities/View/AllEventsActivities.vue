<template>
  <q-page class="row items-center justify-evenly q-pa-md">
    <div :class="{'w-95': $q.screen.gt.sm, 'q-py-sm w-100': $q.screen.lt.md}">
      <HeaderSection
        leftColXs="col-12"
        leftColMd="col-md-4"
        rightColXs="col-12"
        rightColMd="col-md-8">
        <template #left>
          <div class="col-12 margin-bottom-responsive">
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
        </template>
        <template #right>
          <div class="col-3 q-px-sm" v-for="button in buttons" :key="button.title">
            <ResponsiveButton
              :text="$t(`buttons.${button.title}`)"
              :icon="button.icon"
              :active="button.active"
              @click="toggleFilter(button)"
            />
          </div>
          <div class="col-3 q-px-sm">
            <ResponsiveButton
              :text="$t('buttons.back')"
              icon="arrow_back"
              color="grey"
              :active="false"
              @click="router.push('/'+ props.section)"
            />
          </div>
        </template>
      </HeaderSection>

      <BodySection class="q-mt-lg">
        <template v-slot:leftHeader>
          <div class="flex items-center">
            <span class="q-ml-xs">
              {{ $t(`menu.${props.section}`) }}
            </span>
          </div>
        </template>
        <div class="events-list">
          <div
            v-for="(eventActivity, index) in eventsActivities"
            :key="index"
            class="container-event-activity q-mb-md"
            :class="{ 'flex-row': $q.screen.gt.xs, 'flex-column': $q.screen.lt.sm }"
          >
            <div :class="{ 'event-image-container': $q.screen.gt.xs, 'event-image-mobile': $q.screen.lt.sm }">
              <q-img :src="eventActivity.image" class="event-image" />
            </div>

            <div :class="{ 'event-content': $q.screen.gt.xs, 'event-content-mobile': $q.screen.lt.sm }">
              <span class="text-h5 text-bold text-secondary q-mb-sm event-title">{{ eventActivity.name }}</span>
              <span class="text-grey-7 description-text">{{ eventActivity.description }}</span>
            </div>

            <div :class="{ 'event-actions': $q.screen.gt.xs, 'event-actions-mobile': $q.screen.lt.sm }">
              <span class="text-secondary event-date">{{ formatDates(eventActivity.startDate, eventActivity.endDate) }}</span>
              <span class="text-grey-8 event-price q-mb-md">
                {{ $t('labels.price') }}:
                <span v-if="eventActivity.price > 0">{{ eventActivity.price }}€</span>
                <span v-else>Gratis</span>
              </span>
              <q-btn color="primary" class="view-btn" @click="navigateToDetail(eventActivity.id)">
                {{ $t('buttons.view') }}
              </q-btn>
            </div>
          </div>
        </div>
      </BodySection>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import activities from '@/data/activities.json'
import events from '@/data/events.json'
import HeaderSection from '@/components/Sections/HeaderSection.vue';
import BodySection from '@/components/Sections/BodySection.vue';
import ResponsiveButton from '@/components/Buttons/ResponsiveButton.vue';

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
  icon: string;
}

const props = defineProps<{
  id: number;
  section: string;
}>();

const search = ref<string>('');
const router = useRouter();
const route = useRoute();

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
  const data = props.section === 'activities' ? activities.activities : events.events;
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
  { title: 'tomorrow', action: 'tomorrow', icon: 'event', active: false },
  { title: 'gratis', action: 'gratis', icon: 'money_off', active: false },
  { title: 'current', action: 'current', icon: 'today', active: false },
]);

const navigateToDetail = (id: number) => {
  const currentPath = route.path;
  router.push(`${currentPath}/${id}`);
};
</script>

<style lang="scss" scoped>
.input-blue {
  border: none !important;
  border-radius: 100px;
}

.events-list {
  overflow-y: auto;
  max-height: 62.5vh;
  padding: 0 12px;
  width: 100%;
}

.container-event-activity {
  width: 100%;
  display: flex;
  border-radius: 9px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.flex-row {
  flex-direction: row;
}

.flex-column {
  flex-direction: column;
}

.event-image-container {
  width: 150px;
  min-width: 150px;
}

.event-image-mobile {
  width: 100%;
  height: 200px;
}

.event-image {
  width: 100%;
  height: 100%;
  min-height: 150px;
  object-fit: cover;
}

.event-content {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.event-content-mobile {
  padding: 16px;
}

.event-actions {
  width: 200px;
  min-width: 180px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
}

.event-actions-mobile {
  padding: 0 16px 16px;
  display: flex;
  flex-direction: column;
}

.event-title {
  font-size: 1.5rem;
  line-height: 1.2;
  @media (max-width: 599px) {
    font-size: 1.25rem;
  }
}

.event-date {
  font-size: 16px;
  text-align: right;
  @media (max-width: 599px) {
    text-align: left;
    margin-top: 8px;
  }
}

.event-price {
  font-size: 16px;
  text-align: right;
  @media (max-width: 599px) {
    text-align: left;
    margin-bottom: 16px !important;
  }
}

.view-btn {
  width: 100px;
  @media (max-width: 599px) {
    align-self: flex-start;
    width: 100%;
  }
}

.description-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 599px) {
  .q-pa-lg-xl {
    padding: 16px;
  }
}
</style>
