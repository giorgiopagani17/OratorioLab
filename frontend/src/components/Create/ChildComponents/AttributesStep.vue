<template>
  <div class="flex">
    <div class="small-containers">
      <div>
        <span class="text-h6 text-bold text-primary">Nome Evento</span>
        <q-input rounded outlined v-model="name" placeholder="Nome Evento"  @update:model-value="value => name = (value?.toString() || '').trim()" :rules="[val => !!val]" hide-bottom-space/>
      </div>

      <div>
        <span class="text-h6 text-bold text-primary">Descrizione</span>
        <q-input type="textarea" rounded outlined v-model="description" placeholder="Text"  @update:model-value="value => description = (value?.toString() || '').trim()" :rules="[val => !!val]" hide-bottom-space/>
      </div>

      <div>
        <span class="text-h6 text-bold text-primary">Note</span>
        <q-input rounded outlined v-model="note" placeholder="Nome Evento"  @update:model-value="value => note = (value?.toString() || '').trim()" :rules="[val => !!val]" hide-bottom-space/>
      </div>
    </div>

    <div class="small-containers border-primary-left">
      <div>
        <span class="text-h6 text-bold text-primary">Max Partecipanti</span>
        <q-input class="q-mb-xs" rounded outlined maxlength="6" v-model="maxParticipants" placeholder="Nome Evento" @update:model-value="handleMaxParticipants" :rules="[val => parseFloat(val.replace(/\./g, '').replace(',', '.')) > 0]" hide-bottom-space/>
      </div>

      <div>
        <span class="text-h6 text-bold text-primary">Data Inizio</span>
        <q-input type="datetime-local" class="q-mb-xs" rounded outlined v-model="startingDate" :rules="[val => !!val]" hide-bottom-space/>
      </div>

      <div>
        <span class="text-h6 text-bold text-primary">Data Fine</span>
        <q-input type="datetime-local" class="q-mb-xs" rounded outlined v-model="endingDate" :rules="[val => !!val, val => !startingDate || new Date(val) > new Date(startingDate)]" hide-bottom-space/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from 'vue';
import { useEventsActivitiesStore } from '../../../stores/eventsActivities';

const name = ref('');
const description = ref('');
const note = ref('');
const startingDate = ref('');
const endingDate = ref('');
const maxParticipants = ref('');
const store = useEventsActivitiesStore();

const cleanAndFormatInput = (input: string): string => {
  const cleanedValue = input.replace(/[^\d,]/g, '');
  const normalizedValue = cleanedValue.replace(',', '.');
  const numericValue = parseFloat(normalizedValue);

  return isNaN(numericValue) || numericValue === 0
    ? '0'
    : numericValue.toLocaleString('it-IT');
};

const handleMaxParticipants = (value: string | number | null) => {
  const val = typeof value === 'string' ? value : String(value);
  maxParticipants.value = cleanAndFormatInput(val);
};

const validateInputs = () => {
  const hasErrors = !name.value.trim() ||
    !description.value.trim() ||
    !note.value.trim() ||
    !startingDate.value ||
    !endingDate.value ||
    new Date(endingDate.value) <= new Date(startingDate.value) ||
    !maxParticipants.value ||
    parseFloat(maxParticipants.value.replace(/\./g, '').replace(',', '.')) <= 0;

  window.dispatchEvent(new CustomEvent('inputErrors', {
    detail: { hasErrors }
  }));
};

watch([name, description, note, startingDate, endingDate, maxParticipants], () => {
  validateInputs();
});

const saveToLocalStorage = () => {
  store.addEventActivity({
    name: name.value,
    description: description.value,
    note: note.value,
    maxParticipants: parseFloat(maxParticipants.value.replace(/\./g, '').replace(',', '.')),
    startingDate: startingDate.value,
    endingDate: endingDate.value,
  });
};

onMounted(() => {
  window.addEventListener('saveAttributesStep', saveToLocalStorage);
  validateInputs();
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
