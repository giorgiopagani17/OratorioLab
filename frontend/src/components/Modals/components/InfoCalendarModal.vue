<template>
  <ModalCustom
    v-model="isOpen"
    :persistent="false"
    :show-header="true"
    :title="$t('titles.details')"
    titleColor="primary"
    width="400px"
  >
    <div class="q-mb-sm" style="max-height: 290px; overflow: auto">
      <div v-for="eventActivity in rowData" :key="eventActivity.id">
        <div class="text-h6 text-secondary text-bold">{{ eventActivity.title }}</div>
        <div class="text-subtitle2">{{ formatEventDateTime(eventActivity) }}</div>
        <div class="text-subtitle3">Prezzo:
          <span v-if="eventActivity.price > 0" class="text-secondary text-bold">{{ eventActivity.price }}€</span>
          <span v-else class="text-secondary text-bold">{{ $t('texts.gratis') }}</span>
        </div>
        <div class="q-mt-sm">{{ eventActivity.description }}</div>
        <q-separator v-if="!isLastEvent(eventActivity)" class="q-my-md" />
      </div>
    </div>
  </ModalCustom>
</template>

<script setup lang="ts">
import ModalCustom from '@/components/Modals/ModalCustom.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n'; // Assuming you're using vue-i18n

interface EventActivity {
  id: string | number;
  title: string;
  startDate: string;
  endDate: string;
  price: number;
  description: string;
}

const { locale } = useI18n();

const props = defineProps<{
  modelValue: boolean;
  rowData: EventActivity[];
}>();

const emit = defineEmits(['update:modelValue']);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const formatEventDateTime = (event: EventActivity): string => {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const lang = locale.value === 'it' ? 'it-IT' : 'en-US';

  const formatter = new Intl.DateTimeFormat(lang, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const formatDate = (date: Date): string => {
    const formattedDate = formatter.format(date);
    return formattedDate.replace(/\b[a-z]/g, c => c.toUpperCase());
  };

  if (
    startDate.getDate() === endDate.getDate() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear()
  ) {
    return formatDate(startDate);
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

const isLastEvent = (event: EventActivity): boolean => {
  return props.rowData.indexOf(event) === props.rowData.length - 1;
};
</script>
