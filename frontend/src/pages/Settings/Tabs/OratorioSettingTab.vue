<template>
  <div class="oratorio-setting-tab q-pa-sm">
    <SettingsSection
      :label="$t('settings.commons.name')"
      :description="$t('settings.commons.nameDescription')">
      <InputTextCustom
        v-model="oratoryName"
        :label="$t('settings.commons.name')"
        :input-props="{ outlined: true, class: 'full-width' }"
        @update:model-value="saveSettings"
      />
    </SettingsSection>

    <SettingsSection
      :label="$t('settings.commons.image')"
      :description="$t('settings.commons.imageDescription')">
      <div class="oratory-image-container">
        <div class="image-wrapper">
          <q-img
            v-if="oratoryImage"
            :src="oratoryImage"
            class="oratory-image"
            fit="cover"
            spinner-color="primary"
          />
          <div v-else class="no-image-placeholder">
            <q-icon name="insert_photo" size="64px" color="grey-6" />
            <div class="text-grey-6 q-mt-sm">{{ $t('settings.commons.noImage') }}</div>
          </div>

          <div class="image-overlay">
            <input
              type="file"
              accept="image/*"
              class="file-input"
              ref="fileInput"
              @change="handleFileSelected"
            />
            <q-btn
              round
              color="white"
              text-color="primary"
              icon="camera_alt"
              class="upload-button"
              @click="$refs.fileInput.click()"
            />
            <q-tooltip>{{ $t('settings.commons.changeImage') }}</q-tooltip>
          </div>
        </div>
      </div>
    </SettingsSection>

    <SettingsSection
      :label="$t('settings.commons.address')"
      :description="$t('settings.commons.addressDescription')">
      <InputTextCustom
        v-model="oratoryAddress"
        :label="$t('settings.commons.address')"
        :input-props="{ outlined: true, class: 'full-width' }"
        @update:model-value="saveSettings"
      />
    </SettingsSection>

    <SettingsSection
      :label="$t('settings.commons.contactEmail')"
      :description="$t('settings.commons.contactEmailDescription')">
      <InputTextCustom
        v-model="contactEmail"
        :label="$t('settings.commons.contactEmail')"
        :input-props="{ outlined: true, class: 'full-width', type: 'email' }"
        @update:model-value="saveSettings"
      />
    </SettingsSection>

    <SettingsSection
      :label="$t('settings.commons.contactTelephone')"
      :description="$t('settings.commons.contactTelephoneDescription')">
      <InputTextCustom
        v-model="contactTelephone"
        :label="$t('settings.commons.contactTelephone')"
        :input-props="{ outlined: true, class: 'full-width', type: 'tel' }"
        @update:model-value="saveSettings"
      />
    </SettingsSection>

    <SettingsSection
      :label="$t('settings.commons.oratoryPlaces')"
      :description="$t('settings.commons.oratoryPlacesDescription')"
      :show-separator="false">
      <div class="row q-col-gutter-sm">
        <div class="col-9">
          <InputTextCustom
            v-model="newMemberName"
            :label="$t('settings.commons.oratoryPlaces')"
            :input-props="{ outlined: true, class: 'full-width' }"
            @keyup.enter="addMember"
          />
        </div>
        <div class="col-3">
          <q-btn
            color="primary"
            :label="$t('settings.commons.add')"
            class="full-width full-height"
            :disable="!newMemberName.trim()"
            @click="addMember"
          />
        </div>
      </div>

      <div class="q-mt-md">
        <div v-if="teamMembers.length === 0" class="text-center text-grey q-py-md">
          {{ $t('settings.commons.noPlacesAdded') }}
        </div>
        <div v-else class="members-container">
          <q-chip
            v-for="(member, index) in teamMembers"
            :key="index"
            removable
            @remove="removeMember(index)"
            color="secondary"
            text-color="white"
            class="q-ma-xs"
          >
            {{ member }}
          </q-chip>
        </div>
      </div>
    </SettingsSection>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import SettingsSection from '@/components/Card/SettingCard.vue';
import InputTextCustom from '@/components/Inputs/InputText.vue';

const $q = useQuasar();

const oratoryName = ref('');
const oratoryAddress = ref('');
const contactEmail = ref('');
const contactTelephone = ref('');
const newMemberName = ref('');
const teamMembers = ref<string[]>([]);
const oratoryImage = ref<string | null>('');
const fileInput = ref<HTMLInputElement | null>(null);

const handleFileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    handleImageUpload(file);
    input.value = '';
  }
};

const handleImageUpload = (file: File | null) => {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target && e.target.result) {
        oratoryImage.value = e.target.result as string;
        saveSettings();
      }
    };
    reader.readAsDataURL(file);
  }
};

const addMember = () => {
  if (newMemberName.value.trim()) {
    teamMembers.value.push(newMemberName.value.trim());
    newMemberName.value = '';
    saveSettings();
  }
};

const removeMember = (index: number) => {
  teamMembers.value.splice(index, 1);
  saveSettings();
};

const loadSettings = () => {
  setTimeout(() => {
    oratoryName.value = 'San Giovanni Bosco';
    oratoryAddress.value = 'Via Roma, 123, Milano';
    contactEmail.value = 'info@oratoriolab.com';
    contactTelephone.value = '+39 035 1234567';
    teamMembers.value = ['Salone', 'Campo da calcio', 'Aula studio'];
  }, 500);
};

const saveSettings = () => {
  $q.notify({
    color: 'positive',
    textColor: 'white',
    icon: 'check',
    message: 'Settings saved successfully'
  });
};

onMounted(() => {
  loadSettings();
});
</script>

<style lang="scss" scoped>
.oratorio-setting-tab {
  width: 100%;
}

.members-container {
  display: flex;
  flex-wrap: wrap;
  padding: 8px 0;
}

.oratory-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-wrapper {
  position: relative;
  width: 440px;
  height: 240px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);

  &:hover .image-overlay {
    opacity: 1;
  }
}

.oratory-image {
  width: 100%;
  height: 100%;
}

.no-image-placeholder {
  width: 100%;
  height: 100%;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fafafa;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.file-input {
  position: absolute;
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  z-index: -1;
}

.upload-button {
  font-size: 1.2em;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.actions {
  display: flex;
  justify-content: center;
}
</style>
