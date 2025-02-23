<template>
  <div class="flex">
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
              Non puoi creare più di 20 target
            </q-tooltip>
            <q-tooltip v-else anchor="top middle" self="bottom middle" :offset="[5, 5]">
              Aggiungi Target
            </q-tooltip>
          </q-icon>
        </div>
      </div>

      <div class="flex justify-center items-center text-center" style="width: 100%; height: 80px">
        <div style="width: 40%">
          <q-checkbox v-model="isPriceForAll" label="I Prezzi sono uguali per tutti i target" color="secondary" class="q-mt-md"/>
        </div>
        <div style="width: 20%" v-if="isPriceForAll" >
          <q-input
            rounded outlined
            v-model="commonPrice"
            maxlength="7"
            placeholder="Prezzo comune"
            class="q-mt-md"
            @input="handleCommonPriceInput"
            @blur="handleCommonPriceBlur"
          >
            <template v-slot:append>
              <q-icon name="euro" color="primary"/>
            </template>
          </q-input>
        </div>
      </div>

      <div v-if="targets.length === 0" class="q-my-auto">
        <div class="text-center">
          <q-icon name="arrow_upward" size="40px" class="text-grey-5"/>
          <p class="text-h6 text-bold text-grey-5">Inserisci un numero di target da creare qui sopra</p>
        </div>
      </div>

      <div v-else v-for="(target, index) in targets" :key="index">
        <div class="q-mt-md text-center container-border q-px-md q-pt-sm">
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
                Deve esserci almeno 1 target
              </q-tooltip>
              <q-tooltip v-else anchor="top middle" self="bottom middle" :offset="[5, 5]">
                Elimina Target
              </q-tooltip>
            </q-btn>
          </div>
          <div class="flex justify-between items-center q-pt-sm">
            <div class="text-left" style="width: 45%">
              <div>
                <span class="text-bold text-primary" style="font-size: 17px;">Nome</span>
                <q-input rounded outlined v-model="target.name" placeholder="Nome Target"/>
              </div>
              <div class="q-mt-sm">
                <span class="text-bold text-primary" style="font-size: 17px;">Prezzo</span>
                <q-input
                  rounded
                  maxlength="8"
                  outlined
                  :disable="isPriceForAll"
                  v-model="target.displayPrice"
                  placeholder="Prezzo Target"
                  :error="!isPriceForAll && !target.displayPrice"
                  :error-message="t('errors.price')"
                  @input="handleInput($event, target)"
                  @blur="handleBlur($event, target)"
                >
                  <template v-slot:append>
                    <q-icon name="euro" color="primary"/>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="text-left" style="width: 45%">
              <span class="text-bold text-primary" style="font-size: 17px;">Fascia d'eta</span>
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
                  <span class="text-bold text-primary" style="font-size: 17px;">Anno di Inizio</span>
                  <q-input
                    rounded
                    outlined
                    v-model.number="target.startYear"
                    type="number"
                    :rules="[
                      val => (!target.endYear || val <= target.endYear) || 'Non può essere maggiore dell\'anno fine'
                    ]"
                    :max="target.endYear || new Date().getFullYear() + 10"
                    placeholder="Anno Inizio"
                    @update:model-value="validateStartYear"
                  />
                </div>
                <div class="col-6 text-left">
                  <span class="text-bold text-primary" style="font-size: 17px;">Anno di Fine</span>
                  <q-input
                    rounded
                    outlined
                    v-model.number="target.endYear"
                    type="number"
                    :rules="[
                      val => val >= (target.startYear || new Date().getFullYear()) || 'Non può essere minore dell\'anno inizio',
                    ]"
                    :min="target.startYear || new Date().getFullYear()"
                    placeholder="Anno Fine"
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
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

interface Target {
  name: string;
  price: number;
  displayPrice: string;
  startYear: number;
  endYear: number;
  ageGroup: string;
}

const { t } = useI18n();
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

const cleanAndFormatInput = (input: string): string => {
  const cleanedValue = input.replace(/[^\d.,]/g, '');
  const normalizedValue = cleanedValue.replace(/\./g, '').replace(',', '.');
  const parts = normalizedValue.split('.');
  let beforeDecimal = parts[0];

  if (beforeDecimal.length > 4) {
    beforeDecimal = beforeDecimal.slice(-4);
  }

  const newValue = parts[1] ? `${beforeDecimal}.${parts[1]}` : beforeDecimal;
  const numericValue = parseFloat(newValue);

  return isNaN(numericValue)
    ? ''
    : numericValue.toLocaleString('it-IT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
};

const handleInput = (event: Event, target: Target) => {
  const input = event.target as HTMLInputElement;
  target.displayPrice = cleanAndFormatInput(input.value);
};

const handleBlur = (event: Event, target: Target) => {
  const input = event.target as HTMLInputElement;
  target.displayPrice = cleanAndFormatInput(input.value);
};

const handleCommonPriceInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  commonPrice.value = cleanAndFormatInput(input.value);
};

const handleCommonPriceBlur = (event: Event) => {
  const input = event.target as HTMLInputElement;
  commonPrice.value = cleanAndFormatInput(input.value);
};

const validateStartYear = (value: string | number | null) => {
  const val = Number(value);
  const targetItem = targets.value[targets.value.length - 1];

  if (targetItem.endYear && val > targetItem.endYear) {
    targetItem.startYear = targetItem.endYear;
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
      price: isPriceForAll.value ? parseFloat(commonPrice.value.replace(/\./g, '').replace(',', '.')) : 0,
      displayPrice: isPriceForAll.value ? commonPrice.value : '0',
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear(),
      ageGroup: ages.value[2].value
    });
  }
}, { immediate: true });

watch(commonPrice, (newVal) => {
  if (isPriceForAll.value) {
    targets.value.forEach(target => {
      target.price = parseFloat(newVal.replace(/\./g, '').replace(',', '.'));
      target.displayPrice = newVal;
    });
  }
});

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
</script>

<style lang="scss">
.input-target-container {
  flex-grow: 1;
  display: flex;
  padding: 0 2rem 1rem 2rem;
  flex-direction: column;
  min-height: 400px;
}
</style>
