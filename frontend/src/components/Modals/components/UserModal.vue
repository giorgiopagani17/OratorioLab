<template>
  <ModalCustom
    v-model="isOpen"
    :persistent="true"
    :show-header="true"
    :title="$t('titles.info')"
    titleColor="primary"
    :fullHeight="true"
    :fullWidth="true"
  >
    <div class="info-modal-content">
      <div class="info-modal-main q-mt-sm q-mb-lg row justify-center q-px-md q-pt-md">
        <div class="col-12 col-md-3">
          <div class="row">
            <div class="col-12 col-sm-6 col-md-12" :class="{ 'flex flex-col items-center justify-center': $q.screen.lt.md }">
              <div class="bg-grey-3 flex items-center justify-center" style="width: 125px; height: 125px; border-radius: 50%">
                <q-icon name="person" color="white" size="80px" />
              </div>
              <div class="q-mt-sm text-bold text-truncate text-h6 text-secondary" style="max-width: 100%;" :class="{ 'text-center q-px-md': $q.screen.lt.md }">
                {{ localRowData?.name || 'example@gmail.com' }}
              </div>
              <div class="text-grey-7 q-mt-xs full-width text-truncate" :class="{ 'text-center': $q.screen.lt.md }">{{ localRowData?.email || 'example@gmail.com' }}</div>
            </div>

            <div class="col-12 col-sm-6 col-md-12 flex flex-col items-center" :class="{ 'q-mt-lg': $q.screen.gt.sm, 'q-mt-md': $q.screen.lt.sm }">
              <div
                v-for="option in options"
                :key="option.id"
                :class="[
                  'text-h6',
                  'q-mt-sm',
                  'full-width',
                  { 'text-center': $q.screen.lt.sm },
                  { 'cursor-pointer': !isRegistration },
                  { 'text-primary text-bold': option.active, 'text-grey-7': !option.active }
                ]"
                @click="() => { if (!isRegistration) setActive(option); }"
              >
                {{ $t(`userOptions.${option.title}`) }}
              </div>
            </div>
          </div>
        </div>


        <div class="col-12 col-md-6 q-mb-lg" :class="{ 'q-mt-lg': $q.screen.lt.md, 'q-ml-md': $q.screen.gt.sm }">
          <div class="text-h5 text-bold text-primary text-truncate">{{ $t(`userOptions.${activeOption.title}`) }}</div>
          <div class="text-grey-7 q-mt-md">{{ $t(`userOptionsDescriptions.${activeOption.title}Description`) }}</div>

          <div v-if="isRegistration" class="q-mt-lg">
            <div
              :class="[activeOption.id === 1 ? 'row q-col-gutter-md q-pb-md q-mb-md' : '']"
              style="max-height: 265px"
              :style="{
                'overflow-y': $q.screen.lt.md ? 'auto' : 'hidden',
                'padding-right': $q.screen.lt.md ? '4px' : '0'
              }"
            >
              <div
                v-for="(item, index) in filteredData"
                :key="item.title"
                :class="[
                  activeOption.id === 1
                    ? 'col-12 col-md-6'
                    : (index !== filteredData.length - 1 ? 'q-mb-md' : '')
                ]"
              >
                <div>
                  <div class="text-subtitle1 text-bold text-secondary flex justify-between">
                    {{ $t(`labels.${item.title}`) }}
                    <q-icon :name="item.icon" color="secondary" size="sm"/>
                  </div>
                  <q-input
                    :type="getInputType(item.type)"
                    v-model="formData[item.title]"
                    outlined
                    dense
                    class="q-mt-xs"
                  />
                </div>
              </div>
            </div>

            <div class="row justify-between q-mt-md q-mb-xs">
              <q-btn
                icon="arrow_back"
                color="grey"
                :label="$t('buttons.back')"
                @click="moveToPreviousOption"
                :disable="activeOption.id === 1"
                :class="{'invisible': activeOption.id === 1}"
              />

              <q-btn
                :icon-right="activeOption.id === options.length ? 'check' : 'arrow_forward'"
                :color="activeOption.id === options.length ? 'secondary' : 'primary'"
                :label="activeOption.id === options.length ? $t('buttons.create') : $t('buttons.next')"
                @click="moveToNextOption"
                :disable="isNextButtonDisabled"
              >
                <q-tooltip v-if="isNextButtonDisabled" anchor="top middle" self="bottom middle" :offset="[5, 5]">
                  {{ $t('tooltips.fillAllFields') }}
                </q-tooltip>
              </q-btn>
            </div>
          </div>

          <div v-else class="q-mt-lg">
            <div v-if="selectedField" class="q-mb-md" style="padding: 2px">
              <q-card class="field-container">
                <q-card-section>
                  <div class="text-subtitle1 text-bold q-mb-xs text-secondary flex justify-between">
                    {{ $t(`labels.${selectedField.title}`) }}
                    <q-icon :name="selectedField.icon" color="secondary" size="sm" class="q-ml-xs" />
                  </div>
                  <q-input
                    :type="inputType"
                    v-model="editValue"
                    @keyup.enter="saveEdit"
                    style="font-size: 17.5px"
                  />
                  <div class="flex justify-between q-mt-md">
                    <q-btn color="grey" label="Exit" @click="cancelEdit" />
                    <q-btn color="primary" label="Save" @click="saveEdit" />
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div v-else :class="[activeOption.id === 1 ? 'row q-col-gutter-md q-pb-sm' : '']" style="overflow-y: auto; max-height: 350px; padding: 2px 2px 4px 2px">
              <div
                v-for="item in filteredData"
                :key="item.title"
                :class="[
                activeOption.id === 1 ? 'col-12 col-md-6' : 'q-mb-md'
              ]"
              >
                <q-card class="field-container cursor-pointer" @click="selectField(item)">
                  <q-card-section>
                    <div class="text-subtitle1 text-bold q-mb-xs text-secondary flex justify-between">
                      {{ $t(`labels.${item.title}`) }}
                      <q-icon :name="item.icon" color="secondary" size="sm"/>
                    </div>
                    <div class="field-value text-break text-truncate">{{ convertToDisplayValue(localRowData?.[item.title]) }}</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </div>
        <div class="privacy-notice full-width">
          <q-icon name="security" color="secondary" size="md" />
          <div class="text-subtitle1 text-bold q-mt-xs">
            {{ $t('messages.sensitiveDataProcessing') }}
          </div>
          <p class="text-grey-7 q-mt-sm" style="width: 95%; max-width: 950px; margin: 0 auto;">
            {{ $t('messages.sensitiveDataProcessingDescription') }}
          </p>
        </div>
      </div>
    </div>
  </ModalCustom>
</template>

<script setup lang="ts">
import {computed, ref, reactive, watch} from 'vue';
import ModalCustom from '@/components/Modals/ModalCustom.vue';

interface OptionItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  active: boolean;
}

interface DataItem {
  title: string;
  type: string;
  optionId: number;
  icon: string;
}

const props = defineProps<{
  modelValue: boolean;
  rowData?: Record<string, unknown> | null;
  isRegistration?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'save': [data: Record<string, unknown>];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const localRowData = ref<Record<string, unknown> | null>(null);
const selectedField = ref<DataItem | null>(null);
const editValue = ref<string>('');
const formData = reactive<Record<string, string | number | null>>({});
const options = ref<OptionItem[]>([
  {
    id: 1,
    title: 'personalInfo',
    description: 'This section contains all the personal user information, including email, username, and other relevant details. It is essential for identifying and contacting the user.',
    icon: 'person',
    active: true
  },
  {
    id: 2,
    title: 'domicile',
    description: 'Here you can find the user\'s domicile information, including their current address and any previous addresses. This is important for verifying the user\'s residence and for any necessary correspondence.',
    icon: 'home',
    active: false
  },
  {
    id: 3,
    title: 'emergencyContact',
    description: 'In this section, you can find the emergency contact information. This includes the names and phone numbers of people to contact in case of an emergency, ensuring quick and effective communication.',
    icon: 'contact_phone',
    active: false
  },
  {
    id: 4,
    title: 'illnesses',
    description: 'This section provides detailed information about any illnesses the user may have. It includes medical history, current conditions, and any relevant treatments or medications, ensuring proper care and attention.',
    icon: 'medical_services',
    active: false
  },
]);

const data = ref<DataItem[]>([
  { title: 'name', type:'text', optionId: 1, icon: 'person' },
  { title: 'email', type:'text', optionId: 1, icon: 'email' },
  { title: 'cf', type:'text', optionId: 1, icon: 'badge' },
  { title: 'birthday', type:'date', optionId: 1, icon: 'cake' },
  { title: 'gender', type:'text', optionId: 1, icon: 'wc' },
  { title: 'telephone', type: 'tel', optionId: 1, icon: 'phone' },
  { title: 'address', type:'text', optionId: 2, icon: 'home' },
  { title: 'country', type:'text', optionId: 2, icon: 'flag' },
  { title: 'nationality', type:'text', optionId: 2, icon: 'public' },
  { title: 'mother', type:'text', optionId: 3, icon: 'woman' },
  { title: 'father', type:'text', optionId: 3, icon: 'man' },
  { title: 'tutor', type:'text', optionId: 3, icon: 'support_agent' },
  { title: 'illness', type:'text', optionId: 4, icon: 'medical_services' },
  { title: 'allergies', type:'text', optionId: 4, icon: 'health_and_safety' },
]);

type InputType = 'number' | 'search' | 'textarea' | 'time' | 'email' | 'tel' | 'text' | 'date' | 'password' | 'file' | 'url' | 'datetime-local';

const getInputType = (type: string): InputType => {
  const allowedTypes: InputType[] = [
    'number', 'text', 'email', 'date', 'textarea', 'time', 'password', 'search', 'tel', 'file', 'url', 'datetime-local'
  ];
  return allowedTypes.includes(type as InputType) ? type as InputType : 'text';
};

const inputType = computed<InputType>(() => getInputType(selectedField.value?.type || 'text'));


watch(() => props.rowData, (newData) => {
  localRowData.value = newData ? { ...newData } : null;

  if (newData) {
    Object.entries(newData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
      } else {
        formData[key] = '';
      }
    });
  }
}, { immediate: true });

const isNextButtonDisabled = computed(() => {
  if (!props.isRegistration) return false;

  const currentOptionFields = filteredData.value.map(item => item.title);

  return currentOptionFields.some(fieldName => {
    const value = formData[fieldName];
    return value === undefined || value === null || value === '';
  });
});

const activeOption = computed<OptionItem>(() => {
  return options.value.find(option => option.active) ||
    { id: 0, title: '', description: '', icon: '', active: false };
});

const filteredData = computed<DataItem[]>(() => {
  return data.value.filter(item => item.optionId === activeOption.value.id);
});

const setActive = (selectedOption: OptionItem): void => {
  options.value.forEach(option => {
    option.active = option === selectedOption;
  });
  selectedField.value = null;
};

const moveToPreviousOption = () => {
  const currentIndex = options.value.findIndex(option => option.active);

  if (currentIndex > 0) {
    options.value.forEach(option => {
      option.active = false;
    });
    options.value[currentIndex - 1].active = true;
  } else {
    saveEdit();
  }
};

const moveToNextOption = () => {
  const currentIndex = options.value.findIndex(option => option.active);
  if (currentIndex < options.value.length - 1) {
    options.value.forEach(option => {
      option.active = false;
    });
    options.value[currentIndex + 1].active = true;
  } else {
    saveEdit();
  }
};

const selectField = (item: DataItem): void => {
  selectedField.value = item;
  const currentValue = localRowData.value?.[item.title];

  if (item.type === 'date' && currentValue) {
    try {
      const parts = String(currentValue).split('/');
      let dateObj;

      if (parts.length === 3) {
        const [day, month, year] = parts;
        dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        dateObj = new Date(currentValue as string);
      }

      if (!isNaN(dateObj.getTime())) {
        // Format as YYYY-MM-DD for the date input
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        editValue.value = `${year}-${month}-${day}`;
        return;
      }
    } catch (e) {
      console.warn(e);
    }
  }

  editValue.value = currentValue !== null && currentValue !== undefined ? String(currentValue) : '';
};

const convertToDisplayValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '-';
  }

  if (typeof value === 'boolean') {
    return value ? '✓ Yes' : '✗ No';
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  const dateField = data.value.find(item =>
    item.title === selectedField.value?.title ||
    (item.type === 'date' && localRowData.value &&
      item.title in localRowData.value &&
      localRowData.value[item.title] === value));

  if (dateField?.type === 'date' && value) {
    try {
      let dateObj;
      const strValue = String(value);

      if (strValue.includes('/')) {
        return strValue;
      } else {
        dateObj = new Date(strValue);
        if (!isNaN(dateObj.getTime())) {
          const day = String(dateObj.getDate()).padStart(2, '0');
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const year = dateObj.getFullYear();
          return `${day}/${month}/${year}`;
        }
      }
    } catch (e) {
      console.warn(e);
    }
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
};

const cancelEdit = (): void => {
  selectedField.value = null;
  editValue.value = '';
};

const saveEdit = (): void => {
  if (selectedField.value) {
    let valueToSave: string | number | boolean | null = editValue.value;

    if (selectedField.value.type === 'date' && editValue.value) {
      try {
        const dateObj = new Date(editValue.value);
        if (!isNaN(dateObj.getTime())) {
          const day = String(dateObj.getDate()).padStart(2, '0');
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const year = dateObj.getFullYear();
          valueToSave = `${day}/${month}/${year}`;
        }
      } catch (e) {
        valueToSave = editValue.value;
      }
    }

    formData[selectedField.value.title] = valueToSave;

    if (localRowData.value && !props.isRegistration) {
      localRowData.value = {
        ...localRowData.value,
        [selectedField.value.title]: valueToSave
      };
    }

    emit('save', { ...formData });
    selectedField.value = null;
  }
};

watch(() => isOpen.value, (newValue) => {
  if (newValue) {
    options.value.forEach((option, index) => {
      option.active = index === 0;
    });
    selectedField.value = null;
    editValue.value = '';
  }
}, { immediate: true });
</script>

<style scoped>
.field-container {
  border-radius: 12px;
  background-color: white;
  width: 100%;
}
.info-modal-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.info-modal-main {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.privacy-notice {
  margin-top: auto;
  text-align: center;
  background-color: white;
  border-top: 1px solid #e0e0e0;
  padding: 24px 16px 8px 16px;
  word-wrap: break-word;
}

.field-value {
  word-break: break-word;
}

@media (max-width: 600px) {
  .info-modal-main {
    padding-left: 8px;
    padding-right: 8px;
  }
}
</style>
