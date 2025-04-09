<template>
  <BodySection>
    <template v-slot:leftHeader>
      {{ $t('titles.balance') }}
    </template>

    <template v-slot:rightHeader>
      <span class="text-primary">{{ formatAmount ? formatAmount(totalIncome - totalExpenses) : totalIncome }}</span>
    </template>

    <div v-if="isLoading" class="q-pa-md full-width">
      <q-skeleton type="rect" height="50px" class="q-mb-sm" />
      <q-skeleton type="rect" height="50px" class="q-mb-sm" />
      <q-skeleton type="rect" height="50px" class="q-mb-sm" />
    </div>

    <div v-else class="full-width content-container-informations">
      <div class="content-area-informations">
        <q-list separator v-if="recentTransactions.length > 0">
          <q-item v-for="transaction in recentTransactions" :key="transaction.id">
            <q-item-section>
              <q-item-label class="two-line-truncate">{{ transaction.description }}</q-item-label>
              <q-item-label caption>{{ formatDate ? formatDate(transaction.date) : transaction.date }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <div :class="['text-bold', {'text-positive': transaction.amount > 0, 'text-negative': transaction.amount < 0}]">
                {{ formatAmount ? formatAmount(transaction.amount) : transaction.amount }}
              </div>
            </q-item-section>
          </q-item>
        </q-list>
        <EmptyStateDisplay :message="$t('errors.noTransactionsFound')" v-else />
      </div>
      <div class="button-area text-center q-mt-md">
        <q-btn color="primary" :label="$t('buttons.seeAll')" @click="handleNavigateToTransactions" />
      </div>
    </div>
  </BodySection>
</template>

<script setup lang="ts">
import BodySection from '@/components/Sections/BodySection.vue';
import EmptyStateDisplay from '@/components/Utils/EmptyStateDisplay.vue';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  eventId?: number | null;
  activityId?: number | null;
  userId?: number;
  userName?: string;
  transactionName?: string;
  status?: string;
  image?: string;
}

const props = defineProps<{
  isLoading: boolean;
  recentTransactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  formatAmount: (amount: number) => string;
  formatDate: (dateString: string) => string;
  navigateToTransactionsPage: () => void;
}>();

const handleNavigateToTransactions = () => {
  props.navigateToTransactionsPage();
};
</script>

<style scoped>
.button-area {
  padding: 10px 0;
}
</style>
