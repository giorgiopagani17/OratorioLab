<template>
  <div class="date-time-picker-custom">
    <q-input
      ref="dateTimeInput"
      v-model="displayValue"
      :label="label || undefined"
      :placeholder="placeholder"
      :rules="rules"
      :disable="disable"
      outlined
      rounded
      hide-bottom-space
      class="full-width stable-input"
      @click="openPopup"
    >
      <template v-slot:append>
        <q-icon name="calendar_month" class="cursor-pointer" @click.stop="openPopup" />
      </template>

      <template v-slot:error>
        <slot name="error"></slot>
      </template>
    </q-input>

    <q-dialog v-model="isPopupOpen" position="bottom" maximized persistent>
      <q-card class="date-time-picker-card">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">{{ $t('labels.chooseDate') }}</div>
        </q-card-section>

        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-7">
              <q-date
                v-model="dateModel"
                :mask="dateMask"
                color="secondary"
                :options="dateOptions"
                class="full-width"
              />
            </div>
            <div class="col-12 col-sm-5 flex justify-center items-center">
              <q-time
                v-model="timeModel"
                format24h
                color="secondary"
                class="full-width"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="bg-white text-primary flex justify-between items-center q-px-md q-pt-none">
          <q-btn flat color="grey" :label="$t('buttons.cancel')" v-close-popup />
          <q-btn flat :label="$t('buttons.confirm')" @click="confirmSelection" :disable="!isValid" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
  modelValue: string;
  label?: string;
  placeholder?: string;
  rules?: ((val: string) => boolean | string)[];
  minDate?: string;
  maxDate?: string;
  disable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: '',
  rules: () => [],
  minDate: '',
  maxDate: '',
  disable: false
});

const emit = defineEmits(['update:modelValue']);

const dateTimeInput = ref(null);
const isPopupOpen = ref(false);
const dateModel = ref('');
const timeModel = ref('');
const dateMask = 'YYYY-MM-DD';
const { locale } = useI18n();

const displayValue = computed(() => {
  if (!dateModel.value || !timeModel.value) return '';

  const date = new Date(`${dateModel.value}T${timeModel.value}`);
  if (isNaN(date.getTime())) return '';

  const formatter = new Intl.DateTimeFormat(locale.value, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const parts = formatter.formatToParts(date);

  for (const element of parts) {
    if (element.type === 'month') {
      element.value = element.value.charAt(0).toUpperCase() + element.value.slice(1);
      break;
    }
  }

  return parts.map(p => p.value).join('');
});

const formattedValue = computed(() => {
  if (!dateModel.value || !timeModel.value) return '';
  return `${dateModel.value}T${timeModel.value}`;
});

const isValid = computed(() => {
  return dateModel.value && timeModel.value;
});

const dateOptions = (date: string) => {
  const currentDate = new Date(date);

  if (props.minDate) {
    const minDate = new Date(props.minDate);
    if (currentDate < minDate) return false;
  }

  if (props.maxDate) {
    const maxDate = new Date(props.maxDate);
    if (currentDate > maxDate) return false;
  }

  return true;
};

const openPopup = () => {
  if (props.disable) return;
  isPopupOpen.value = true;
};

const confirmSelection = () => {
  emit('update:modelValue', formattedValue.value);
  isPopupOpen.value = false;
};

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const dateTime = new Date(newValue);
    if (!isNaN(dateTime.getTime())) {
      dateModel.value = dateTime.toISOString().split('T')[0];
      timeModel.value = newValue.split('T')[1] ? newValue.split('T')[1].substring(0, 5) : '00:00';
    }
  } else {
    dateModel.value = '';
    timeModel.value = '';
  }
}, { immediate: true });
</script>

<style lang="scss" scoped>
.date-time-picker-custom {
  width: 100%;

  :deep(.stable-input) {
    height: 56px;

    .q-field__control {
      height: 56px;
    }

    .q-field__marginal {
      height: 56px;
    }
  }

  :deep(.q-field__native::placeholder) {
    color: rgba(0, 0, 0, 0.6);
    opacity: 1;
  }
}

.date-time-picker-card {
  max-width: 700px;
  width: 90%;
  border-radius: 24px !important;
}

:deep(.q-date) {
  box-shadow: none;
  border: 1px solid $grey-4;
  border-radius: 8px;
}

:deep(.q-time) {
  box-shadow: none;
  border: 1px solid $grey-4;
  border-radius: 8px;
}

@media (max-width: 599px) {
  .date-time-picker-card {
    width: 100%;
    max-width: none;
    height: 100%;
    border-radius: 24px !important;
  }
}
</style>
