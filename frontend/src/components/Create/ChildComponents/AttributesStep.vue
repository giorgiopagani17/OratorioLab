<template>
  <div class="flex">
    <div class="small-containers">
      <div>
        <span class="text-h6 text-bold text-primary">Nome Evento</span>
        <q-input rounded outlined v-model="name" placeholder="Nome Evento"  @update:model-value="value => name = (value?.toString() || '').trim()"/>
      </div>

      <div>
        <span class="text-h6 text-bold text-primary">Descrizione</span>
        <q-input type="textarea" rounded outlined v-model="description" placeholder="Text"  @update:model-value="value => description = (value?.toString() || '').trim()"/>
      </div>

      <div>
        <span class="text-h6 text-bold text-primary">Note</span>
        <q-input rounded outlined v-model="note" placeholder="Nome Evento"  @update:model-value="value => note = (value?.toString() || '').trim()"/>
      </div>
    </div>

    <div class="small-containers border-primary-left">
      <div>
        <span class="text-h6 text-bold text-primary">Max Partecipanti</span>
        <q-input type="number" class="q-mb-xs" rounded outlined v-model="maxParticipants" placeholder="Nome Evento"/>
      </div>

      <div>
        <span class="text-h6 text-bold text-primary">Data Inizio</span>
        <q-input type="datetime-local" class="q-mb-xs" rounded outlined v-model="startingDate"/>
      </div>

      <div>
        <span class="text-h6 text-bold text-primary">Data Fine</span>
        <q-input type="datetime-local" class="q-mb-xs" rounded outlined v-model="endingDate"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue';
import { useEventsActivitiesStore } from '../../../stores/eventsActivities';

const name = ref('');
const description = ref('');
const note = ref('');
const startingDate = ref('');
const endingDate = ref('');
const maxParticipants = ref(0);
const store = useEventsActivitiesStore();

const saveToLocalStorage = () => {
  store.addEventActivity({
    name: name.value,
    description: description.value,
    note: note.value,
    maxParticipants: maxParticipants.value,
    startingDate: startingDate.value,
    endingDate: endingDate.value,
  });
};

onMounted(() => {
  window.addEventListener('saveAttributesStep', saveToLocalStorage);
});

onUnmounted(() => {
  window.removeEventListener('saveAttributesStep', saveToLocalStorage);
});
</script>

<style lang="scss">
.small-containers {
  flex-grow: 1;
  display: flex;
  padding: 1rem 2rem 2rem 2rem;
  flex-direction: column;
  justify-content: space-between;
  min-height: 400px;
  width: 50% !important;
}

.border-primary-left {
  position: relative;
}

.border-primary-left::before {
  content: '';
  position: absolute;
  left: 0;
  top: 5%;
  height: 90%;
  width: 2px;
  background-color: $border-color;
}

@media (max-width: 637px) {
  .border-primary-left::before {
    display: none;
  }
}
</style>
