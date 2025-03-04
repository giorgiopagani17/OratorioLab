<template>
  <q-dialog :model-value="isDialogOpen">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ props.text }}</div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Close" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  isDialogOpen: boolean,
  text: string
}>();
</script>
