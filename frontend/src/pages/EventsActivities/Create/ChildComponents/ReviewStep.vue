<template>
  <div v-if="eventActivity" class="q-pa-sm q-pb-lg">
    <EventActivityReviewCard :section="props.section" :eventActivity="eventActivity" :isAdmin="false"/>
  </div>
  <div v-else class="q-pa-sm q-pb-md">
    <p>No event activity found.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { EventActivity } from '@/interfaces/EventActivity';
import EventActivityReviewCard from '@/components/Card/EventActivityReviewCard.vue';
import { useEventsActivitiesStore } from '@/stores/eventsActivities';

const props = defineProps<{
  section: string;
}>();

const eventActivity = ref<EventActivity | null>(null);

onMounted(() => {
  const store = useEventsActivitiesStore();
  const currentIndex = parseInt(store.eventsActivitiesIndex);

  const savedEventActivities = localStorage.getItem('eventsActivities');
  if (savedEventActivities) {
    const eventsActivities = JSON.parse(savedEventActivities) as EventActivity[];
    eventActivity.value = eventsActivities[currentIndex] || null;
  }
  console.log(eventActivity);
});
</script>
