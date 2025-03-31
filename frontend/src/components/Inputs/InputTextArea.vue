<template>
  <q-input
    v-trim
    v-bind="inputProps"
    v-model="model"
    :maxlength="props.maxLength"
    :placeholder="placeholder"
    :rules="rules"
    type="textarea"
  />
</template>

<script setup lang="ts">
import trim from '@/directives/v-trim';

const vTrim = trim;
const model = defineModel<string>();

const props = defineProps({
  placeholder: {
    type: String,
    default: ''
  },
  rules: {
    type: Array as () => ((val: string | null | undefined) => boolean)[],
    default: () => []
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
</script>
