<template>
  <ModalCustom
    :model-value="isOpen"
    @update:model-value="$emit('update:isOpen', $event)"
    position="right"
    full-height
    width="400px"
    :title="$t('transaction.details')"
    :maximized="$q.screen.lt.sm"
  >
    <div v-if="transaction" class="q-py-sm">
      <q-img
        :src="transaction.image"
        class="transaction-detail-image q-mb-md"
      />

      <div class="text-h5 text-weight-bold q-mb-sm">{{ transaction.transactionName }}</div>

      <q-list separator>
        <q-item>
          <q-item-section>
            <q-item-label caption>{{ $t('transaction.amount') }}</q-item-label>
            <q-item-label class="text-weight-medium">{{ transaction.amount.toFixed(2) }}€</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label caption>{{ $t('transaction.status') }}</q-item-label>
            <q-item-label>
              <q-badge :color="getStatusColor(transaction.status)">
                {{ $t(`status.${transaction.status.toLowerCase()}`) }}
              </q-badge>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label caption>{{ $t('transaction.user') }}</q-item-label>
            <q-item-label>{{ transaction.userName }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label caption>{{ $t('transaction.date') }}</q-item-label>
            <q-item-label>{{ formatDate(transaction.date) }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label caption>{{ $t('transaction.description') }}</q-item-label>
            <q-item-label>{{ transaction.description }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <div v-if="transaction.status === 'completed'">
        <q-separator class="q-my-md" />
        <div class="text-subtitle1 text-weight-medium q-mb-sm">{{ $t('transaction.receipt') }}</div>
        <div class="pdf-container relative-position">
          <q-spinner v-if="isLoadingPdf" color="primary" size="3em" class="absolute-center" />
          <iframe
            v-else
            :src="receiptUrl"
            class="receipt-frame"
            frameborder="0"
            title="Receipt PDF preview"
          ></iframe>
          <div class="pdf-overlay">
            <q-btn
              flat
              round
              color="white"
              icon="download"
              class="overlay-download-btn"
              @click="downloadReceipt"
              v-tooltip="$t('actions.download')"
            />
          </div>
        </div>
      </div>
    </div>
  </ModalCustom>
</template>

<script setup lang="ts">
import { date } from 'quasar';
import ModalCustom from '@/components/Modals/ModalCustom.vue';
import { ref, onMounted } from 'vue';

defineOptions({
  name: 'TransactionDetailsSidebar'
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
  isOpen: {
    type: Boolean,
    required: true
  },
  transaction: {
    type: Object as () => Transaction | undefined,
    required: true
  }
});

defineEmits(['update:isOpen']);

const isLoadingPdf = ref(true);
const receiptUrl = ref(new URL('@/assets/pdf/receipt.pdf', import.meta.url).href);

const formatDate = (dateString: string) => {
  return date.formatDate(new Date(dateString), 'DD/MM/YYYY - HH:mm');
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

const downloadReceipt = () => {
  const link = document.createElement('a');
  link.href = receiptUrl.value;
  link.setAttribute('download', `receipt-${props.transaction?.id}.pdf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

onMounted(() => {
  // Simulate PDF loading
  setTimeout(() => {
    isLoadingPdf.value = false;
  }, 800);
});
</script>

<style lang="scss" scoped>
.transaction-sidebar {
  width: 400px;
  max-width: 100vw;
  height: 100%;
}

.transaction-detail-image {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.pdf-container {
  position: relative;
  width: 100%;
  height: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;

  .pdf-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }

  &:hover .pdf-overlay {
    opacity: 1;
    pointer-events: auto;
  }

  .overlay-download-btn {
    background: rgba(0, 0, 0, 0.6);
    &:hover {
      background: rgba(0, 0, 0, 0.8);
    }
  }
}

.receipt-frame {
  width: 100%;
  height: 100%;
}

@media (max-width: 599px) {
  .transaction-sidebar {
    width: 100%;
  }
}
</style>
