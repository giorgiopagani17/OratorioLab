<template>
  <q-knob
    :model-value="percentage"
    :color="color"
    :size="size"
    :thickness="thickness"
    :track-color="trackColor"
    :class="knobClass"
    :min="min"
    :max="max"
    readonly
    show-value
    :style="knobStyle"
  >
    <div class="text-center">
      <div class="text-caption text-uppercase">{{ label }}</div>
      <div class="text-subtitle2">{{ count }}</div>
    </div>
  </q-knob>
</template>

<script setup lang="ts">
import {computed} from 'vue';

defineOptions({
  name: 'StatusKnob'
});

const props = defineProps({
  status: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: '120px'
  },
  thickness: {
    type: Number,
    default: 0.2
  },
  trackColor: {
    type: String,
    default: 'grey-3'
  },
  knobClass: {
    type: String,
    default: 'q-mx-xs status-knob'
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  marginMultiplier: {
    type: Number,
    default: 5
  },
  label: {
    type: String,
    default: ''
  }
});

const knobStyle = computed(() => {
  return {
    marginTop: `${props.count * props.marginMultiplier}px`
  };
});
</script>

<style scoped lang="scss">
.status-knob {
  position: relative;
  height: 140px !important;
}
</style>
