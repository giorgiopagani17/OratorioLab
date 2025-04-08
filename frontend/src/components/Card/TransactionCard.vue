<template>
  <q-card
    :class="['transaction-card cursor-pointer', isLast ? 'q-mb-sm' : 'q-mb-md']"
    @click="openTransactionDetails"
  >
    <q-card-section :horizontal="$q.screen.gt.xs">
      <q-img
        :src="transaction.image"
        :class="['transaction-image', $q.screen.xs ? 'full-width q-mb-sm' : '']"
      />
      <q-card-section class="full-width q-px-md q-py-none">
        <div :class="[$q.screen.gt.xs ? 'row justify-between items-center' : '']">
          <div class="col">
            <div class="text-h6 text-weight-bold">{{ transaction.transactionName }}</div>
            <div class="text-body1">{{ transaction.userName }}</div>
            <div class="text-subtitle2">{{ formatDate(transaction.date) }}</div>
            <div class="text-caption ellipsis-1-line">{{ transaction.description }}</div>
          </div>
          <div :class="[$q.screen.gt.xs ? 'col-auto text-right q-ml-md' : 'q-mt-sm']">
            <div class="text-h6 text-weight-bold q-mb-sm">€{{ transaction.amount.toFixed(2) }}</div>
            <q-badge :color="getStatusColor(transaction.status)">
              {{ $t(`status.${transaction.status.toLowerCase()}`) }}
            </q-badge>
          </div>
        </div>
      </q-card-section>
    </q-card-section>
  </q-card>

  <InfoTransactionModal
    v-if="selectedTransaction"
    :is-open="detailsSidebarOpen"
    :transaction="selectedTransaction"
    @update:is-open="detailsSidebarOpen = $event"
  />
</template>

<script setup lang="ts">
import { date } from 'quasar';
import InfoTransactionModal from '@/components/Modals/components/InfoTransactionModal.vue';
import { ref } from 'vue';

defineOptions({
  name: 'TransactionCard'
});

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

const props = defineProps({
  transaction: {
    type: Object as () => Transaction,
    required: true
  },
  isLast: {
    type: Boolean,
    default: false
  }
});

defineEmits(['click']);

// Added these missing refs
const selectedTransaction = ref<Transaction | null>(null);
const detailsSidebarOpen = ref(false);

const openTransactionDetails = () => {
  selectedTransaction.value = props.transaction;
  detailsSidebarOpen.value = true;
};

const formatDate = (dateString: string) => {
  return date.formatDate(new Date(dateString), 'DD/MM/YYYY HH:mm');
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
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
</style>
