<template>
  <q-page class="row items-center justify-evenly q-pa-md">
    <div :class="{'w-95': $q.screen.gt.sm, 'q-py-sm w-100': $q.screen.lt.md}">
      <HeaderSection
        leftColXs="col-12"
        leftColMd="col-md-4"
        rightColXs="col-12"
        rightColMd="col-md-8">

        <template v-slot:left>
          <div class="col-12 margin-bottom-responsive">
            <InputSearchCustom
              input-style="color: white;"
              :inputColor="'white'"
              v-model="search"
            />
          </div>
        </template>

        <template v-slot:right>
          <div class="col-3 q-px-sm" v-for="button in buttons" :key="button.title">
            <ResponsiveButton
              :text="$t(`buttons.${button.title}`)"
              :icon="button.icon"
              :active="button.active"
              @click="toggleFilter(button as Button)"
            />
          </div>
          <div class="col-3 q-px-sm">
            <ResponsiveButton
              :text="$t('buttons.back')"
              icon="arrow_back"
              color="grey"
              :active="false"
              @click="router.push('/'+ props.section + '/view/' + props.id)"
            />
          </div>
        </template>
      </HeaderSection>

      <DataTable
        :rows="subscriptions"
        :columns="columns"
        row-key="id"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import ResponsiveButton from '@/components/Buttons/ResponsiveButton.vue';
import HeaderSection from '@/components/Sections/HeaderSection.vue';
import {computed, ref, watch} from 'vue';
import { useRouter } from 'vue-router';
import { QTableColumn } from 'quasar';
import DataTable from '@/components/Tables/DataTable.vue';
import subscriptionsData from '@/data/subscriptions.json';
import { Button } from '@/interfaces/Button';
import {useI18n} from 'vue-i18n';
import InputSearchCustom from '@/components/Inputs/InputSearch.vue';

interface SubscriptionRow {
  id: number;
  userName: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  status: string;
}

const props = defineProps<{
  id: number;
  section: string;
}>();

const router = useRouter();
const { t } = useI18n();
const search = ref<string>('');
const buttons = ref([
  { title: 'major', icon: 'person', action: 'over18', active: false },
  { title: 'minor', icon: 'child_care', action: 'under18', active: false },
  { title: 'male', icon: 'male', action: 'male', active: false },
]);

const allSubscriptions = ref(subscriptionsData.subscriptions);
const subscriptions = ref(subscriptionsData.subscriptions);

const columns = computed<QTableColumn<SubscriptionRow>[]>(() => [
  { name: 'userName', label: t('labels.name'), field: 'userName', align: 'left', width: 200 },
  { name: 'email', label: 'Email', field: 'email', align: 'left', width: 250 },
  { name: 'dateOfBirth', label: t('labels.dateOfBirth'), field: 'dateOfBirth', align: 'left', width: 150 },
  { name: 'gender', label: t('labels.gender'), field: 'gender', align: 'left', width: 120 },
  { name: 'status', label: t('labels.status'), field: 'status', align: 'left', width: 100, format: val => getStatusDot(val) },
]);

const getStatusDot = (status: string) => {
  if (status === 'Active') {
    return '🟢';
  } else if (status === 'Pending') {
    return '🟡';
  } else {
    return '🔴';
  }
};
const toggleFilter = (button: Button) => {
  buttons.value = buttons.value.map(btn => ({
    ...btn,
    active: btn === button ? !btn.active : false
  }));
  applyFilters();
};

const applyFilters = () => {
  let filteredSubscriptions = [...allSubscriptions.value];

  const activeFilter = buttons.value.find(btn => btn.active);
  if (activeFilter) {
    switch (activeFilter.action) {
      case 'over18':
        filteredSubscriptions = filteredSubscriptions.filter(sub => new Date().getFullYear() - new Date(sub.dateOfBirth).getFullYear() >= 18);
        break;
      case 'under18':
        filteredSubscriptions = filteredSubscriptions.filter(sub => new Date().getFullYear() - new Date(sub.dateOfBirth).getFullYear() < 18);
        break;
      case 'male':
        filteredSubscriptions = filteredSubscriptions.filter(sub => sub.gender === 'Male');
        break;
    }
  }

  if (search.value) {
    const searchLower = search.value.toLowerCase();
    filteredSubscriptions = filteredSubscriptions.filter(sub =>
      sub.userName.toLowerCase().includes(searchLower) ||
      sub.email.toLowerCase().includes(searchLower)
    );
  }

  subscriptions.value = filteredSubscriptions;
};

watch(search, () => {
  applyFilters();
});
</script>
