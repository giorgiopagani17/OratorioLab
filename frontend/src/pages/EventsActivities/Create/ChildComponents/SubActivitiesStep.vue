<template>
  <div class="flex full-height">
    <div class="input-target-container">
      <div class="flex justify-center text-center" style="width: 100%">
        <div>
          <p class="text-h5 text-bold text-primary">Vuoi creare delle sotto attività?</p>
          <div class="flex justify-center items-center">
            <span class="q-ml-md text-secondary text-bold" style="font-size: 22px; width: 30px">{{ targetNumber }}</span>
            <q-icon
              name="control_point"
              size="30px"
              :class="[ 'text-secondary', isTarget20 ? 'text-grey-5' : 'cursor-pointer']"
              @click="!isTarget20 && addTarget()"
            >
              <q-tooltip v-if="isTarget20" class="bg-negative" anchor="top middle" self="bottom middle" :offset="[5, 5]">
                {{ $t('tooltips.maxTarget') }}
              </q-tooltip>
              <q-tooltip v-else anchor="top middle" self="bottom middle" :offset="[5, 5]">
                {{ $t('tooltips.addTarget') }}
              </q-tooltip>
            </q-icon>
          </div>
        </div>
      </div>

      <div v-if="targets.length === 0" class="q-my-auto">
        <div class="text-center">
          <q-icon name="arrow_upward" size="40px" class="text-grey-5"/>
          <p class="text-h6 text-bold text-grey-5"> {{ $t('texts.insertTarget') }}</p>
        </div>
      </div>

      <div v-else v-for="(target, index) in targets" :key="index">
        <div class="q-mt-md text-center container-border q-px-md q-pt-sm q-pb-md">
          <div class="flex justify-between items-center">
            <div style="width: 25px"></div>
            <span class="text-h5 text-bold text-secondary">Attività {{ index + 1 }}</span>
            <q-btn
              flat
              round
              dense
              icon="delete"
              class="text-negative"
              @click="removeTarget(index)"
            >
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[5, 5]">
                {{ $t('tooltips.deleteTarget') }}
              </q-tooltip>
            </q-btn>
          </div>
          <div class="flex justify-between items-center q-pt-sm">
            <div class="text-left" style="width: 45%">
              <div class="q-mt-md">
                <span class="text-bold text-primary" style="font-size: 17px;">{{ $t('labels.name') }}</span>
                <q-input
                  rounded
                  outlined
                  v-model="target.name"
                  :placeholder="`${$t('labels.name')} Target`"
                  @blur="() => target.name = (target.name?.toString() || '').trim()"
                  :rules="[val => !!val]"
                  hide-bottom-space
                />
              </div>
            </div>
            <div class="text-left" style="width: 45%">
              <div class="row q-col-gutter-sm q-mt-sm">
                <div class="col-6 text-left">
                  <span class="text-bold text-primary" style="font-size: 17px;">{{ $t('labels.startingYear') }}</span>
                  <q-input
                    rounded
                    outlined
                    v-model.number="target.startYear"
                    type="number"
                    :rules="[
                      val => (val !== null && val !== undefined && val !== '' && target.endYear !== null && val <= target.endYear),
                    ]"
                    hide-bottom-space
                    :max="new Date().getFullYear() - 1 || target.endYear"
                    :placeholder="`${$t('labels.startingYear')} Target`"
                  />
                </div>
                <div class="col-6 text-left">
                  <span class="text-bold text-primary" style="font-size: 17px;">{{ $t('labels.endingYear') }}</span>
                  <q-input
                    rounded
                    outlined
                    v-model.number="target.endYear"
                    type="number"
                    :rules="[
                      val => val >= (target.startYear || new Date().getFullYear() || val === 0),
                    ]"
                    hide-bottom-space
                    :min="target.startYear || new Date().getFullYear()"
                    :placeholder="`${$t('labels.endingYear')} Target`"
                  />
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
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import { useI18n } from 'vue-i18n';
import { useEventsActivitiesStore } from '@/stores/eventsActivities';

interface Target {
  name: string;
  price: number;
  displayPrice: string;
  startYear: number;
  endYear: number;
  ageGroup: string;
}

const { t } = useI18n();
const store = useEventsActivitiesStore();
const targetNumber = ref(1);
const targets = ref<Target[]>([]);
const commonPrice = ref('0,00');
const isPriceForAll = ref(false);
const isTarget20 = ref(false);
const ages = computed(() => [
  { label: t('ages.adult'), value: 'adult' },
  { label: t('ages.minor'), value: 'minor' },
  { label: t('ages.custom'), value: 'custom' }
]);

const validateInputs = () => {
  const hasEmptyTargets = targets.value.some(target =>
    !target.name.trim() ||
    !target.displayPrice ||
    target.displayPrice === '' ||
    !target.startYear ||
    !target.endYear ||
    !target.ageGroup
  );

  window.dispatchEvent(new CustomEvent('inputErrors', {
    detail: { hasErrors: hasEmptyTargets }
  }));
};

watch([targets, isPriceForAll], () => {
  validateInputs();
}, { deep: true });

const addTarget = () => {
  if (targetNumber.value < 20) {
    targetNumber.value++;
  }
  if (targetNumber.value === 20) {
    isTarget20.value = true;
  }
};

const removeTarget = (index: number) => {
  if (targetNumber.value === 1) {
    return;
  }
  targets.value.splice(index, 1);
  targetNumber.value--;
  if (targetNumber.value === 19) {
    isTarget20.value = false;
  }
};

watch(targetNumber, (newVal) => {
  const size = Math.min(Number(newVal) || 0, 20);
  targets.value = targets.value.slice(0, size);
  while (targets.value.length < size) {
    targets.value.push({
      name: '',
      price: isPriceForAll.value ? parseFloat(commonPrice.value.replace(/\./g, '').replace(',', '.')) : 0,
      displayPrice: isPriceForAll.value ? commonPrice.value : '0,00',
      startYear: new Date().getFullYear() - 1,
      endYear: new Date().getFullYear(),
      ageGroup: ages.value[2].value
    });
  }
}, { immediate: true });

watch(isPriceForAll, (newVal) => {
  if (newVal === true) {
    targets.value.forEach(target => {
      target.price = parseFloat(commonPrice.value.replace(/\./g, '').replace(',', '.'));
      target.displayPrice = commonPrice.value;
    });
  } else {
    targets.value.forEach(target => {
      target.price = 0;
      target.displayPrice = '';
    });
    commonPrice.value = '0,00';
  }
});

const saveToLocalStorage = () => {
  const formattedTargets = targets.value.map(target => ({
    name: target.name,
    price: target.price,
    startYear: target.startYear,
    endYear: target.endYear
  }));

  const currentIndex = parseInt(store.eventsActivitiesIndex);
  store.addTargets(currentIndex, formattedTargets);
};

onMounted(() => {
  window.addEventListener('saveAttributesStep', saveToLocalStorage);
  validateInputs();

  const currentIndex = parseInt(store.eventsActivitiesIndex);
  const savedEventActivity = store.eventsActivities[currentIndex];

  if (savedEventActivity?.targets && savedEventActivity.targets.length > 0) {
    targetNumber.value = savedEventActivity.targets.length;

    targets.value = savedEventActivity.targets.map((savedTarget: Target) => ({
      name: savedTarget.name || '',
      price: savedTarget.price || 0,
      displayPrice: savedTarget.price ? savedTarget.price.toLocaleString('it-IT', {
        minimumFractionDigits: String(savedTarget.price).includes('.') ?
          String(savedTarget.price).split('.')[1].length : 0,
        maximumFractionDigits: String(savedTarget.price).includes('.') ?
          String(savedTarget.price).split('.')[1].length : 0
      }).replace('.', ',') : '0,00',
      startYear: savedTarget.startYear || new Date().getFullYear() - 1,
      endYear: savedTarget.endYear || new Date().getFullYear(),
      ageGroup: 'custom'
    }));

    const firstPrice = targets.value[0].price;
    const allSamePrice = targets.value.every(target => target.price === firstPrice);

    if (allSamePrice && firstPrice > 0) {
      isPriceForAll.value = true;
      commonPrice.value = targets.value[0].displayPrice;
    }
  }
});

onUnmounted(() => {
  window.removeEventListener('saveAttributesStep', saveToLocalStorage);
});
</script>

<style lang="scss" scoped>
.input-target-container {
  flex-grow: 1;
  display: flex;
  padding: 0 2rem 1rem 2rem;
  flex-direction: column;
  min-height: 400px;
}
</style>
