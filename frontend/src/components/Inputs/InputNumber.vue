<template>
  <q-input
    v-bind="inputProps"
    v-model="model"
    :disable="isDisabled"
    :maxlength="maxLength"
    :placeholder="placeholder"
    :rules="rules"
    type="number"
    :min="min"
    :max="max"
    :hide-bottom-space="hideBottomSpace"
    @update:model-value="handleInput"
  >
    <template v-if="iconName" v-slot:append>
      <q-icon :name="iconName" :color="iconColor" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import {PropType} from 'vue';

type ValidationRule = (val: number | string | null) => boolean | string | Promise<boolean | string>;

const model = defineModel<number | null>();

const { isDisabled, placeholder, maxLength, inputProps, iconName, iconColor, rules, min, max, hideBottomSpace } = defineProps({
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
  rules: {
    type: Array as PropType<ValidationRule[]>,
    default: () => []
  },
  min: {
    type: [Number, String],
    default: undefined
  },
  max: {
    type: [Number, String],
    default: undefined
  },
  hideBottomSpace: {
    type: Boolean,
    default: false
  }
});

const handleInput = (value: string | number | null) => {
  if (value === '' || value === null || value === undefined) {
    model.value = null;
    return;
  }

  let formattedValue = typeof value === 'string' ? Number(value) : value;
  const minValue = min !== undefined ? Number(min) : undefined;
  const maxValue = max !== undefined ? Number(max) : undefined;

  if (minValue !== undefined && formattedValue < minValue) {
    model.value = minValue;
  } else if (maxValue !== undefined && formattedValue > maxValue) {
    model.value = maxValue;
  } else {
    model.value = formattedValue;
  }
};
</script>
