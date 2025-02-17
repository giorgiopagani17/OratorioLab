<template>
  <q-page class="row items-center justify-evenly q-pa-md page-background">
    <div style="width: 90%">
      <div class="q-mt-auto container-border">
        <div class="bg-secondary text-bold text-white container-header">
          <ProgressLine ref="progressLine"/>
        </div>
        <div class="q-pa-md container-body flex items-center justify-center">
          <div v-if="currentStep === 0" style="width: 100%; min-height: 400px">
            <AttributesStep />
          </div>
          <div v-if="currentStep === 1" style="width: 100%; min-height: 400px">
            <ImagesStep />
          </div>

          <div class="q-mt-sm flex justify-between items-center button-container" style="width: 100%">
            <q-btn
              color="primary"
              label="Indietro"
              :disable="currentStep === 0"
              @click="emitPrevStep"
            />
            <q-btn
              color="primary"
              label="Avanti"
              @click="emitNextStep"
            />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ProgressLine from './ChildComponents/ProgressLine.vue';
import ImagesStep from './ChildComponents/ImagesStep.vue';
import AttributesStep from './ChildComponents/AttributesStep.vue';

defineOptions({
  name: 'HomePage'
});

const currentStep = ref(0);

interface ProgressLineInstance {
  nextStep: () => void;
  prevStep: () => void;
}

const progressLine = ref<ProgressLineInstance | null>(null);

const emitNextStep = () => {
  if (progressLine.value) {
    progressLine.value.nextStep();
    currentStep.value++;
  }
};

const emitPrevStep = () => {
  if (progressLine.value) {
    progressLine.value.prevStep();
    currentStep.value--;
  }
};
</script>

<style lang="scss">
.button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  width: 100%;
}
</style>
