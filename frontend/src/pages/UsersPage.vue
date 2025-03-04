<template>
  <q-page class="row items-center justify-evenly q-pa-md">
    <div :class="{'w-95': $q.screen.gt.sm, 'q-py-sm w-100': $q.screen.lt.md}">
      <div class="row container q-px-lg q-py-md">
        <div class="col-12 col-md-4 q-my-auto border-right-grey-responsive">
          <div class="q-px-sm">
            <q-input
              v-model="search"
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
        </div>

        <div class="col-12 col-md-8">
          <div class="row justify-center padding-left-responsive">
            <div class="col-3 col-sm-6 col-md-3 q-px-sm q-px-sm" v-for="button in buttons" :key="button.title">
              <q-btn
                :color="button.active ? 'secondary' : 'primary'"
                class="button full-width flex-center"
                @click="toggleFilter(button)"
              >
                <div class="hide-1274 flex-center">
                  <q-icon v-if="isIconVisible" class="gt-sm" :name="button.icon" />
                  <span v-else class="gt-sm">{{ $t(`buttons.${button.title}`) }}</span>
                </div>
                <span class="show-1274">{{ $t(`buttons.${button.title}`) }}</span>
                <span class="lt-md gt-xs">{{ $t(`buttons.${button.title}`) }}</span>
                <q-icon class="lt-sm" :name="button.icon" />
              </q-btn>
            </div>
          </div>
        </div>
      </div>

      <div class="table-container">
      <q-table
        style="border-radius: 24px; min-height: 436px"
        class="q-mt-lg"
        :rows="rows"
        :columns="columns"
        row-key="name"
        flat
        bordered
        virtual-scroll
        :rows-per-page-options="[7, 15, 30, 50]"
        :rows-per-page-label="$t('labels.recordsPerPage')"
        :pagination="pagination"
        @update:pagination="onPaginationChange"
      >
        <template v-slot:header-cell="props">
          <q-th
            :props="props"
            class="bg-secondary text-white"
            style="font-size: 15px; font-weight: bold;"
          >
            {{ props.col.label }}
          </q-th>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center">
            {{ $t('errors.noUserFound') }}
          </div>
        </template>

        <template v-slot:body-cell="props">
          <q-td :props="props">
            {{ props.value }}
          </q-td>
        </template>
      </q-table>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import type { QTableColumn } from 'quasar';
import usersData from '@/data/users.json';
import { useI18n } from 'vue-i18n';
import { useDetailsStore } from '@/stores/details';

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
const detailsStore = useDetailsStore();
const isIconVisible = computed(() => {
  return detailsStore.leftDrawerOpen === 'true';
});

const columns = computed<QTableColumn<UserRow>[]>(() => [
  { name: 'name', label: t('labels.name'), align: 'left', field: 'name', sortable: false },
  { name: 'age', label: t('labels.age'), align: 'left', field: 'age', sortable: false },
  { name: 'dateOfBirth', label: t('labels.dateOfBirth'), align: 'left', field: 'dateOfBirth', sortable: false },
  { name: 'gender', label: t('labels.gender'), align: 'left', field: 'gender', sortable: false },
  { name: 'email', label: 'Email', align: 'left', field: 'email', sortable: false },
]);

const buttons = ref<Button[]>([
  { title: 'major', icon:'person', action: 'over18', active: false },
  { title: 'minor', icon:'child_care', action: 'under18', active: false },
  { title: 'male', icon:'male', action: 'male', active: false },
  { title: 'female', icon:'female', action: 'female', active: false }
]);

const pagination = ref<QPagination>({
  rowsPerPage: 7,
  page: 1,
});

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
      case 'female':
        filteredUsers = filteredUsers.filter(user => user.gender === 'Female');
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

<style lang="scss">
.table-container {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x proximity;
}

.q-table {
  table-layout: fixed;
  position: relative;
  min-width: 900px;
  scroll-snap-align: start;

  th, td {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  th:first-child,
  td:first-child {
    position: sticky;
    left: 0;
    z-index: 2;
    background: white;
  }

  th:first-child {
    z-index: 3;
    background: var(--q-secondary);
  }

  thead tr {
    th:th:nth-child(2) { width: 10%; }
    th:nth-child(3) { width: 15%; }
    th:nth-child(4) { width: 15%; }
    th:nth-child(5) { width: 35%; }
  }
}

.input-blue {
  border: none !important;
  border-radius: 100px;
}
</style>
