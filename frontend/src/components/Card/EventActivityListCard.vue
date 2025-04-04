<template>
  <div class="event-card q-pa-md" style="width: 340px">
    <q-img
      :src="props.eventActivity.image || ''"
      class="event-card-image"
      height="160px"
    />
    <div class="event-card-content q-pt-md">
      <div class="text-subtitle1 text-bold text-secondary ellipsis-2-lines">
        {{ props.eventActivity.name || 'No name' }}
      </div>
      <div class="text-grey-7 ellipsis-2-lines q-mt-xs" style="height: 42px">
        {{ props.eventActivity.description || 'No description' }}
      </div>
      <div class="row justify-between items-center q-mt-sm">
        <div class="text-caption text-secondary">
          {{ formatDates(props.eventActivity.startDate, props.eventActivity.endDate) }}
        </div>
        <div class="text-caption">
          <span v-if="props.eventActivity.price && props.eventActivity.price > 0">{{ props.eventActivity.price }}€</span>
          <span v-else>{{ $t('texts.gratis') }}</span>
        </div>
      </div>
      <q-btn
        color="primary"
        flat
        class="q-mt-sm full-width"
        @click="$emit('click', props.eventActivity)"
      >
        <span v-if="props.isDraft">
          {{ $t('buttons.edit') }}
        </span>
        <span v-else>
          {{ $t('buttons.view') }}
        </span>
      </q-btn>
    </div>
  </div>
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  height: 355px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
}

.event-card-image {
  border-radius: 4px;
}

.event-card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
