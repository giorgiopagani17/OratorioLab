<template>
  <q-input
    v-bind="inputProps"
    :disable="isDisabled"
    v-model="model"
    :maxlength="maxLength"
    :placeholder="placeholder"
    @update:model-value="handleUpdate"
    @blur="handleBlur"
  />
</template>

<script setup lang="ts">
const model = defineModel<string>();

const props = defineProps({
  isDisabled: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  },
  update: {
    type: String,
    default: null
  },
  blur: {
    type: String,
    default: null
  },
  maxLength: {
    type: Number,
    default: null
  },
  inputProps: {
    type: Object,
    default: () => ({})
  }
});

const cleanAndFormatInputWithDecimals = (input: string): string => {
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

const cleanAndFormatInputWithoutDecimals = (input: string): string => {
  const cleanedValue = input.replace(/[^\d,]/g, '');
  const normalizedValue = cleanedValue.replace(',', '.');
  const numericValue = parseFloat(normalizedValue);

  return isNaN(numericValue) || numericValue === 0
    ? '0'
    : numericValue.toLocaleString('it-IT');
};

const formatOnBlurWithDecimals = (value: string): string => {
  if (value.endsWith(',')) {
    return value.slice(0, -1);
  }
  if (value.includes(',') && value.split(',')[1] === '') {
    return value.split(',')[0];
  }
  return value;
};

const handleUpdate = (value: string | number | null) => {
  if (props.update === 'formatNumberDecimals') {
    const val = typeof value === 'string' ? value : String(value);
    model.value = cleanAndFormatInputWithDecimals(val);
  } else if(props.update === 'formatNumberNoDecimals') {
    const val = typeof value === 'string' ? value : String(value);
    model.value = cleanAndFormatInputWithoutDecimals(val);
  }
};

const handleBlur = () => {
  if (props.blur === 'formatNumberDecimals' && model.value) {
    model.value = formatOnBlurWithDecimals(model.value);
  }
};
</script>
