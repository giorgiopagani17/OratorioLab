<template>
  <div class="flex full-height">
    <div class="input-activityReview-container">
      <!-- Base activity period selection -->
      <div class="q-my-md">
        <div class="row items-center">
          <div class="col-12 col-sm-8">
            <p class="text-h5 text-bold text-primary q-mb-none">{{ $t('labels.activityPeriod') }}</p>
          </div>
          <div class="col-12 col-sm-4 flex justify-end">
            <q-toggle v-model="hasBaseActivity" color="primary" :label="$t('labels.enableBaseActivity')">
              <q-tooltip v-if="activitiesReviewNumber === 1" anchor="top left" self="bottom middle" :offset="[5, 5]">
                {{ $t('tooltips.baseActivityMode') }}
              </q-tooltip>
            </q-toggle>
          </div>
        </div>
        <div v-if="hasBaseActivity" class="row q-col-gutter-md q-pt-sm">
          <div class="col-12 col-sm-6">
            <span class="text-bold text-primary" style="font-size: 17px;">{{ $t('labels.startDate') }}</span>
            <q-input
              type="datetime-local"
              rounded
              outlined
              v-model="baseStartDate"
              :rules="[val => !!val]"
              hide-bottom-space
            />
          </div>
          <div class="col-12 col-sm-6">
            <span class="text-bold text-primary" style="font-size: 17px;">{{ $t('labels.endDate') }}</span>
            <q-input
              type="datetime-local"
              rounded
              outlined
              v-model="baseEndDate"
              :rules="[val => !!val, val => !baseStartDate || new Date(val) > new Date(baseStartDate)]"
              hide-bottom-space
            />
          </div>
        </div>
      </div>

      <q-separator class="q-my-lg" />

      <div>
        <div class="row items-center">
          <div class="col-12 col-sm-8">
            <p class="text-h5 text-bold text-primary q-mb-none">{{ $t('labels.activityReview') }}</p>
          </div>
          <div class="col-12 col-sm-4 flex justify-end">
            <q-toggle v-model="hasSubActivities" color="primary" :label="$t('labels.enableActivityReview')">
              <q-tooltip v-if="activitiesReviewNumber === 1" anchor="top left" self="bottom middle" :offset="[5, 5]">
                {{ $t('tooltips.activitiesReviewMode') }}
              </q-tooltip>
            </q-toggle>
          </div>
        </div>
      </div>

      <div v-if="hasSubActivities" class="q-mt-md q-pb-sm">
        <div class="flex justify-center text-center" style="width: 100%">
          <div class="text-h6 text-bold text-primary q-mr-md">{{ $t('labels.numberOfActivities') }}</div>
          <div class="flex justify-center items-center">
            <q-icon
              name="remove_circle_outline"
              size="30px"
              :class="['text-secondary', activitiesReviewNumber === 1 ? 'text-grey-5' : 'cursor-pointer']"
              @click="activitiesReviewNumber > 1 && removeActivityReview()"
            >
              <q-tooltip v-if="activitiesReviewNumber === 1" anchor="top middle" self="bottom middle" :offset="[5, 5]">
                {{ $t('tooltips.activityRequired') }}
              </q-tooltip>
              <q-tooltip v-else anchor="top middle" self="bottom middle" :offset="[5, 5]">
                {{ $t('tooltips.deleteActivity') }}
              </q-tooltip>
            </q-icon>
            <span class="q-mx-md text-secondary text-bold" style="font-size: 22px; width: 30px">{{ activitiesReviewNumber }}</span>
            <q-icon
              name="control_point"
              size="30px"
              :class="['text-secondary', isActivityReview10 ? 'text-grey-5' : 'cursor-pointer']"
              @click="!isActivityReview10 && addActivityReview()"
            >
              <q-tooltip v-if="isActivityReview10" class="bg-negative" anchor="top middle" self="bottom middle" :offset="[5, 5]">
                {{ $t('tooltips.maxActivity') }}
              </q-tooltip>
              <q-tooltip v-else anchor="top middle" self="bottom middle" :offset="[5, 5]">
                {{ $t('tooltips.addActivity') }}
              </q-tooltip>
            </q-icon>
          </div>
        </div>

        <div v-for="(activityReview, index) in activitiesReview" :key="index">
          <div class="q-mt-md text-center container-border q-px-md q-pt-sm q-pb-md">
            <div class="flex justify-between items-center">
              <div style="width: 25px"></div>
              <span class="text-h6 text-bold text-secondary">{{ $t('types.activity') }} {{ index + 1 }}</span>
              <q-btn
                flat
                round
                dense
                icon="delete"
                class="text-negative"
                @click="removeActivityReviewAt(index)"
                :disabled="activitiesReview.length <= 1"
              >
                <q-tooltip v-if="activitiesReviewNumber === 1" anchor="top middle" self="bottom middle" :offset="[5, 5]">
                  {{ $t('tooltips.activityRequired') }}
                </q-tooltip>
                <q-tooltip v-else anchor="top middle" self="bottom middle" :offset="[5, 5]">
                  {{ $t('tooltips.deleteActivity') }}
                </q-tooltip>
              </q-btn>
            </div>
            <div class="row justify-between" :class="{ 'q-col-gutter-md': $q.screen.gt.xs }">
              <div class="col-12 col-sm-6 text-left">
                <div class="q-mt-md">
                  <span class="text-bold text-primary" style="font-size: 17px;">{{ $t('labels.name') }}</span>
                  <q-input
                    rounded
                    outlined
                    v-model="activityReview.name"
                    :placeholder="$t('placeholders.activityName')"
                    @blur="() => activityReview.name = (activityReview.name?.toString() || '').trim()"
                    :rules="[val => !!val]"
                    hide-bottom-space
                  />
                </div>
              </div>
              <div class="col-12 col-sm-6 text-left">
                <div class="row q-col-gutter-sm q-mt-sm">
                  <div class="col-6 text-left">
                    <span class="text-bold text-primary" style="font-size: 17px;">{{ $t('labels.startDate') }}</span>
                    <q-input
                      type="datetime-local"
                      class="q-mb-xs"
                      rounded
                      outlined
                      v-model="activityReview.startDate"
                      :rules="[val => !!val]"
                      hide-bottom-space
                    />
                  </div>
                  <div class="col-6 text-left">
                    <span class="text-bold text-primary" style="font-size: 17px;">{{ $t('labels.endDate') }}</span>
                    <q-input
                      type="datetime-local"
                      class="q-mb-xs"
                      rounded
                      outlined
                      v-model="activityReview.endDate"
                      :rules="[
                        val => !!val,
                        val => !activityReview.startDate || new Date(val) > new Date(activityReview.startDate),
                      ]"
                      hide-bottom-space
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useEventsActivitiesStore } from '@/stores/eventsActivities';

interface ActivityReview {
  name: string;
  startDate: string;
  endDate: string;
}

const store = useEventsActivitiesStore();
const activitiesReviewNumber = ref(1);
const activitiesReview = ref<ActivityReview[]>([]);
const hasBaseActivity = ref(true);
const hasSubActivities = ref(false);
const isActivityReview10 = ref(false);
const baseStartDate = ref('');
const baseEndDate = ref('');

const addActivityReview = () => {
  if (activitiesReviewNumber.value < 10) {
    activitiesReviewNumber.value++;
  }
  if (activitiesReviewNumber.value === 10) {
    isActivityReview10.value = true;
  }
};

const removeActivityReview = () => {
  if (activitiesReviewNumber.value > 1) {
    activitiesReviewNumber.value--;
    isActivityReview10.value = false;
  }
};

const removeActivityReviewAt = (index: number) => {
  activitiesReview.value.splice(index, 1);
  activitiesReviewNumber.value--;
  isActivityReview10.value = false;
};

const validateInputs = () => {
  let hasBaseError = false;
  let hasSubActivitiesErrors = false;

  if(hasBaseActivity.value) {
    hasBaseError = !baseStartDate.value || !baseEndDate.value;
  } else {
    hasSubActivitiesErrors = hasSubActivities.value && activitiesReview.value.some(activityReview =>
      !activityReview.name.trim() ||
      !activityReview.startDate ||
      !activityReview.endDate
    );
  }

  console.log(hasBaseError, hasSubActivitiesErrors)
  window.dispatchEvent(new CustomEvent('inputErrors', {
    detail: { hasErrors: hasBaseError || hasSubActivitiesErrors }
  }));
};

const saveToLocalStorage = () => {
  const currentIndex = parseInt(store.eventsActivitiesIndex);
  if(hasBaseActivity.value) {
    const formattedData = {
      startDate: baseStartDate.value,
      endDate: baseEndDate.value,
    };

    store.addPeriod(currentIndex, formattedData);
    store.clearActivityReview(currentIndex);
  } else {
    store.addActivityReview(currentIndex, activitiesReview.value);
  }
};

watch([baseStartDate, baseEndDate, activitiesReview, hasSubActivities], () => {
  validateInputs();
}, { deep: true });

watch(hasBaseActivity, (newVal) => {
  if (newVal && hasSubActivities.value) {
    hasSubActivities.value = false;
  } else if (!newVal) {
    hasSubActivities.value = true;
  }
});

watch(hasSubActivities, (newVal) => {
  if (newVal && hasBaseActivity.value) {
    hasBaseActivity.value = false;
  } else if (!newVal) {
    hasBaseActivity.value = true;
  }
});

watch(activitiesReviewNumber, (newVal) => {
  const size = Math.min(Number(newVal) || 0, 20);
  activitiesReview.value = activitiesReview.value.slice(0, size);
  while (activitiesReview.value.length < size) {
    activitiesReview.value.push({
      name: '',
      startDate: '',
      endDate: '',
    });
  }
}, { immediate: true });

onMounted(() => {
  window.addEventListener('saveAttributesStep', saveToLocalStorage);
  validateInputs();

  const currentIndex = parseInt(store.eventsActivitiesIndex);
  const savedEventActivity = store.eventsActivities[currentIndex];

  // Load saved data if available
  if (savedEventActivity) {
    if (savedEventActivity.startDate) {
      baseStartDate.value = savedEventActivity.startDate;
    }

    if (savedEventActivity.endDate) {
      baseEndDate.value = savedEventActivity.endDate;
    }

    if (savedEventActivity.isReview) {
      hasSubActivities.value = savedEventActivity.isReview;
      hasBaseActivity.value = false;
    }

    console.log(savedEventActivity)
    if (savedEventActivity.activitiesReview && savedEventActivity.activitiesReview.length > 0) {
      console.log(savedEventActivity.activitiesReview.length)
      activitiesReviewNumber.value = savedEventActivity.activitiesReview.length;

      activitiesReview.value = savedEventActivity.activitiesReview.map((savedActivityReview: ActivityReview) => ({
        name: savedActivityReview.name || '',
        startDate: savedActivityReview.startDate || '',
        endDate: savedActivityReview.endDate || '',
      }));
    }
  }
});

onUnmounted(() => {
  window.removeEventListener('saveAttributesStep', saveToLocalStorage);
});
</script>

<style lang="scss" scoped>
.input-activityReview-container {
  flex-grow: 1;
  display: flex;
  padding-bottom: 1rem;
  flex-direction: column;
  min-height: 400px;

  @media (min-width: 600px) {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}


.container-border {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style>
