<template>
  <q-page class="row items-center justify-evenly q-pa-md">
    <div :class="{'q-py-sm w-95': $q.screen.gt.sm, 'q-py-sm w-100': $q.screen.lt.md}">
      <HeaderSection
        leftColXs="col-12"
        leftColMd="col-md-4"
        rightColXs="col-12"
        rightColMd="col-md-8">

        <template v-slot:left>
          <div class="col-12 margin-bottom-responsive">
            <q-input
              v-model="search"
              clearable
              dense
              input-style="color: white;"
              :placeholder="$t('placeholders.search')"
              color="white"
              class="custom-input blue-container-input full-width q-pt-auto"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="white"/>
              </template>
            </q-input>
          </div>
        </template>

        <template v-slot:right>
          <div class="col-3 q-px-sm" v-for="button in buttons" :key="button.title">
            <ResponsiveButton
              :text="$t(`buttons.${button.title}`)"
              :icon="button.icon"
              :active="button.active"
              @click="toggleFilter(button)"
            />
          </div>
          <div class="col-3 q-px-sm">
            <ResponsiveButton
              :text="$t('buttons.create')"
              icon="add"
              color="secondary"
              :active="false"
              @click="showModal = true"
            />
          </div>
        </template>
      </HeaderSection>

      <DataTable
        :rows="rows"
        :columns="columns"
        row-key="name"
        :pagination="pagination"
        :loading="loading"
        :modalUserInfo="true"
        @update:pagination="onPaginationChange"
        @request-data="fetchData"
      />
    </div>

    <UserModal v-model="showModal" :isRegistration="true"/>
  </q-page>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import type { QTableColumn } from 'quasar';
import usersData from '@/data/users.json';
import { useI18n } from 'vue-i18n';
import HeaderSection from '@/components/Sections/HeaderSection.vue';
import ResponsiveButton from '@/components/Buttons/ResponsiveButton.vue';
import DataTable from '@/components/Tables/DataTable.vue';
import UserModal from '@/components/Modals/components/UserModal.vue';

defineOptions({
  name: 'UserPage'
});

interface UserRow {
  name: string;
  age: number;
  dateOfBirth: string;
  gender: string;
  email: string;
}

interface Button {
  title: string;
  icon: string;
  action: string;
  active: boolean;
}

interface QPagination {
  page: number;
  rowsPerPage: number;
  rowsNumber?: number;
}

const search = ref<string>('');
const allUsers = ref<UserRow[]>([]);
const rows = ref<UserRow[]>([]);
const { t } = useI18n();
const loading = ref<boolean>(false);
const showModal = ref<boolean>(false);

const columns = computed<QTableColumn<UserRow>[]>(() => [
  { name: 'name', label: t('labels.name'), align: 'left', field: 'name', sortable: false, width: 200 },
  { name: 'age', label: t('labels.age'), align: 'left', field: 'age', sortable: false, width: 100 },
  { name: 'dateOfBirth', label: t('labels.dateOfBirth'), align: 'left', field: 'dateOfBirth', sortable: false, width: 150 },
  { name: 'gender', label: t('labels.gender'), align: 'left', field: 'gender', sortable: false, width: 120 },
  { name: 'email', label: 'Email', align: 'left', field: 'email', sortable: false, width: 250 },
]);

const buttons = ref<Button[]>([
  { title: 'major', icon:'person', action: 'over18', active: false },
  { title: 'minor', icon:'child_care', action: 'under18', active: false },
  { title: 'male', icon:'male', action: 'male', active: false }
]);

const pagination = ref<QPagination>({
  rowsPerPage: 7,
  page: 1,
});

const fetchData = async (paginationData: QPagination) => {
  loading.value = true;
  try {
    console.log('chiamata api', paginationData);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    loading.value = false;
  }
};

const onPaginationChange = (newPagination: QPagination) => {
  pagination.value = newPagination;
};

const toggleFilter = (button: Button) => {
  buttons.value = buttons.value.map(btn => ({
    ...btn,
    active: btn === button ? !btn.active : false
  }));
  applyFilters();
};

const applyFilters = () => {
  let filteredUsers = [...allUsers.value];

  const activeFilter = buttons.value.find(btn => btn.active);
  if (activeFilter) {
    switch (activeFilter.action) {
      case 'over18':
        filteredUsers = filteredUsers.filter(user => user.age >= 18);
        break;
      case 'under18':
        filteredUsers = filteredUsers.filter(user => user.age < 18);
        break;
      case 'male':
        filteredUsers = filteredUsers.filter(user => user.gender === 'Male');
        break;
    }
  }

  if (search.value) {
    const searchLower = search.value.toLowerCase();
    filteredUsers = filteredUsers.filter(user =>
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  }

  rows.value = filteredUsers;
};

watch(search, () => {
  applyFilters();
});

onMounted(() => {
  allUsers.value = usersData.users;
  rows.value = usersData.users;
});
</script>
