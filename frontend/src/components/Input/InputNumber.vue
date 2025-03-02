<!-- frontend/src/components/InputNumber.vue -->
<template>
  <q-input
    rounded
    :maxlength="maxLength"
    outlined
    :disable="!isDisabled"
    v-model="localDisplayValue"
    :placeholder="`${$t('labels.price')} Target`"
    :error="!isDisabled && !localDisplayValue"
    hide-bottom-space
    @update:model-value="handleUpdate"
    @blur="handleBlur"
  />
</template>

<script setup lang="ts">
import { ref, watch, defineProps } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  isDisabled: {
    type: Boolean,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  maxLength: {
    type: Number,
    default: 1000
  },
});

const emit = defineEmits(['update:modelValue']);
const localDisplayValue= ref(props.modelValue);


const cleanAndFormatInput = (input: string): string => {
  if (!input) return '0';

  const lastChar = input.slice(-1);
  const isDecimalPoint = lastChar === ',';

  const cleanedValue = input.replace(/[^\d,]/g, '');
  const hasComma = cleanedValue.includes(',');

  if (cleanedValue === ',') return '0,';
  if (isDecimalPoint && !hasComma) return cleanedValue + ',';

  const parts = cleanedValue.split(',');

  if (parts[0].length > 4) {
    parts[0] = parts[0].slice(0, 4);
  }

  if (parts.length > 2) {
    parts[1] = parts[1].slice(0, 2);
    parts.length = 2;
  } else if (parts.length === 2) {
    parts[1] = parts[1].slice(0, 2);
  }

  const numericValue = parseFloat(parts.join('.'));

  if (isNaN(numericValue)) return '0';
  if (numericValue === 0) return isDecimalPoint ? '0,' : '0';

  const formatted = numericValue.toLocaleString('it-IT', {
    minimumFractionDigits: parts.length === 2 ? parts[1].length : 0,
    maximumFractionDigits: parts.length === 2 ? parts[1].length : 0
  });

  return isDecimalPoint ? formatted + ',' : formatted;
};

const handleUpdate = (value: string | number | null) => {
  const val = typeof value === 'string' ? value : String(value);
  localDisplayValue.value = cleanAndFormatInput(val);
  emit('update:modelValue', localDisplayValue.value);
};

const handleBlur = () => {
  localDisplayValue.value = formatOnBlur(localDisplayValue.value);
  emit('update:modelValue', localDisplayValue.value);
};

const formatOnBlur = (value: string): string => {
  if (value.endsWith(',')) {
    return value.slice(0, -1);
  }
  if (value.includes(',') && value.split(',')[1] === '') {
    return value.split(',')[0];
  }
  return value;
};

watch(() => props.modelValue, (newValue) => {
  localDisplayValue.value = newValue;
});
</script>

<style scoped lang="scss">
</style>
