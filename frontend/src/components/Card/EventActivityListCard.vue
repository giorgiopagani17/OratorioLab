<template>
  <q-card class="event-card" style="width: 340px">
    <q-img
      :src="props.eventActivity.image || ''"
      height="160px"
    />

    <q-card-section>
      <div class="text-subtitle1 text-bold text-secondary ellipsis-2-lines">
        {{ props.eventActivity.name || 'No name' }}
      </div>
      <div class="text-grey-7 ellipsis-2-lines q-mt-xs" style="height: 42px">
        {{ props.eventActivity.description || 'No description' }}
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="row justify-between items-center">
        <div class="text-caption text-secondary">
          {{ formatDates(props.eventActivity.startDate, props.eventActivity.endDate) }}
        </div>
        <div class="text-caption">
          <span v-if="props.eventActivity.price && props.eventActivity.price > 0">{{ props.eventActivity.price }}€</span>
          <span v-else>{{ $t('texts.gratis') }}</span>
        </div>
      </div>
    </q-card-section>

    <q-card-actions vertical>
      <q-btn
        color="primary"
        flat
        class="full-width"
        @click="$emit('click', props.eventActivity)"
      >
        <span v-if="props.isDraft">
          {{ $t('buttons.edit') }}
        </span>
        <span v-else>
          {{ $t('buttons.view') }}
        </span>
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { EventActivity } from '@/interfaces/EventActivity';

const props = defineProps<{
  eventActivity: EventActivity;
  isDraft: boolean;
}>();

defineEmits<(e: 'click', eventActivity: EventActivity) => void>();

const formatDates = (startDate?: string, endDate?: string): string => {
  if (!startDate || !endDate) return 'No date';

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
</script>

<style lang="scss" scoped>
.event-card {
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  }
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
