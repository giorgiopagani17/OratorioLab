<template>
  <q-page class="row items-center justify-evenly q-pa-md">
    <div :class="{'q-py-sm w-95': $q.screen.gt.sm, 'q-py-sm w-100': $q.screen.lt.md}">

      <HeaderSection fullWidth>
        <template v-slot:full>
          <SelectMonth @month-selected="onMonthSelected" />
        </template>
      </HeaderSection>

      <BodySection class="q-mt-lg">
        <template v-slot:leftHeader>
          <span v-if="props.section != 'all'">
            <span class="text-primary">{{ $t('types.' + props.section) }}</span>
            -
          </span>
          {{ $t('calendar.months.' + selectedMonthData?.name) }} {{ selectedMonthData?.year }}
        </template>

        <div class="transactions-container q-mt-xs">
          <div class="row q-col-gutter-sm q-pl-sm">
            <div class="col-12 col-lg-4 q-pr-sm" v-if="filteredTransactions.length">
              <q-card style="height: 98% !important;">
                <q-card-section>
                  <div class="text-h5 text-center text-primary text-bold">{{ $t('labels.paymentsStatus') }}</div>
                  <div class="row justify-center q-mt-md">
                    <StatusKnobChart
                      v-for="(count, status) in statusCounts"
                      :key="status"
                      :status="status"
                      :count="count"
                      :percentage="getStatusPercentage(status)"
                      :color="getStatusColor(status)"
                      :label="$t('status.' + status)"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div
              class="col-12 col-lg-8 q-pr-sm transactions-container-scrollable"
              :class="$q.screen.lt.lg ? 'q-mt-sm' : ''"
              v-if="filteredTransactions.length"
            >
              <TransactionCard
                v-for="(transaction, index) in filteredTransactions"
                :key="transaction.id"
                :transaction="transaction"
                :is-last="index === filteredTransactions.length - 1"
              />
            </div>

            <EmptyStateDisplay
              v-if="!filteredTransactions.length"
              :message="$t('errors.noTransactionsFound')"
            />
          </div>
        </div>
      </BodySection>

    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import HeaderSection from '@/components/Sections/HeaderSection.vue';
import BodySection from '@/components/Sections/BodySection.vue';
import SelectMonth from '@/pages/Balance/ChildComponents/SelectMonth.vue';
import transactionsData from '@/data/transactions.json';
import StatusKnobChart from '@/components/Charts/StatusKnobChart.vue';
import TransactionCard from '@/components/Card/TransactionCard.vue';
import EmptyStateDisplay from '@/components/Utils/EmptyStateDisplay.vue';

defineOptions({
  name: 'BalancePage'
});

interface MonthData {
  name: string;
  year: number;
  index: number;
  isFuture: boolean;
  monthIndex: number;
}

interface Transaction {
  id: number;
  userId: number;
  userName: string;
  transactionName: string;
  status: string;
  eventId: number | null;
  activityId: number | null;
  description: string;
  date: string;
  image: string;
  amount: number;
}

const props = defineProps<{
  section: string;
}>();

const selectedMonthData = ref<MonthData | null>(null);

const onMonthSelected = (monthData: MonthData) => {
  selectedMonthData.value = monthData;
};

const filteredTransactions = computed<Transaction[]>(() => {
  if (!selectedMonthData.value) {
    return [];
  }

  let transactions = transactionsData.transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === selectedMonthData.value!.monthIndex &&
      transactionDate.getFullYear() === selectedMonthData.value!.year
    );
  });

  if (props.section === 'activities') {
    return transactions.filter(transaction => transaction.activityId !== null);
  } else if (props.section === 'events') {
    return transactions.filter(transaction => transaction.eventId !== null);
  } else {
    return transactions;
  }
});

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'positive';
    case 'pending':
      return 'warning';
    case 'failed':
      return 'negative';
    default:
      return 'grey';
  }
};

const statusCounts = computed(() => {
  const counts: Record<string, number> = {
    completed: 0,
    pending: 0,
    failed: 0
  };

  filteredTransactions.value.forEach(transaction => {
    if (counts[transaction.status] !== undefined) {
      counts[transaction.status]++;
    }
  });

  return counts;
});

const getStatusPercentage = (status: string) => {
  if (!filteredTransactions.value.length) return 0;
  return Math.round((statusCounts.value[status] / filteredTransactions.value.length) * 100);
};
</script>

<style lang="scss" scoped>
.transaction-card {
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
  padding: 16px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  }
}

.transactions-container-scrollable {
  max-height: 445px;
  min-height: 445px;
  overflow: auto;

  @media (max-width: 1439px) {
    min-height: 0px;
  }
}

.transaction-image {
  width: 120px;
  height: 100px;
  max-height: 120px;
  object-fit: cover;
  aspect-ratio: 1/1;
  border-radius: 8px !important;
}

.ellipsis-1-line {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  word-break: break-word;
}

.status-knob {
  position: relative;
  height: 140px !important;
}
</style>
