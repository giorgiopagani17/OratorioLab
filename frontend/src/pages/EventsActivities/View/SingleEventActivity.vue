<template>
  <q-page class="row items-center justify-evenly q-pa-md">
    <div class="flex-center" :class="{'w-95': $q.screen.gt.sm, 'q-py-sm w-100': $q.screen.lt.md}">
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
          <EventActivityCard :id="props.id" :section="props.section" :eventActivity="eventActivity" :isAdmin="true"/>
        </div>
        <div v-else class="q-pa-sm full-width">
          <p>No event activity found.</p>
        </div>
      </BodySection>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import BodySection from '@/components/Sections/BodySection.vue';
import EventActivityCard from '@/components/Card/EventActivityCard.vue';
import activities from '@/data/activities.json';
import events from '@/data/events.json';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  id: number;
  section: string;
}>();

const router = useRouter();
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
</script>
