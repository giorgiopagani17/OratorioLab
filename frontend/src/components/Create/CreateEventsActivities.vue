<template>
  <q-page class="row items-center justify-evenly q-pa-md page-background">
    <div style="width: 90%">
      <div class="q-mt-auto container-border">
        <div class="bg-secondary text-bold text-white container-header">
          <ProgressLine ref="progressLine"/>
        </div>
        <div class="q-pa-md container-body flex items-center justify-center">
          <div v-if="$route.path.includes('events')" class="minimum-size-create-events">
            <div v-if="currentStep === 1" class="minimum-size-create-events">
              <AttributesStep />
            </div>
            <div v-if="currentStep === 2" class="minimum-size-create-events">
              <ImagesStep />
            </div>
          </div>

          <div v-if="$route.path.includes('activities')" class="minimum-size-create-events">
            <div v-if="currentStep === 0" class="minimum-size-create-events">
              <AttributesStep />
            </div>
            <div v-if="currentStep === 1" class="minimum-size-create-events">
              <ImagesStep />
            </div>
            <div v-if="currentStep === 2" class="minimum-size-create-events">
              <TargetPriceStep />
            </div>
          </div>

          <div class="q-mt-sm flex justify-between items-center button-container" style="width: 100%">
            <q-btn color="primary" :disable="currentStep === 0" @click="emitPrevStep">
              <q-icon name="arrow_back" style="margin-right: 0.75rem"/>
              {{ $t('buttons.back') }}
            </q-btn>

            <q-btn
              color="primary"
              :label="$t('buttons.next')"
              icon-right="arrow_forward"
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
import TargetPriceStep from './ChildComponents/TargetPriceStep.vue';

defineOptions({
  name: 'HomePage'
});

interface ProgressLineInstance {
  nextStep: () => void;
  prevStep: () => void;
}

const currentStep = ref(0);
const progressLine = ref<ProgressLineInstance | null>(null);

const emitNextStep = () => {
  if (progressLine.value) {
    window.dispatchEvent(new Event('saveAttributesStep'));
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
