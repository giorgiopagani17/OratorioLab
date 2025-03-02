<template>
  <q-input
    rounded
    outlined
    v-model="inputValue"
    :placeholder="placeholder"
    @blur="handleBlur"
    :rules="rules"
    hide-bottom-space
    type="text"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  rules: {
    type: Array as () => ((val: string | null | undefined) => boolean)[],
    default: () => [(val: string | null | undefined) => !!val]
  }
});

const emit = defineEmits(['update:modelValue']);

const inputValue = ref(props.modelValue);

watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue);
});

const handleBlur = () => {
  inputValue.value = (inputValue.value?.toString() || '').trim();
};
</script>
