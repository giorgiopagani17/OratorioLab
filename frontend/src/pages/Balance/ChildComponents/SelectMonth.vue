+<template>
  <div class="full-width">
    <div class="row no-wrap q-px-md overflow-auto full-width"
         ref="monthsContainer"
         style="scroll-snap-type: x mandatory;">
      <q-btn
        flat
        round
        dense
        icon="chevron_left"
        @click="scrollLeft"
        class="q-mr-sm self-center"
        :disable="offset <= 0"
      />

      <div class="row no-wrap justify-between full-width">
        <div
          v-for="(month, index) in displayedMonths"
          :key="index"
          class="month-button q-pa-sm cursor-pointer"
          :class="{
            'selected-month': month.index === selectedMonth,
            'text-grey': month.isFuture,
            'month-btn-active': month.index === selectedMonth
          }"
          :style="{ opacity: month.isFuture ? 0.5 : 1 }"
          @click="selectMonth(month.index)"
        >
          <div class="text-center">
            <span :class="{ 'font-weight-bold': month.index === selectedMonth }">
              {{ $t('calendar.months.' + month.name.toLowerCase()).substring(0, 3) }}<br/> {{ month.year }}
            </span>
          </div>
        </div>
      </div>

      <q-btn
        flat
        round
        dense
        icon="chevron_right"
        @click="scrollRight"
        class="q-ml-sm self-center"
        :disable="offset + visibleMonthsCount >= months.length"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

defineOptions({
  name: 'SelectMonth'
});

const emit = defineEmits<{
  (e: 'month-selected', monthData: {name: string, year: number, index: number, isFuture: boolean, monthIndex: number}): void
}>();

const startDate = new Date('2023-01-01');
const currentDate = new Date();

const months = ref<Array<{name: string, year: number, index: number, isFuture: boolean, monthIndex: number}>>([]);
const monthNames = ['january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'];

const generateMonths = () => {
  const result = [];
  let index = 0;

  const tempDate = new Date(startDate);
  while (tempDate <= currentDate) {
    const monthIndex = tempDate.getMonth();
    const year = tempDate.getFullYear();

    result.push({
      name: monthNames[monthIndex],
      year: year,
      index: index,
      isFuture: tempDate > currentDate,
      monthIndex: monthIndex,
    });

    index++;
    tempDate.setMonth(tempDate.getMonth() + 1);
  }

  return result;
};

months.value = generateMonths();

const selectedMonth = ref(months.value.length - 1);

const offset = ref(0);
const visibleMonthsCount = ref(5);
const monthsContainer = ref<HTMLElement | null>(null);

const displayedMonths = computed(() => {
  return months.value.slice(offset.value, offset.value + visibleMonthsCount.value);
});

const scrollLeft = () => {
  if (offset.value > 0) {
    offset.value--;
  }
};

const scrollRight = () => {
  if (offset.value + visibleMonthsCount.value < months.value.length) {
    offset.value++;
  }
};

const selectMonth = (index: number) => {
  selectedMonth.value = index;

  if (index < offset.value) {
    offset.value = index;
  } else if (index >= offset.value + visibleMonthsCount.value) {
    offset.value = index - visibleMonthsCount.value + 1;
  }

  emit('month-selected', months.value[index]);
};

onMounted(() => {
  if (monthsContainer.value) {
    const containerWidth = monthsContainer.value.clientWidth;

    visibleMonthsCount.value = Math.floor(containerWidth / 80) - 2;

    if (containerWidth < 400) {
      visibleMonthsCount.value = Math.max(2, visibleMonthsCount.value);
    } else {
      visibleMonthsCount.value = Math.max(3, visibleMonthsCount.value);
    }

    visibleMonthsCount.value = Math.min(visibleMonthsCount.value, 12);
  }

  if (selectedMonth.value >= visibleMonthsCount.value) {
    offset.value = selectedMonth.value - visibleMonthsCount.value + 1;
  }

  emit('month-selected', months.value[selectedMonth.value]);
});
</script>

<style scoped>
.month-button {
  flex: 1;
  min-width: 70px;
  border-radius: 8px;
  transition: all 0.3s;
  margin: 0 4px;
}

.month-button:hover:not(.selected-month) {
  background: #e0e0e0;
}

.month-btn-active {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.selected-month {
  background-color: var(--q-primary);
  color: white;
}

.font-weight-bold {
  font-weight: bold !important;
}
</style>
