<template>
  <ModalCustom
    v-model="isOpen"
    :persistent="false"
    :show-header="true"
    :title="$t('titles.info')"
    titleColor="primary"
    width="600px"
  >
    <div class="info-modal-content">
      <div v-for="(value, key) in filteredRowData" :key="key" class="info-field">
        <div class="text-subtitle1 text-bold q-mb-xs text-secondary">{{ $t(`labels.${key}`) }}</div>
        <div v-if="isDateField(key)" class="field-value date-field">
          {{ formatDate(value) }}
        </div>
        <div v-else-if="isPriceField(key)" class="field-value price-field">
          <q-chip color="secondary" text-color="white" size="md">
            {{ formatPrice(value) }}
          </q-chip>
        </div>
        <div v-else-if="isImageField(key)" class="field-value image-field">
          <q-img
            :src="String(value)"
            height="120px"
            width="120px"
            fit="cover"
            class="rounded-borders"
          />
        </div>
        <div v-else-if="isTextField(key) && String(value).length > 100" class="field-value text-field">
          <q-card flat bordered class="bg-grey-1">
            <q-card-section>{{ String(value) }}</q-card-section>
          </q-card>
        </div>
        <div v-else class="field-value standard-field">
          {{ convertToDisplayValue(value) }}
        </div>
        <q-separator spaced />
      </div>
    </div>
  </ModalCustom>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ModalCustom from '@/components/Modals/ModalCustom.vue';
import { formatDistanceToNow } from 'date-fns';
import { enUS, it } from 'date-fns/locale';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const props = defineProps<{
  modelValue: boolean;
  rowData: Record<string, unknown> | null;
}>();

const emit = defineEmits(['update:modelValue']);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const filteredRowData = computed(() => {
  if (!props.rowData) return {};

  // Filter out any keys that shouldn't be displayed
  const result: Record<string, unknown> = {};
  Object.entries(props.rowData).forEach(([key, value]) => {
    if (key !== 'id' && key !== '__v') {
      result[key] = value;
    }
  });

  return result;
});

const isDateField = (key: string): boolean => {
  return key.toLowerCase().includes('date') || key.toLowerCase().includes('time');
};

const isPriceField = (key: string): boolean => {
  return key.toLowerCase().includes('price') || key.toLowerCase().includes('cost');
};

const isImageField = (key: string): boolean => {
  return key.toLowerCase().includes('image') ||
    key.toLowerCase().includes('photo') ||
    (typeof props.rowData?.[key] === 'string' &&
      Boolean(String(props.rowData[key]).match(/\.(jpeg|jpg|gif|png)$/i)));
};

const isTextField = (key: string): boolean => {
  return key.toLowerCase().includes('description') || key.toLowerCase().includes('notes');
};

const formatDate = (value: unknown): string => {
  try {
    if (value && typeof value === 'string') {
      const date = new Date(value);
      const localeObj = locale.value === 'it' ? it : enUS;

      const formattedDate = new Intl.DateTimeFormat(locale.value === 'it' ? 'it-IT' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);

      const relativeTime = formatDistanceToNow(date, { addSuffix: true, locale: localeObj });

      return `${formattedDate} (${relativeTime})`;
    }
    return String(value);
  } catch (e) {
    return String(value);
  }
};

const formatPrice = (value: unknown): string => {
  try {
    if (value === 0 || value === '0') return 'Free';

    const price = Number(value);
    if (!isNaN(price)) {
      return new Intl.NumberFormat(locale.value === 'it' ? 'it-IT' : 'en-US', {
        style: 'currency',
        currency: 'EUR'
      }).format(price);
    }
    return String(value);
  } catch (e) {
    return String(value);
  }
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

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
};
</script>

<style scoped>
.info-modal-content {
  max-height: 70vh;
  overflow-y: auto;
}

.field-value {
  font-size: 16px;
  line-height: 1.5;
}

.date-field {
  color: #555;
  font-style: italic;
}

.price-field {
  font-weight: bold;
}

.text-field {
  max-height: 200px;
  overflow-y: auto;
  line-height: 1.6;
}
</style>

<style scoped>
.info-modal-content {
  max-height: 70vh;
  overflow-y: auto;
  padding: 0px 6px;
}

.info-field {
  transition: all 0.2s ease;
  border-radius: 8px;
  padding: 12px;
}

.info-field:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.field-value {
  font-size: 16px;
  line-height: 1.5;
  margin-top: 4px;
}

.date-field {
  color: black;
  font-style: italic;
}

.price-field {
  font-weight: bold;
}

.text-field {
  max-height: 200px;
  overflow-y: auto;
  line-height: 1.6;
  border-left: 3px solid var(--q-secondary);
  padding-left: 12px;
}

.image-field {
  display: flex;
  justify-content: center;
}

.image-field .q-img {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.image-field .q-img:hover {
  transform: scale(1.05);
}
</style>
