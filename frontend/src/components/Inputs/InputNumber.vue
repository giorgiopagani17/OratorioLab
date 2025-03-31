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
  >
    <template v-if="iconName" v-slot:append>
      <q-icon :name="iconName" :color="iconColor" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

type ValidationRule = (val: number | string | null) => boolean | string | Promise<boolean | string>;

const model = defineModel<number>();

const { isDisabled, placeholder, maxLength, inputProps, iconName, iconColor, rules, min, max } = defineProps({
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
});
</script>
