<template>
  <div class="target-setting-tab q-pa-sm">
    <SettingsSection
      :label="$t('settings.targets.title')"
      :description="$t('settings.targets.description')"
      :sub-description="$t('settings.targets.ageConstraint')">
      <div class="row q-col-gutter-sm">
        <div class="col-10">
          <InputTextCustom
            v-model="newTargetName"
            :label="$t('settings.targets.name')"
            :input-props="{ outlined: true, class: 'full-width' }"
          />
        </div>
        <div class="col-2">
          <q-btn
            v-if="!isEditing"
            color="primary"
            :label="$t('settings.commons.add')"
            class="full-width full-height"
            :disable="!isValidTarget"
            @click="addTarget"
          />
          <q-btn
            v-else
            color="primary"
            :label="$t('settings.commons.save')"
            class="full-width full-height"
            :disable="!isValidTarget"
            @click="updateTarget"
          />
        </div>
        <div class="col-4">
          <InputNumberCustom
            v-model="newTargetMinAge"
            type="number"
            :label="$t('settings.targets.minAge')"
            outlined
            :min="0"
            :max="90"
            :rules="[val => (val !== null) || (newTargetMaxAge !== null)]"
            :hide-bottom-space="true"
          />
        </div>
        <div class="col-4">
          <InputNumberCustom
            v-model="newTargetMaxAge"
            type="number"
            :label="$t('settings.targets.maxAge')"
            outlined
            :min="0"
          />
        </div>
        <div class="col-4">
          <q-select
            v-model="newTargetGender"
            :options="genderOptions"
            :label="$t('settings.targets.gender')"
            outlined
            emit-value
            map-options
            class="full-width"
          />
        </div>
      </div>

      <div class="q-mt-md">
        <div v-if="targets.length === 0" class="text-center text-grey q-py-md">
          {{ $t('settings.targets.noTargetsAdded') }}
        </div>
        <div v-else class="targets-list">
          <q-list bordered separator style="overflow-y: auto; max-height: 260px">
            <q-item
              v-for="(target, index) in displayedTargets"
              :key="index"
              class="target-item"
            >
              <q-item-section>
                <q-item-label>{{ target.name }}</q-item-label>
                <q-item-label caption>
                  <span v-if="target.minAge === 0 && target.maxAge !== null">-{{ target.maxAge }} anni</span>
                  <span v-else-if="target.maxAge === null">{{ target.minAge }}+ anni</span>
                  <span v-else>{{ target.minAge }} - {{ target.maxAge }} anni</span>
                  <span v-if="target.gender"> • {{ target.gender === 'M' ? $t('settings.targets.male') : $t('settings.targets.female') }}</span>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <div>
                  <q-btn
                    v-if="!isEditing"
                    flat
                    round
                    color="secondary"
                    icon="edit"
                    @click="editTarget(index)"
                  >
                    <q-tooltip>{{ $t('settings.commons.edit') }}</q-tooltip>
                  </q-btn>
                  <q-btn
                    v-if="!isEditing"
                    flat
                    round
                    color="negative"
                    icon="delete"
                    @click="removeTarget(index)"
                  >
                    <q-tooltip>{{ $t('settings.commons.remove') }}</q-tooltip>
                  </q-btn>

                  <q-btn
                    v-if="isEditing"
                    flat
                    round
                    color="grey"
                    icon="close"
                    @click="cancelEdit"
                  >
                    <q-tooltip>{{ $t('settings.commons.cancel') }}</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </SettingsSection>

    <SettingsSection
      :label="$t('settings.targets.maximumTargets')"
      :description="$t('settings.targets.maximumTargetsDescription')"
      :show-separator="false">
      <InputNumberCustom
        v-model="targetNumberMax"
        :label="$t('settings.targets.maximumTargets')"
        :input-props="{ outlined: true, class: 'full-width' }"
        :rules="[val => val !== null && Number(val) > 0]"
        :max="50"
        :hide-bottom-space="true"
        @update:model-value="saveSettings"
      />
    </SettingsSection>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import { useQuasar} from 'quasar';
import { useI18n } from 'vue-i18n';
import SettingsSection from '@/components/Card/SettingCard.vue';
import InputTextCustom from '@/components/Inputs/InputText.vue';
import InputNumberCustom from '@/components/Inputs/InputNumber.vue';

interface Target {
  name: string;
  minAge: number;
  maxAge: number | null;
  gender: string | null;
}

const $q = useQuasar();
const { t } = useI18n();

const newTargetName = ref('');
const newTargetMinAge = ref<number | null>(0);
const newTargetMaxAge = ref<number | null>(null);
const newTargetGender = ref<string | null>(null);
const targets = ref<Target[]>([]);
const targetNumberMax = ref(0);
const isEditing = ref(false);
const currentEditIndex = ref(-1);

const genderOptions = [
  { label: t('settings.targets.any'), value: null },
  { label: t('settings.targets.male'), value: 'M' },
  { label: t('settings.targets.female'), value: 'F' },
];

const displayedTargets = computed(() => {
  if (isEditing.value) {
    return targets.value.filter((_, index) => index === currentEditIndex.value);
  }
  return targets.value;
});

const isValidTarget = computed(() => {
  if (!newTargetName.value.trim()) return false;

  if (newTargetGender.value !== null) return true;

  if ((newTargetMinAge.value === 0 || newTargetMinAge.value === null) &&
    (newTargetMaxAge.value === 0 || newTargetMaxAge.value === null)) {
    return false;
  }

  if (newTargetMaxAge.value !== null && newTargetMinAge.value !== null &&
    newTargetMinAge.value >= newTargetMaxAge.value) {
    return false;
  }

  return true;
});

const addTarget = () => {
  if (!isValidTarget.value) return;

  // Check for duplicate target name
  if (targets.value.some(target => target.name.toLowerCase() === newTargetName.value.trim().toLowerCase())) {
    $q.notify({
      color: 'negative',
      message: t('settings.targets.nameExists')
    });
    return;
  }

  const newMin = newTargetMinAge.value ?? 0; // Use nullish coalescing to ensure a number
  const newMax = newTargetMaxAge.value;

  const hasOverlap = targets.value.some(target =>
    target.minAge === newMin &&
    target.maxAge === newMax &&
    target.gender === newTargetGender.value
  );

  if (hasOverlap) {
    $q.notify({
      color: 'negative',
      message: t('settings.targets.ageRangeOverlap')
    });
    return;
  }

  targets.value.push({
    name: newTargetName.value.trim(),
    minAge: newMin,
    maxAge: newMax,
    gender: newTargetGender.value
  });

  if (newTargetMaxAge.value !== null && newTargetMaxAge.value > 90) {
    newTargetMaxAge.value = null;
  }

  // Sort targets by min age and then by gender
  sortTargets();

  // Reset form
  resetForm();
  saveSettings();

  $q.notify({
    color: 'positive',
    textColor: 'white',
    icon: 'check',
    message: t('settings.targets.targetAdded')
  });
};

const editTarget = (index: number) => {
  const target = targets.value[index];
  newTargetName.value = target.name;
  newTargetMinAge.value = target.minAge;
  newTargetMaxAge.value = target.maxAge;
  newTargetGender.value = target.gender;
  isEditing.value = true;
  currentEditIndex.value = index;
};

const updateTarget = () => {
  if (!isValidTarget.value || currentEditIndex.value === -1) return;

  const editedName = newTargetName.value.trim();
  const nameExists = targets.value.some((target, index) =>
    index !== currentEditIndex.value && target.name.toLowerCase() === editedName.toLowerCase()
  );

  if (nameExists) {
    $q.notify({
      color: 'negative',
      message: t('settings.targets.nameExists')
    });
    return;
  }

  const newMin = newTargetMinAge.value ?? 0;
  const newMax = newTargetMaxAge.value;

  const hasOverlap = targets.value.some((target, index) =>
    index !== currentEditIndex.value &&
    target.minAge === newMin &&
    target.maxAge === newMax &&
    target.gender === newTargetGender.value
  );

  if (hasOverlap) {
    $q.notify({
      color: 'negative',
      message: t('settings.targets.ageRangeOverlap')
    });
    return;
  }

  // Update the target
  targets.value[currentEditIndex.value] = {
    name: editedName,
    minAge: newMin,
    maxAge: newMax,
    gender: newTargetGender.value
  };

  // Sort targets and exit edit mode
  sortTargets();
  resetForm();
  isEditing.value = false;
  currentEditIndex.value = -1;
  saveSettings();

  $q.notify({
    color: 'positive',
    textColor: 'white',
    icon: 'check',
    message: t('settings.targets.targetUpdated')
  });
};

const cancelEdit = () => {
  resetForm();
  isEditing.value = false;
  currentEditIndex.value = -1;
};

const resetForm = () => {
  newTargetName.value = '';
  newTargetMinAge.value = 0;
  newTargetMaxAge.value = null;
  newTargetGender.value = null;
};

const sortTargets = () => {
  targets.value.sort((a, b) => {
    if (a.minAge !== b.minAge) return a.minAge - b.minAge;
    if (a.gender === b.gender) return 0;
    if (a.gender === null) return -1;
    if (b.gender === null) return 1;
    return a.gender.localeCompare(b.gender);
  });
};

const removeTarget = (index: number) => {
  // If we're editing and removing the current target, exit edit mode
  if (isEditing.value && index === currentEditIndex.value) {
    cancelEdit();
  }
  targets.value.splice(index, 1);
  saveSettings();
};

const loadSettings = () => {
  setTimeout(() => {
    targets.value = [
      { name: 'Bambini', minAge: 6, maxAge: 10, gender: null },
      { name: 'Ragazzi', minAge: 11, maxAge: 14, gender: null },
      { name: 'Adolescenti', minAge: 15, maxAge: 17, gender: null },
      { name: 'Giovani', minAge: 18, maxAge: 25, gender: null },
      { name: 'Adulti', minAge: 26, maxAge: null, gender: null }
    ];
  }, 500);

  setTimeout(() => {
    targetNumberMax.value = 20;
  }, 500);
};

const saveSettings = () => {
  $q.notify({
    color: 'positive',
    textColor: 'white',
    icon: 'check',
    message: t('settings.commons.settingsSaved')
  });
};

onMounted(() => {
  loadSettings();
});
</script>

<style lang="scss" scoped>
.target-setting-tab {
  width: 100%;
}

.targets-list {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.target-item {
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
}
</style>
