<template>
  <div class="flex">
    <div class="small-containers">
      <div>
        <span class="text-h6 q-ml-xs text-bold text-primary">Nome Evento</span>
        <q-input rounded outlined v-model="text" placeholder="Nome Evento"/>
      </div>

      <div>
        <span class="text-h6 q-ml-xs text-bold text-primary">Descrizione</span>
        <q-input type="textarea" rounded outlined v-model="text" placeholder="Text"/>
      </div>

      <div>
        <span class="text-h6 q-ml-xs text-bold text-primary">Note</span>
        <q-input rounded outlined v-model="text" placeholder="Nome Evento"/>
      </div>
    </div>

    <div class="small-containers border-primary-left">
      <div>
        <span class="text-h6 q-ml-xs text-bold text-primary">Max Partecipanti</span>
        <q-input type="number" class="q-mb-xs" rounded outlined v-model="number" placeholder="Nome Evento"/>
      </div>

      <div>
        <span class="text-h6 q-ml-xs text-bold text-primary">Data Inizio</span>
        <q-input type="date" class="q-mb-xs" rounded outlined v-model="date"/>
      </div>

      <div>
        <span class="text-h6 q-ml-xs text-bold text-primary">Data Fine</span>
        <q-input type="date" class="q-mb-xs" rounded outlined v-model="date"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const text = ref('');
const date = ref('');
const number = ref(0);
</script>

<style lang="scss">
.small-containers {
  flex-grow: 1;
  display: flex;
  padding: 1rem 2rem 2rem 2rem;
  flex-direction: column;
  justify-content: space-between;
  min-height: 400px;
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
