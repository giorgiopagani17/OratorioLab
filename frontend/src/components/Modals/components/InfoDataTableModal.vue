<template>
  <ModalCustom
    v-model="isOpen"
    :persistent="false"
    :show-header="true"
    :title="$t('titles.info')"
    titleColor="primary"
    :fullHeight="true"
    :fullWidth="true"
  >
    <div class="info-modal-content">
      <div class="info-modal-main q-mt-sm row justify-center q-gutter-lg">
        <div class="col-12 col-md-3">
          <div class="bg-grey-3 flex items-center justify-center" style="width: 125px; height: 125px; border-radius: 50%">
            <q-icon name="person" color="white" size="80px" />
          </div>
          <div class="q-mt-sm text-bold text-truncate text-h6 text-secondary">
            {{ rowData?.name || 'example@gmail.com' }}
          </div>
          <div class="text-grey-7 q-mt-xs">{{ rowData?.email || 'example@gmail.com' }}</div>

          <div class="q-mt-lg">
            <div
              v-for="option in options"
              :key="option.id"
              :class="[
              'text-h6',
              'q-mt-sm',
              'cursor-pointer',
              { 'text-primary text-bold': option.active, 'text-grey-7': !option.active }
            ]"
              @click="setActive(option)"
            >
              {{ option.title }}
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="text-h5 text-bold text-primary">{{ activeOption.title }}</div>
          <div class="text-grey-7 q-mt-md">{{ activeOption.description }}</div>

          <div v-if="isRegistration" class="q-mt-lg q-pt-sm">
            <div :class="[activeOption.id === 1 ? 'row q-col-gutter-md q-pb-sm' : '']">
              <div
                v-for="item in filteredData"
                :key="item.title"
                :class="[
                activeOption.id === 1 ? 'col-12 col-md-6' : 'q-mb-md'
              ]"
              >
                <div>
                  <div class="text-subtitle1 text-bold text-secondary flex justify-between">
                    {{ item.title }}
                    <q-icon :name="item.icon" color="secondary" size="sm"/>
                  </div>
                  <q-input
                    v-model="formData[item.title]"
                    outlined
                    dense
                    class="q-mt-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <div v-else class="q-mt-lg">
            <div v-if="selectedField" class="q-mb-md">
              <q-card class="field-container">
                <q-card-section>
                  <div class="text-subtitle1 text-bold q-mb-xs text-secondary flex justify-between">
                    {{ selectedField.title }}
                    <q-icon :name="selectedField.icon" color="secondary" size="sm" class="q-ml-xs" />
                  </div>
                  <q-input
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
            <div v-else :class="[activeOption.id === 1 ? 'row q-col-gutter-md q-pb-sm' : '']">
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
                      {{ item.title }}
                      <q-icon :name="item.icon" color="secondary" size="sm"/>
                    </div>
                    <div class="field-value">{{ convertToDisplayValue(rowData?.[item.title]) }}</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div class="privacy-notice">
        <q-icon name="security" color="secondary" size="md" />
        <div class="text-subtitle1 text-bold q-mt-xs">Trattamento dei Dati Sensibili</div>
        <p class="text-grey-7 q-mt-sm" style="width: 90%; margin: 0 auto;">
          Oratori360 tratta i dati sensibili in conformità con il Regolamento UE 2016/679 (GDPR).
          Adottiamo misure tecniche e organizzative adeguate per proteggere i dati personali da accessi
          non autorizzati, perdita o modifica. I dati vengono conservati solo per il tempo necessario alle
          finalità per cui sono stati raccolti e l'utente può esercitare i propri diritti contattando il
          nostro responsabile della protezione dei dati.
        </p>
      </div>
    </div>
  </ModalCustom>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue';
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

const selectedField = ref<DataItem | null>(null);
const editValue = ref<string>('');
const formData = reactive<Record<string, string | number | null>>({});
const options = ref<OptionItem[]>([
  {
    id: 1,
    title: 'Personal Information',
    description: 'This section contains all the personal user information, including email, username, and other relevant details. It is essential for identifying and contacting the user.',
    icon: 'person',
    active: true
  },
  {
    id: 2,
    title: 'Domicile',
    description: 'Here you can find the user\'s domicile information, including their current address and any previous addresses. This is important for verifying the user\'s residence and for any necessary correspondence.',
    icon: 'home',
    active: false
  },
  {
    id: 3,
    title: 'Emergency Contact',
    description: 'In this section, you can find the emergency contact information. This includes the names and phone numbers of people to contact in case of an emergency, ensuring quick and effective communication.',
    icon: 'contact_phone',
    active: false
  },
  {
    id: 4,
    title: 'Illness',
    description: 'This section provides detailed information about any illnesses the user may have. It includes medical history, current conditions, and any relevant treatments or medications, ensuring proper care and attention.',
    icon: 'medical_services',
    active: false
  },
]);

const data = ref<DataItem[]>([
  { title: 'Name', optionId: 1, icon: 'person' },
  { title: 'Email', optionId: 1, icon: 'email' },
  { title: 'CF', optionId: 1, icon: 'badge' },
  { title: 'Birthday', optionId: 1, icon: 'cake' },
  { title: 'Gender', optionId: 1, icon: 'wc' },
  { title: 'CreatedAt', optionId: 1, icon: 'event' },
  { title: 'Address', optionId: 2, icon: 'home' },
  { title: 'Country', optionId: 2, icon: 'flag' },
  { title: 'Nationality', optionId: 2, icon: 'public' },
  { title: 'Mother', optionId: 3, icon: 'woman' },
  { title: 'Father', optionId: 3, icon: 'man' },
  { title: 'Tutor', optionId: 3, icon: 'support_agent' },
  { title: 'Illness', optionId: 4, icon: 'medical_services' },
  { title: 'Allergies', optionId: 4, icon: 'health_and_safety' },
]);

if (props.rowData) {
  // Convert all rowData values to appropriate types for inputs
  Object.entries(props.rowData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
    } else {
      formData[key] = '';
    }
  });
}

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
  // Close any editing field when changing tabs
  selectedField.value = null;
};

const selectField = (item: DataItem): void => {
  selectedField.value = item;
  const currentValue = props.rowData?.[item.title];
  editValue.value = currentValue !== null && currentValue !== undefined ? String(currentValue) : '';
};

const cancelEdit = (): void => {
  selectedField.value = null;
  editValue.value = '';
};

const saveEdit = (): void => {
  if (selectedField.value && props.rowData) {
    // In a real application, you would likely emit an event here to update the actual data
    console.log(`Updating ${selectedField.value.title} from ${props.rowData[selectedField.value.title]} to ${editValue.value}`);

    // Save the change to the formData object
    formData[selectedField.value.title] = editValue.value;

    // Here you would typically call an API or dispatch an action to update the data
    // For now, we'll just close the edit mode
    selectedField.value = null;

    // If in registration mode, emit the save event
    if (props.isRegistration) {
      emit('save', formData);
    }
  }
};


//const saveAllFormData = () => {
  //emit('save', formData);
//};

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

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
};
</script>

<style scoped>
.field-container {
  border-radius: 12px;
  background-color: white;
}
.info-modal-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.info-modal-main {
  flex: 1;
  overflow-y: auto;
}

.privacy-notice {
  margin-top: auto;
  text-align: center;
  background-color: white;
  border-top: 1px solid #e0e0e0;
  padding: 24px 0px 16px 0px;
}
</style>
