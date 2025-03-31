<template>
  <q-input
    v-bind="inputProps"
    v-model="model"
    :disable="isDisabled"
    :maxlength="maxLength"
    :placeholder="placeholder"
    @keypress="numericAndDecimalOnly"
  >
    <template v-if="iconName" v-slot:append>
      <q-icon :name="iconName" :color="iconColor"/>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import {computed} from 'vue';

const { isDisabled, placeholder, maxLength, inputProps, iconName, iconColor, decimal } = defineProps({
  isDisabled: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  },
  maxLength: {
    type: Number,
    default: null
  },
  inputProps: {
    type: Object,
    default: () => ({})
  },
  iconName: {
    type: String,
    default: ''
  },
  iconColor: {
    type: String,
    default: 'white'
  },
  decimal: {
    type: Boolean,
    default: true
  }
});
const modelValue = defineModel<number | string>();

const model = computed({
  get: () => {
    if (typeof modelValue.value === 'number') {
      return modelValue.value.toLocaleString('it-IT', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    }
    if (typeof modelValue.value === 'string') {
      if (!modelValue.value) return '';

      if (!isNaN(parseFloat(modelValue.value.replace(/\./g, '').replace(',', '.')))) {
        const num = parseFloat(modelValue.value.replace(/\./g, '').replace(',', '.'));
        return num.toLocaleString('it-IT', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        });
      }
    }
    return modelValue.value || '';
  },
  set: (value: string | number) => {
    if (typeof value === 'string' && value) {
      const numericValue = parseFloat(value.replace(/\./g, '').replace(',', '.'));
      modelValue.value = isNaN(numericValue) ? value : numericValue;
    } else {
      modelValue.value = value;
    }
  }
});

const numericAndDecimalOnly = (event: KeyboardEvent) => {
  if (!decimal && !/\d/.test(event.key)) {
    event.preventDefault();
    return;
  }

  if (decimal && !/[\d,]/.test(event.key)) {
    event.preventDefault();
    return;
  }

  if (decimal) {
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
    const cursorPosition = input.selectionStart ?? 0;
    const selectionEnd = input.selectionEnd ?? cursorPosition;

    const hasSelection = cursorPosition !== selectionEnd;

    if ((event.key === ',') &&
      (cursorPosition === 0 || !currentValue.substring(0, cursorPosition).match(/\d/))) {
      event.preventDefault();
      return;
    }

    const hasDecimalSeparator = currentValue.includes(',');

    if ((event.key === ',') &&
      !hasSelection && hasDecimalSeparator) {
      event.preventDefault();
      return;
    }
  }
};
</script>
