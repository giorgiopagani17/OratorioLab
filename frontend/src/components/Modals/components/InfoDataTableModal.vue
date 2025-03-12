<template>
  <ModalCustom
    v-model="isOpen"
    :persistent="false"
    :show-header="true"
    :title="$t('titles.info')"
    titleColor="primary"
    width="500px"
  >
    <div>
      <div v-for="(value, key) in rowData" :key="key" class="q-mb-md">
        <div class="text-subtitle1 text-bold text-secondary">{{ $t(`labels.${key}`) }}:</div>
        <q-input dense readonly :model-value="convertToDisplayValue(value)" />
      </div>
    </div>
  </ModalCustom>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ModalCustom from '@/components/Modals/ModalCustom.vue';

const props = defineProps<{
  modelValue: boolean;
  rowData: Record<string, unknown> | null;
}>();

const emit = defineEmits(['update:modelValue']);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const convertToDisplayValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
};
</script>
