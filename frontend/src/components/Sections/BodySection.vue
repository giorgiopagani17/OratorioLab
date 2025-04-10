<template>
  <div class="container-border">
    <div class="bg-secondary text-bold text-white q-py-sm q-px-md container-header">
      <div class="row full-width justify-between items-center">
        <div class="flex-grow-1 overflow-auto single-line-truncate">
          <slot name="leftHeader"/>
        </div>
        <div class="no-shrink single-line-truncate">
          <slot name="rightHeader"/>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-center container-body" :class="paddingClass">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';

const props = defineProps({
  padding: {
    type: String,
    default: 'q-pa-md'
  }
});

const paddingClass = computed(() => {
  return props.padding || '';
});
</script>
