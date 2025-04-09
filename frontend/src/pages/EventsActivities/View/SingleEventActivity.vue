<template>
  <q-page class="row items-center justify-evenly q-pa-md">
    <div class="flex-center" :class="{'q-py-sm w-95': $q.screen.gt.sm, 'q-py-sm w-100': $q.screen.lt.md}">
      <BodySection>
        <template v-slot:leftHeader>
          <div class="flex items-center">
            <q-btn
              flat
              round
              color="white"
              icon="arrow_back"
              size="sm"
              @click="router.push(`/${props.section}/view`)"
            />
            <span class="q-ml-xs">
              {{ $t(`menu.${props.section}`) }}
            </span>
          </div>
        </template>
        <div v-if="eventActivity" class="q-pa-sm full-width">
          <EventActivityReviewCard :id="props.id" :section="props.section" :eventActivity="eventActivity" :isAdmin="isAdmin"/>
        </div>
        <div v-else class="q-pa-sm full-width">
          <p>No event activity found.</p>
        </div>
      </BodySection>

      <div class="q-mt-lg">
        <EventActivityInformation
          v-if="isAdmin"
          :id="props.id"
          :section="props.section"
          :isLoading="isLoading"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import BodySection from '@/components/Sections/BodySection.vue';
import EventActivityReviewCard from '@/components/Card/EventActivityReviewCard.vue';
import activities from '@/data/activities.json';
import events from '@/data/events.json';
import {computed, onMounted, ref} from 'vue';
import { useRouter } from 'vue-router';
import EventActivityInformation from '@/pages/EventsActivities/Informations/EventActivityInformation.vue';

const props = defineProps<{
  id: number;
  section: string;
}>();

const router = useRouter();
const isLoading = ref(true);
const isAdmin = ref(true);

const eventActivity = computed(() => {
  const data = props.section === 'events' ? events.events : activities.activities;
  const item = data.find(item => item.id === props.id);

  if (!item) return null;

  return {
    id: item.id,
    name: item.name,
    description: item.description,
    notes: item.notes,
    startDate: item.startDate,
    endDate: item.endDate,
    image: item.image || 'https://cdn.quasar.dev/img/paris.jpg',
    price: 'targets' in item ? item.targets[0].price : item.price
  };
});

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 800);
});
</script>
