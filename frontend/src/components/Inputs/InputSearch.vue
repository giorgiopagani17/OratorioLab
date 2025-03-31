<template>
  <q-input
    v-trim
    v-bind="inputProps"
    v-model="model"
    :color="inputColor"
    :maxlength="maxLength"
    :placeholder="placeholder || $t('placeholders.search')"
    :rules="rules"
    type="text"
    clearable
    dense
    hideBottomSpace
    :class="['custom-input', {'blue-container-input full-width q-pt-auto' : isBluContainer}]"
  >
    <template v-if="iconName" v-slot:prepend>
      <q-icon :name="iconName" :color="iconColor"/>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import trim from '@/directives/v-trim';

const vTrim = trim;
const model = defineModel<string>();

const { placeholder, inputColor, rules, maxLength, inputProps, iconName, iconColor, isBluContainer } = defineProps({
  placeholder: {
    type: String,
    default: ''
  },
  rules: {
    type: Array as () => ((val: string | null | undefined) => boolean)[],
    default: () => []
  },
  inputColor: {
    type: String,
    default: 'white'
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
    default: 'search'
  },
  iconColor: {
    type: String,
    default: 'white'
  },
  isBluContainer: {
    type: Boolean,
    default: true
  }
});
</script>

<style scoped>
:deep(.q-field__focusable-action) {
  color: white !important;
}
</style>
