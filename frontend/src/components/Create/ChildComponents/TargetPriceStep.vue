<template>
  <div class="flex">
    <div class="input-target-container">
      <div class="flex justify-center text-center" style="width: 100%">
        <div style="width: 35%">
          <span class="text-h6 text-bold text-primary">N° Target</span>
          {{ targetNumber }}
          <q-btn @click="targetNumber++" icon="add" color="primary"/>
        </div>
      </div>

      <div v-if="textFields.length === 0" class="q-my-auto">
        <div class="text-center">
          <q-icon name="arrow_upward" size="40px" class="text-grey-5"/>
          <p class="text-h6 text-bold text-grey-5">Inserisci un numero di target da creare qui sopra</p>
        </div>
      </div>
      <div v-else v-for="(text, index) in textFields" :key="index">
        <div class="q-mt-md text-center">
          <span class="text-h6 text-bold text-secondary">Target {{ index + 1 }}</span>
          <div class="flex justify-between items-center q-pt-sm">
            <q-input rounded outlined v-model="texts[index]" placeholder="Nome Target" style="width: 30%"/>
            <q-input rounded outlined v-model="texts[index]" placeholder="Prezzo Target" style="width: 30%"/>
            <q-input rounded outlined v-model="texts[index]" placeholder="Range Date" style="width: 30%"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const targetNumber = ref(2);
const texts = ref<string[]>([]);

const textFields = computed(() => {
  const size = Math.min(Number(targetNumber.value) || 0, 10);
  return Array.from({ length: size });
});

watch(targetNumber, (newVal) => {
  const size = Math.min(Number(newVal) || 0, 10);
  texts.value = texts.value.slice(0, size);
  while (texts.value.length < size) {
    texts.value.push('');
  }
});
</script>

<style lang="scss">
.input-target-container {
  flex-grow: 1;
  display: flex;
  padding: 1rem 2rem 2rem 2rem;
  flex-direction: column;
  min-height: 400px;
}
</style>
