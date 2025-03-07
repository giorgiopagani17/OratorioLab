<template>
  <div class="q-mt-lg container-border">
    <div class="bg-secondary text-bold text-white q-py-sm q-pl-md container-header">
      {{ $t(props.title) }}
    </div>
    <div class="flex items-center justify-center q-pa-md container-body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();
</script>
