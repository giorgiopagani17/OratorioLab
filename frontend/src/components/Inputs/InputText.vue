<template>
  <q-input
    v-trim
    v-bind="inputProps"
    v-model="model"
    :maxlength="maxLength"
    :label="label || undefined"
    :placeholder="placeholder"
    :rules="rules"
    type="text"
  >
    <template v-if="iconName" v-slot:append>
      <q-icon :name="iconName" :color="iconColor" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import trim from '@/directives/v-trim';

const vTrim = trim;
const model = defineModel<string>();

const { label, placeholder, rules, maxLength, inputProps, iconName, iconColor } = defineProps({
  label: {
    type: String,
    default: ''
  },
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
  },
  iconName: {
    type: String,
    default: ''
  },
  iconColor: {
    type: String,
    default: ''
  }
});
</script>

<style lang="scss" scoped>
:deep(.q-field__native) {
  &::placeholder {
    opacity: 1 !important;
    color: rgba(0, 0, 0, 0.6) !important;
    transition: none !important;
  }
}

:deep(.q-field--focused) {
  .q-field__native::placeholder {
    opacity: 1 !important;
    visibility: visible !important;
  }
}
</style>
