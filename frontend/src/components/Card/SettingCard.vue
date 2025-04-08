<template>
  <div class="settings-section q-mb-md">
    <div class="row items-center q-col-gutter-md">
      <div class="col-12 col-md-4">
        <div class="text-subtitle1 text-weight-medium">{{ label }}</div>
        <div class="text-caption text-grey-7">{{ description }}</div>
      </div>
      <div class="col-12 col-md-8">
        <slot></slot>
      </div>
    </div>
    <q-separator v-if="showSeparator" class="q-my-lg" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  showSeparator: {
    type: Boolean,
    default: true
  }
});
</script>

<style lang="scss" scoped>
.settings-section {
  width: 100%;
}
</style>
