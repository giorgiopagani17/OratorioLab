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
        </template>
      </HeaderSection>

      <BodySection class="q-mt-lg">
        <template v-slot:leftHeader>
          <div class="flex items-center">
            <q-btn
              flat
              round
              color="white"
              icon="arrow_back"
              size="sm"
              @click="router.push(`/${props.section}`)"
            />
            <span class="q-ml-xs">
              {{ $t(`menu.${props.section}${props.isDraft ? 'Drafts' : ''}`) }}
            </span>
          </div>
        </template>
        <div class="events-grid row q-col-gutter-md">
          <div
            v-for="(eventActivity, index) in eventsActivities"
            :key="index"
            class="col-12 col-sm-6 col-md-4"
          >
            <EventActivityListCard
              :event-activity="eventActivity"
              :is-draft="props.isDraft"
              @click="handleClick"
            />
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
import { EventActivity } from '@/interfaces/EventActivity';
import {useEventsActivitiesStore} from '@/stores/eventsActivities';
import EventActivityListCard from '@/components/Card/EventActivityListCard.vue';

defineOptions({
  name: 'UserPage'
});

interface Button {
  title: string;
  action: string;
  active: boolean;
  icon: string;
}

const props = defineProps<{
  id: number;
  section: string;
  isDraft: boolean;
}>();

const search = ref<string>('');
const router = useRouter();
const route = useRoute();

const toggleFilter = (button: Button) => {
  buttons.value = buttons.value.map(btn => ({
    ...btn,
    active: btn === button ? !btn.active : false
  }));
  applyFilters();
};

const applyFilters = (items?: EventActivity[]): EventActivity[] => {
  let filteredItems = items ? [...items] : [...eventsActivities.value];
  const activeFilter = buttons.value.find(btn => btn.active);

  if (activeFilter) {
    if (props.isDraft) {
      // Draft filters
      switch (activeFilter.action) {
        case 'latest':
          filteredItems.sort((a, b) => {
            const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
            const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
            return dateB - dateA;
          });
          break;
        case 'finished':
          filteredItems = filteredItems.filter((item: EventActivity) => {
            if (!item.endDate) return false;
            const endDate = new Date(item.endDate);
            const now = new Date();
            return endDate < now;
          });
          break;
        case 'empty':
          filteredItems = filteredItems.filter((item: EventActivity) => {
            return !item.name || item.name.trim() === '';
          });
          break;
        case 'gratis':
          filteredItems = filteredItems.filter((item: EventActivity) =>
            item.price === 0 || item.price === undefined
          );
          break;
      }
    } else {
      // Regular filters
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      switch (activeFilter.action) {
        case 'latest':
          filteredItems.sort((a, b) => {
            const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
            const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
            return dateB - dateA;
          });
          break;
        case 'tomorrow':
          filteredItems = filteredItems.filter((item: EventActivity) => {
            if (!item.startDate) return false;
            const startDate = new Date(item.startDate);
            startDate.setHours(0, 0, 0, 0);
            return startDate.getTime() === tomorrow.getTime();
          });
          break;
        case 'gratis':
          filteredItems = filteredItems.filter((item: EventActivity) =>
            item.price === 0 || item.price === undefined
          );
          break;
        case 'current':
          filteredItems = filteredItems.filter((item: EventActivity) => {
            if (!item.startDate || !item.endDate) return false;
            const startDate = new Date(item.startDate);
            const endDate = new Date(item.endDate);
            const now = new Date();
            return startDate <= now && endDate >= now;
          });
          break;
      }
    }
  }

  if (search.value) {
    const searchLower = search.value.toLowerCase();
    filteredItems = filteredItems.filter((item: EventActivity) =>
      (item.name?.toLowerCase().includes(searchLower) || false) ||
      (item.description?.toLowerCase().includes(searchLower) || false)
    );
  }

  return filteredItems;
};

const eventsActivities = computed<EventActivity[]>(() => {
  const data = props.section === 'activities' ? activities.activities : events.events;
  const items: EventActivity[] = data.map(item => ({
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

const buttons = ref<Button[]>(
  props.isDraft ?
    [
      { title: 'latest', action: 'latest', icon: 'update', active: false },
      { title: 'finished', action: 'finished', icon: 'check_circle', active: false },
      { title: 'empty', action: 'empty', icon: 'inbox', active: false },
      { title: 'gratis', action: 'gratis', icon: 'money_off', active: false },
    ] :
    [
      { title: 'latest', action: 'latest', icon: 'update', active: false },
      { title: 'tomorrow', action: 'tomorrow', icon: 'event', active: false },
      { title: 'gratis', action: 'gratis', icon: 'money_off', active: false },
      { title: 'current', action: 'current', icon: 'today', active: false },
    ]
);

const navigateToDetail = (id: number) => {
  const currentPath = route.path;
  router.push(`${currentPath}/${id}`);
};

const handleClick = (eventActivity: EventActivity) => {
  if (props.isDraft) {
    const eventsActivitiesStore = useEventsActivitiesStore();

    eventsActivitiesStore.addEventActivity(eventActivity);
    router.push(`/${props.section}/create`);
  } else if (eventActivity.id) {
    navigateToDetail(eventActivity.id);
  }
}
</script>

<style lang="scss" scoped>
.events-grid {
  overflow-y: auto;
  height: 62.5vh;
  width: 100%;
  padding: 0px 8px 10px 8px;
}
</style>
