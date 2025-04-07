<template>
  <q-page class="row items-center justify-evenly q-pa-md">
    <div :class="{'q-py-sm w-95': $q.screen.gt.sm, 'q-py-sm w-100': $q.screen.lt.md}">
      <div class="q-mt-auto container-border">
        <div class="bg-secondary text-bold text-white container-header">
          <ProgressLine ref="progressLine"/>
        </div>
        <div class="q-pa-md container-body flex items-center justify-center">
          <div class="minimum-size-create-events">
            <div v-if="currentStep === 0" class="minimum-size-create-events">
              <AttributesStep :isEvent="isEvent" />
            </div>
            <div v-if="currentStep === 1" class="minimum-size-create-events">
              <PlaceStep v-if="isEvent"/>
              <PeriodStep v-else/>
            </div>
            <div v-if="currentStep === 2" class="minimum-size-create-events">
              <ImagesStep/>
            </div>
            <div v-if="currentStep === 3" class="minimum-size-create-events">
              <ReviewStep v-if="isEvent" :section="props.section"/>
              <TargetPriceStep v-else/>
            </div>
            <div v-if="currentStep === 4" class="minimum-size-create-events">
              <ReviewStep v-if="!isEvent" :section="props.section"/>
            </div>
          </div>

          <div class="q-mt-sm flex justify-between items-center button-container" style="width: 100%">
            <q-btn v-if="currentStep === 0" color="grey" @click="exit()">
              <q-icon name="arrow_back" style="margin-right: 0.75rem"/>
              {{ $t('buttons.exit') }}
            </q-btn>

            <q-btn v-else color="primary" @click="emitPrevStep">
              <q-icon name="arrow_back" style="margin-right: 0.75rem"/>
              {{ $t('buttons.back') }}
            </q-btn>

            <q-btn
              v-if="(isEvent && currentStep === 3) || (!isEvent && currentStep === 4)"
              color="secondary"
              :label="$t('buttons.create')"
              :disable="isNextButtonDisabled"
              icon-right="check"
              @click="createEventActivity"
            />

            <q-btn
              v-else
              color="primary"
              :label="$t('buttons.next')"
              :disable="isNextButtonDisabled"
              icon-right="arrow_forward"
              @click="emitNextStep"
            >
              <q-tooltip v-if="isNextButtonDisabled" anchor="top middle" self="bottom middle" :offset="[5, 5]">
                {{ $t('tooltips.fillAllFields') }}
              </q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref} from 'vue';
import ProgressLine from './ChildComponents/ProgressLine.vue';
import PeriodStep from './ChildComponents/PeriodStep.vue';
import ImagesStep from './ChildComponents/ImagesStep.vue';
import AttributesStep from './ChildComponents/AttributesStep.vue';
import PlaceStep from './ChildComponents/PlaceStep.vue';
import TargetPriceStep from './ChildComponents/TargetPriceStep.vue';
import {useRouter} from 'vue-router';
import ReviewStep from '@/pages/EventsActivities/Create/ChildComponents/ReviewStep.vue';
import {useEventsActivitiesStore} from '@/stores/eventsActivities';

const props = defineProps<{
  section: string;
}>();

defineOptions({
  name: 'HomePage'
});

interface ProgressLineInstance {
  nextStep: () => void;
  prevStep: () => void;
}

const isEvent = computed(() => props.section === 'events');
const currentStep = ref(0);
const progressLine = ref<ProgressLineInstance | null>(null);
const hasInputErrors = ref(true);
const router = useRouter();
const store = useEventsActivitiesStore();

const isNextButtonDisabled = computed(() => {
  return hasInputErrors.value;
});

onMounted(() => {
  window.addEventListener('inputErrors', ((event: CustomEvent) => {
    hasInputErrors.value = event.detail.hasErrors;
  }) as EventListener);
});

onUnmounted(() => {
  window.removeEventListener('inputErrors', ((event: CustomEvent) => {
    hasInputErrors.value = event.detail.hasErrors;
  }) as EventListener);
});

const emitNextStep = () => {
  if (progressLine.value) {
    window.dispatchEvent(new Event('saveAttributesStep'));
    progressLine.value.nextStep();
    currentStep.value++;
  }
};

const emitPrevStep = () => {
  if(currentStep.value === 0) {
    const currentPath = router.currentRoute.value.fullPath;
    if (currentPath.includes('/create')) {
      const newPath = currentPath.replace('/create', '');
      router.push(newPath);
    }
  } else if (progressLine.value) {
    progressLine.value.prevStep();
    currentStep.value--;
  }
};

const createEventActivity = () => {
  emitNextStep();

  setTimeout(() => {
    store.clearEventActivities();
    router.push(`/${props.section}/view`);
  }, 300);
};

const exit = () => {
  const currentPath = router.currentRoute.value.fullPath;
  if (currentPath.includes('events')) {
    router.push('/events');
  } else {
    router.push('/activities');
  }
};
</script>

<style lang="scss" scoped>
.button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  width: 100%;
}
</style>
