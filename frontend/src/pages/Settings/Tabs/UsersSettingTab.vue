<template>
  <div class="users-setting-tab q-pa-sm">
    <SettingsSection
      :label="$t('settings.users.admins')"
      :description="$t('settings.users.adminsDescription')">
      <div class="row q-col-gutter-sm">
        <div class="col-9">
          <InputTextCustom
            v-model="newAdminEmail"
            :label="$t('settings.users.email')"
            :input-props="{ outlined: true, class: 'full-width', type: 'email' }"
            @keyup.enter="addAdmin"
          />
        </div>
        <div class="col-3">
          <q-btn
            color="secondary"
            :label="$t('settings.commons.add')"
            class="full-width full-height"
            :disable="!isValidEmail(newAdminEmail)"
            @click="addAdmin"
          />
        </div>
      </div>

      <div class="q-mt-md">
        <div v-if="adminUsers.length === 0" class="text-center text-grey q-py-md">
          {{ $t('settings.users.noAdminsAdded') }}
        </div>
        <div v-else class="users-list">
          <q-list bordered separator style="overflow-y: auto; max-height: 160px">
            <q-item v-for="(admin, index) in adminUsers" :key="index" class="user-item">
              <q-item-section avatar>
                <q-avatar color="secondary" text-color="white">
                  {{ getInitials(admin.name) }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ admin.name }}</q-item-label>
                <q-item-label caption>{{ admin.email }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  round
                  color="negative"
                  icon="delete"
                  @click="removeAdmin(index)"
                >
                  <q-tooltip>{{ $t('settings.commons.remove') }}</q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </SettingsSection>

    <SettingsSection
      :label="$t('settings.users.staff')"
      :description="$t('settings.users.staffDescription')"
      :show-separator="false">
      <div class="row q-col-gutter-sm">
        <div class="col-9">
          <InputTextCustom
            v-model="newStaffEmail"
            :label="$t('settings.users.email')"
            :input-props="{ outlined: true, class: 'full-width', type: 'email' }"
            @keyup.enter="addStaff"
          />
        </div>
        <div class="col-3">
          <q-btn
            color="primary"
            :label="$t('settings.commons.add')"
            class="full-width full-height"
            :disable="!isValidEmail(newStaffEmail)"
            @click="addStaff"
          />
        </div>
      </div>

      <div class="q-mt-md">
        <div v-if="staffUsers.length === 0" class="text-center text-grey q-py-md">
          {{ $t('settings.users.noStaffAdded') }}
        </div>
        <div v-else class="users-list">
          <q-list bordered separator style="overflow-y: auto; max-height: 160px">
            <q-item v-for="(staff, index) in staffUsers" :key="index" class="user-item">
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">
                  {{ getInitials(staff.name) }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ staff.name }}</q-item-label>
                <q-item-label caption>{{ staff.email }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  round
                  color="negative"
                  icon="delete"
                  @click="removeStaff(index)"
                >
                  <q-tooltip>{{ $t('settings.commons.remove') }}</q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
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
import { useI18n } from 'vue-i18n';

interface User {
  name: string;
  email: string;
}

const $q = useQuasar();
const { t } = useI18n();

const newAdminEmail = ref('');
const newStaffEmail = ref('');
const adminUsers = ref<User[]>([]);
const staffUsers = ref<User[]>([]);

const isValidEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

const addAdmin = () => {
  if (isValidEmail(newAdminEmail.value)) {
    const email = newAdminEmail.value.trim();
    if (adminUsers.value.some(user => user.email === email)) {
      $q.notify({
        color: 'negative',
        textColor: 'white',
        icon: 'warning',
        message: t('settings.users.emailAlreadyExists')
      });
      return;
    }

    const name = email.split('@')[0]
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    adminUsers.value.push({ name, email });
    newAdminEmail.value = '';
    saveSettings();
  }
};

const removeAdmin = (index: number) => {
  adminUsers.value.splice(index, 1);
  saveSettings();
};

const addStaff = () => {
  if (isValidEmail(newStaffEmail.value)) {
    const email = newStaffEmail.value.trim();
    if (staffUsers.value.some(user => user.email === email)) {
      $q.notify({
        color: 'negative',
        textColor: 'white',
        icon: 'warning',
        message: t('settings.users.emailAlreadyExists')
      });
      return;
    }

    const name = email.split('@')[0]
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    staffUsers.value.push({ name, email });
    newStaffEmail.value = '';
    saveSettings();
  }
};

const removeStaff = (index: number) => {
  staffUsers.value.splice(index, 1);
  saveSettings();
};

const loadSettings = () => {
  setTimeout(() => {
    adminUsers.value = [
      { name: 'Mario Rossi', email: 'mario.rossi@example.com' },
      { name: 'Laura Bianchi', email: 'laura.bianchi@example.com' }
    ];

    staffUsers.value = [
      { name: 'Paolo Verdi', email: 'paolo.verdi@example.com' },
      { name: 'Giulia Neri', email: 'giulia.neri@example.com' },
      { name: 'Marco Bruno', email: 'marco.bruno@example.com' }
    ];
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
.users-setting-tab {
  width: 100%;
}

.users-list {
  margin-top: 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.user-item {
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
}
</style>
