<template>
  <q-input
    v-bind="inputProps"
    v-model="model"
    :maxlength="maxLength"
    :placeholder="placeholder"
    @blur="handleBlur"
    :rules="rules"
    type="text"
  />
</template>

<script setup lang="ts">
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

const trimText = () => {
  if (model.value) {
    model.value = model.value.toString().trim();
  }
};

const handleBlur = () => {
  if (props.blur === 'trimText') {
    trimText();
  }
};
</script>
