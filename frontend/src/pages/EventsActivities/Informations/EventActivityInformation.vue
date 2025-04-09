<template>
  <div class="row q-col-gutter-lg">
    <div class="col-12 col-md-6">
      <ParticipantsSection
        :section="section"
        :isLoading="isLoading"
        :participants="participants"
        :displayedParticipants="displayedParticipants"
        :navigateToSubscriptionsPage="navigateToSubscriptionsPage"
        :navigateToTeamsPage="navigateToTeamsPage"
      />
    </div>

    <div class="col-12 col-md-6">
      <TransactionsSection
        :isLoading="isLoading"
        :recentTransactions="recentTransactions"
        :totalIncome="totalIncome"
        :totalExpenses="totalExpenses"
        :formatAmount="formatAmount"
        :formatDate="formatDate"
        :navigateToTransactionsPage="navigateToTransactionsPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import TransactionsSection from '@/pages/EventsActivities/Informations/Sections/TransactionsSection.vue';
import ParticipantsSection from '@/pages/EventsActivities/Informations/Sections/ParticipantsSection.vue';
import users from '@/data/users.json';
import transactions from '@/data/transactions.json';

const props = defineProps<{
  id: number;
  section: string;
  isLoading: boolean;
}>();

const router = useRouter();

interface User {
  name: string;
  email: string;
  cf: string;
  paid?: boolean;
}

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

const participants = computed<User[]>(() => {
  return users.users.map((user: User) => ({
    ...user,
    paid: Math.random() > 0.3
  }));
});

const displayedParticipants = computed<User[]>(() => {
  return participants.value.slice(0, 3);
});

const eventTransactions = computed<Transaction[]>(() => {
  return transactions.transactions.filter((transaction: Transaction) => {
    if (props.section === 'activities') {
      return transaction.activityId === props.id;
    } else {
      return transaction.eventId === props.id;
    }
  });
});

const recentTransactions = computed<Transaction[]>(() => {
  return [...eventTransactions.value]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
});

const totalIncome = computed<number>(() => {
  return eventTransactions.value
    .filter((t: Transaction) => t.amount > 0)
    .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
});

const totalExpenses = computed<number>(() => {
  return eventTransactions.value
    .filter((t: Transaction) => t.amount < 0)
    .reduce((sum: number, t: Transaction) => sum + Math.abs(t.amount), 0);
});

const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('it-IT');
};

const navigateToSubscriptionsPage = () => {
  router.push(`/${props.section}/view/${props.id}/subscriptions`);
};

const navigateToTeamsPage = () => {
  router.push(`/${props.section}/view/${props.id}/teams`);
};

const navigateToTransactionsPage = () => {
  router.push(`/${props.section}/view/${props.id}/balance`);
};
</script>
