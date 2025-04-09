<template>
  <q-avatar :size="size" :color="bgColor" :text-color="textColor">
    {{ getInitials(name) }}
  </q-avatar>
</template>

<script setup lang="ts">
defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'md'
  },
  bgColor: {
    type: String,
    default: 'primary'
  },
  textColor: {
    type: String,
    default: 'white'
  }
});

const getInitials = (name: string): string => {
  if (!name) return '';

  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};
</script>
