<template>
  <div class="flex full-height">
    <div class="input-target-container">
      <div class="flex justify-center text-center" style="width: 100%">
        <div class="flex items-center justify-center" style="width: 35%">
          <span class="text-h5 text-bold text-primary">N° Target:</span>
          <span class="q-ml-md text-secondary text-bold" style="font-size: 22px; width: 30px">{{ targetNumber }}</span>
          <q-icon
            name="control_point"
            size="30px"
            :class="[ 'text-secondary q-ml-sm', isTarget20 ? 'text-grey-5' : 'cursor-pointer']"
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

      <div class="flex justify-center items-center text-center" style="width: 100%; height: 80px">
        <div style="width: 40%">
          <q-checkbox v-model="isPriceForAll" :label="$t('texts.priceForAll')" color="secondary" class="q-mt-md"/>
        </div>
        <div style="width: 20%" v-if="isPriceForAll" >
          <InputPriceCustom
            :input-props="{
              rounded: true,
              outlined: true,
              hideBottomSpace: true,
            }"
            v-model="commonPrice"
            :error="commonPrice < 0"
            :placeholder="$t('placeholders.commonPrice')"
            class="q-mt-md"
            maxlength="8"
            :iconName="'euro'"
            :iconColor="'primary'"
            :rules="[(val: string | number) => !!val]"
          />
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
            <span class="text-h5 text-bold text-secondary">Target {{ index + 1 }}</span>
            <q-btn
              flat
              round
              dense
              icon="delete"
              class="text-negative"
              @click="removeTarget(index)"
              :disable="targetNumber === 1"
            >
              <q-tooltip v-if="targetNumber === 1" class="bg-negative" anchor="top middle" self="bottom middle" :offset="[5, 5]">
                {{ $t('tooltips.targetRequired') }}
              </q-tooltip>
              <q-tooltip v-else anchor="top middle" self="bottom middle" :offset="[5, 5]">
                {{ $t('tooltips.deleteTarget') }}
              </q-tooltip>
            </q-btn>
          </div>
          <div class="flex justify-between items-center q-pt-sm">
            <div class="text-left" style="width: 45%">
              <div>
                <span class="text-bold text-primary" style="font-size: 17px;">{{ $t('labels.name') }}</span>
                <InputTextCustom
                  :input-props="{
                      rounded: true,
                      outlined: true,
                      hideBottomSpace: true,
                    }"
                  v-model="target.name"
                  :placeholder="`${$t('labels.name')} Target`"
                />
              </div>
              <div class="q-mt-sm">
                <span class="text-bold text-primary" style="font-size: 17px;">{{ $t('labels.price') }}</span>
                <InputPriceCustom
                  :input-props="{
                    rounded: true,
                    outlined: true,
                    hideBottomSpace: true,
                  }"
                  v-model="target.price"
                  :disable="isPriceForAll"
                  :error="!isPriceForAll && target.price < 0"
                  :placeholder="`${$t('labels.price')} Target`"
                  maxlength="8"
                  :iconName="'euro'"
                  :iconColor="'primary'"
                  :rules="[(val: string | number) => !!val]"
                />
              </div>
            </div>
            <div class="text-left" style="width: 45%">
              <span class="text-bold text-primary" style="font-size: 17px;">{{ $t('labels.ageRange') }}</span>
              <q-select
                rounded
                outlined
                :model-value="target.ageGroup"
                @update:model-value="value => target.ageGroup = value"
                :options="ages"
                emit-value
                map-options
                option-label="label"
                option-value="value"
              />
              <div class="row q-col-gutter-sm q-mt-sm">
                <div class="col-6 text-left">
                  <span class="text-bold text-primary" style="font-size: 17px;">{{ $t('labels.startingYear') }}</span>
                  <InputNumberCustom
                    :input-props="{
                      rounded: true,
                      outlined: true,
                      hideBottomSpace: true,
                    }"
                    v-model="target.startYear"
                    :rules="[
                      (val: number | string | null) => (val !== null && val !== undefined && val !== '' && target.endYear !== null && Number(val) <= target.endYear),
                    ]"
                    :max="new Date().getFullYear() - 1 || target.endYear"
                    :placeholder="`${$t('labels.startingYear')} Target`"
                    @update:model-value="validateStartYear"
                  />
                </div>
                <div class="col-6 text-left">
                  <span class="text-bold text-primary" style="font-size: 17px;">{{ $t('labels.endingYear') }}</span>
                  <InputNumberCustom
                    :input-props="{
                      rounded: true,
                      outlined: true,
                      hideBottomSpace: true,
                    }"
                    v-model="target.endYear"
                    :rules="[
                      (val: number | string | null) => (val !== null && val !== undefined && val !== '' && val >= (target.startYear || new Date().getFullYear() || val === 0)),
                    ]"
                    :min="target.startYear || new Date().getFullYear()"
                    :placeholder="`${$t('labels.endingYear')} Target`"
                    @update:model-value="validateEndYear"
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
import InputTextCustom from '@/components/Inputs/InputText.vue';
import InputPriceCustom from '@/components/Inputs/InputPrice.vue';
import InputNumberCustom from '@/components/Inputs/InputNumber.vue';

interface Target {
  name: string;
  price: number;
  startYear: number;
  endYear: number;
  ageGroup: string;
}

const { t } = useI18n();
const store = useEventsActivitiesStore();
const targetNumber = ref(1);
const targets = ref<Target[]>([]);
const commonPrice = ref();
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
    target.price === undefined || target.price === null ||
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

const validateStartYear = (value: string | number | null) => {
  const val = Number(value);
  const targetItem = targets.value[targets.value.length - 1];

  if (targetItem.endYear && val > targetItem.endYear) {
    if (targetItem.endYear > new Date().getFullYear() - 1) {
      targetItem.startYear = new Date().getFullYear() - 1;
    } else {
      targetItem.startYear = targetItem.endYear;
    }
  } else {
    targetItem.startYear = val;
  }
};

const validateEndYear = (value: string | number | null) => {
  const val = Number(value);
  const targetItem = targets.value[targets.value.length - 1];

  if (targetItem.startYear && val < targetItem.startYear) {
    targetItem.endYear = targetItem.startYear;
  } else {
    targetItem.endYear = val;
  }
};

watch(targetNumber, (newVal) => {
  const size = Math.min(Number(newVal) || 0, 20);
  targets.value = targets.value.slice(0, size);
  while (targets.value.length < size) {
    targets.value.push({
      name: '',
      price: isPriceForAll.value ? commonPrice.value : '',
      startYear: new Date().getFullYear() - 1,
      endYear: new Date().getFullYear(),
      ageGroup: ages.value[2].value
    });
  }
}, { immediate: true });

watch(isPriceForAll, (newVal) => {
  if (newVal === true) {
    targets.value.forEach(target => {
      target.price = commonPrice.value;
    });
  }
});

watch(commonPrice, () => {
  targets.value.forEach(target => {
    target.price = commonPrice.value;
  });
});

const parseNumericPrice = (price: string | number): number => {
  if (typeof price === 'string') {
    return parseFloat(price.replace(/\./g, '').replace(',', '.'));
  }
  return price || 0;
};

const saveToLocalStorage = () => {
  const formattedTargets = targets.value.map(target => {
    return {
      name: target.name,
      price: parseNumericPrice(target.price),
      startYear: target.startYear,
      endYear: target.endYear
    };
  });

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
      startYear: savedTarget.startYear || new Date().getFullYear() - 1,
      endYear: savedTarget.endYear || new Date().getFullYear(),
      ageGroup: 'custom'
    }));

    const firstPrice = targets.value[0].price;
    const allSamePrice = targets.value.every(target => target.price === firstPrice);

    if (allSamePrice && firstPrice > 0) {
      isPriceForAll.value = true;
      commonPrice.value = targets.value[0].price;
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
