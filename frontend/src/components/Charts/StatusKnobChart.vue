<template>
  <div class="status-chart-container">
    <div>
      <q-knob
        :model-value="percentage"
        :color="color"
        :size="size"
        :thickness="thickness"
        :track-color="trackColor"
        :class="knobClass"
        :min="min"
        :max="max"
        readonly
        show-value
        :style="knobStyle"
      >
        <div class="text-center">
          <div class="text-caption text-uppercase">{{ label }}</div>
          <div class="text-subtitle2">{{ count }}</div>
        </div>
      </q-knob>
    </div>

    <div v-if="showAmount" class="text-center">
      <div class="text-caption text-bold" :class="`text-${color}`">
        {{ $t('labels.total') }}: {{ formatCurrency(getStatusTotal()) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';

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

defineOptions({
  name: 'StatusKnob'
});

const props = defineProps({
  status: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: '120px'
  },
  thickness: {
    type: Number,
    default: 0.2
  },
  trackColor: {
    type: String,
    default: 'grey-3'
  },
  knobClass: {
    type: String,
    default: 'q-mx-xs status-knob'
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  marginMultiplier: {
    type: Number,
    default: 5
  },
  label: {
    type: String,
    default: ''
  },
  transactions: {
    type: Array as () => Transaction[],
    default: () => []
  },
  showAmount: {
    type: Boolean,
    default: true
  }
});

const knobStyle = computed(() => {
  return {
    marginTop: `${props.count * props.marginMultiplier}px`
  };
});

const getStatusTotal = () => {
  return props.transactions
    .filter(transaction => transaction.status === props.status)
    .reduce((total, transaction) => total + transaction.amount, 0);
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);
};
</script>

<style scoped lang="scss">
.status-knob {
  position: relative;
  height: 140px !important;
}

.status-chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
