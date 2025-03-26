<template>
  <div class="attributes-grid">
    <div class="attributes-column">
      <div class="input-section">
        <span class="section-title">{{ $t(`labels.${type}Name`) }}</span>
        <InputTextCustom
          :input-props="{
            rounded: true,
            outlined: true,
            hideBottomSpace: true
          }"
          v-model="name"
          :placeholder="$t('placeholders.insertText')"
          :rules="[val => !!val]"
        />
      </div>

      <div class="input-section">
        <span class="section-title">{{ $t('labels.notes') }}</span>
        <InputTextCustom
          :input-props="{
              rounded: true,
              outlined: true,
              hideBottomSpace: true,
            }"
          v-model="note"
          :placeholder="$t('placeholders.insertText')"
          :rules="[val => !!val]"
        />
      </div>

      <template v-if="isEvent">
        <div class="input-section">
          <span class="section-title">{{ $t('labels.description') }}</span>
          <q-input
            type="textarea"
            rounded
            outlined
            v-model="description"
            :placeholder="$t('placeholders.insertText')"
            @blur="() => description = (description?.toString() || '').trim()"
            :rules="[val => !!val]"
            hide-bottom-space
          />
        </div>
      </template>

      <template v-else>
        <div class="input-section">
          <span class="section-title">{{ $t('labels.maxParticipants') }}</span>
          <InputNumberCustom
            :input-props="{
              rounded: true,
              outlined: true,
              hideBottomSpace: true,
            }"
            :maxLength="6"
            v-model="maxParticipants"
            :placeholder="$t('placeholders.insertNumber')"
            update="formatNumberNoDecimals"
            :rules="[(val: string) => parseFloat(val.replace(/\./g, '').replace(',', '.')) > 0]"
          />
        </div>
      </template>
    </div>

    <div class="attributes-column with-divider">
      <template v-if="isEvent">
        <div class="input-section">
          <span class="section-title">{{ $t('labels.maxParticipants') }}</span>
          <InputNumberCustom
            :input-props="{
              rounded: true,
              outlined: true,
              hideBottomSpace: true,
            }"
            :maxLength="6"
            v-model="maxParticipants"
            :placeholder="$t('placeholders.insertNumber')"
            update="formatNumberNoDecimals"
            :rules="[(val: string) => parseFloat(val.replace(/\./g, '').replace(',', '.')) > 0]"
          />
        </div>

        <div class="input-section">
          <span class="section-title">{{ $t('labels.startDate') }}</span>
          <q-input
            type="datetime-local"
            class="q-mb-xs"
            rounded
            outlined
            v-model="startingDate"
            :rules="[val => !!val]"
            hide-bottom-space
          />
        </div>

        <div class="input-section">
          <span class="section-title">{{ $t('labels.endDate') }}</span>
          <q-input
            type="datetime-local"
            class="q-mb-xs"
            rounded
            outlined
            v-model="endingDate"
            :rules="[val => !!val, val => !startingDate || new Date(val) > new Date(startingDate)]"
            hide-bottom-space
          />
        </div>
      </template>
      <template v-else>
        <div class="input-section textarea-container">
          <span class="section-title">{{ $t('labels.description') }}</span>
          <q-input
            type="textarea"
            rounded
            outlined
            v-model="description"
            :placeholder="$t('placeholders.insertText')"
            @blur="() => description = (description?.toString() || '').trim()"
            :rules="[val => !!val]"
            hide-bottom-space
            class="description-textarea"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import { useEventsActivitiesStore } from '@/stores/eventsActivities';
import InputTextCustom from '@/components/Inputs/InputText.vue';
import InputNumberCustom from '@/components/Inputs/InputNumber.vue';

const props = defineProps({
  isEvent: {
    type: Boolean,
    default: false
  }
});

const type = computed(() => props.isEvent ? 'event' : 'activity');
const isEvent = computed(() => props.isEvent);
const name = ref('');
const description = ref('');
const note = ref('');
const startingDate = ref('');
const endingDate = ref('');
const maxParticipants = ref('');
const store = useEventsActivitiesStore();

const validateInputs = () => {
  let hasErrors = !name.value.trim() ||
    !description.value.trim() ||
    !note.value.trim() ||
    !maxParticipants.value ||
    parseFloat(maxParticipants.value.replace(/\./g, '').replace(',', '.')) <= 0;

  // Only validate dates for events
  if (isEvent.value) {
    hasErrors = hasErrors ||
      !startingDate.value ||
      !endingDate.value ||
      new Date(endingDate.value) <= new Date(startingDate.value);
  }

  window.dispatchEvent(new CustomEvent('inputErrors', {
    detail: { hasErrors }
  }));
};

watch([name, description, note, startingDate, endingDate, maxParticipants], () => {
  validateInputs();
});

const saveToLocalStorage = () => {
  const currentIndex = parseInt(store.eventsActivitiesIndex);
  const eventData = {
    type: type.value,
    name: name.value.trim(),
    description: description.value.trim(),
    note: note.value.trim(),
    maxParticipants: parseFloat(maxParticipants.value.replace(/\./g, '').replace(',', '.')),
    startDate: startingDate.value,
    endDate: endingDate.value,
  };

  if (store.eventsActivities[currentIndex]) {
    store.eventsActivities[currentIndex] = {
      ...store.eventsActivities[currentIndex],
      ...eventData
    };
    localStorage.setItem('eventsActivities', JSON.stringify(store.eventsActivities));
  } else {
    store.addEventActivity(eventData);
  }
};

onMounted(() => {
  window.addEventListener('saveAttributesStep', saveToLocalStorage);
  validateInputs();

  const currentIndex = parseInt(store.eventsActivitiesIndex);
  const savedEventActivity = store.eventsActivities[currentIndex];

  if (savedEventActivity) {
    name.value = savedEventActivity.name;
    description.value = savedEventActivity.description;
    note.value = savedEventActivity.note;
    startingDate.value = savedEventActivity.startDate;
    endingDate.value = savedEventActivity.endDate;
    maxParticipants.value = savedEventActivity.maxParticipants.toLocaleString('it-IT');
  }
});

onUnmounted(() => {
  window.removeEventListener('saveAttributesStep', saveToLocalStorage);
});
</script>

<style lang="scss" scoped>
.attributes-grid {
  display: flex;
  flex-wrap: wrap;
}

.attributes-column {
  flex: 1 1 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.5rem 0rem;

  @media (min-width: 600px) {
    flex: 1 1 50%;
    min-height: 445px;
    padding: 1rem 2rem 2rem;
  }

  @media (max-width: 600px) {
    padding-bottom: 0px !important;
    padding-bottom: 0px !important;

  }
}

.input-section {
  margin-bottom: 1rem;

  @media (min-width: 600px) {
    margin-bottom: 0;
  }
}

.section-title {
  display: block;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--q-primary);
}

.description-textarea {
  height: 100%;

  :deep(.q-field__control) {
    height: 100%;
  }

  :deep(.q-field__native) {
    min-height: 300px;
    resize: none;

    @media (min-width: 600px) {
      min-height: 340px;
    }
  }
}

.textarea-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  .description-textarea {
    flex-grow: 1;
  }
}

.with-divider {
  position: relative;

  @media (min-width: 600px) {
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 5%;
      height: 90%;
      width: 2px;
      background-color: $border-color;
    }
  }
}
</style>
