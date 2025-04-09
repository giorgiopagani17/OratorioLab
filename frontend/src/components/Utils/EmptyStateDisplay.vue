<template>
  <div class="empty-state-container" :style="containerStyle">
    <div class="text-center">
      <q-icon :name="icon" :size="iconSize" :color="iconColor" />
      <div :class="messageClass" class="q-mt-md text-grey-6">{{ message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';

defineOptions({
  name: 'EmptyStateDisplay'
});

interface Props {
  icon?: string;
  iconSize?: string;
  iconColor?: string;
  message: string;
  messageClass?: string;
  height?: string;
  minHeight?: string;
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'search_off',
  iconSize: '5rem',
  iconColor: 'grey-5',
  messageClass: 'text-h5',
  height: '100%',
  minHeight: '100%',
});

const containerStyle = computed(() => ({
  height: props.height,
  minHeight: props.minHeight,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));
</script>

<style scoped>
.empty-state-container {
  width: 100%;
  flex: 1;
}
</style>
