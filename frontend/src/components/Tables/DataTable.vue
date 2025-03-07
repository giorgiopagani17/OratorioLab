<template>
  <div class="table-container">
    <q-table
      style="border-radius: 24px; min-height: 436px"
      class="q-mt-lg"
      :rows="props.rows"
      :columns="props.columns"
      :row-key="props.rowKey"
      flat
      bordered
      virtual-scroll
      :rows-per-page-options="props.rowsPerPageOptions"
      :rows-per-page-label="$t(props.rowsPerPageLabel || 'labels.recordsPerPage')"
      :pagination="props.pagination"
      :loading="props.loading"
      @update:pagination="handlePaginationChange"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>

      <template v-slot:header-cell="slotProps">
        <q-th
          :props="slotProps"
          class="bg-secondary text-white"
          style="font-size: 15px; font-weight: bold;"
        >
          {{ slotProps.col.label }}
        </q-th>
      </template>

      <template v-slot:no-data>
        <div class="full-width row flex-center">
          {{ $t(props.noDataMessage || 'errors.noUserFound') }}
        </div>
      </template>

      <template v-slot:body-cell="slotProps">
        <q-td :props="slotProps">
          {{ slotProps.value }}
        </q-td>
      </template>

      <slot></slot>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { QTableColumn } from 'quasar';

interface Pagination {
  page: number;
  rowsPerPage: number;
  rowsNumber?: number;
}

interface TableRow {
  [key: string]: unknown;
}

const props = withDefaults(defineProps<{
  rows: TableRow[];
  columns: QTableColumn[];
  rowKey: string;
  pagination: Pagination;
  rowsPerPageOptions?: number[];
  rowsPerPageLabel?: string;
  noDataMessage?: string;
  loading?: boolean;
}>(), {
  rowsPerPageOptions: () => [7, 15, 30, 50],
  rowsPerPageLabel: 'labels.recordsPerPage',
  noDataMessage: 'errors.noUserFound',
});

const emit = defineEmits<{
  (e: 'update:pagination', pagination: Pagination): void;
  (e: 'request-data', pagination: Pagination): void;
}>();

const handlePaginationChange = (newPagination: Pagination) => {
  emit('update:pagination', newPagination);
  emit('request-data', newPagination);
};
</script>

<style lang="scss" scoped>
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
    th:nth-child(2) { width: 10%; }
    th:nth-child(3) { width: 15%; }
    th:nth-child(4) { width: 15%; }
    th:nth-child(5) { width: 35%; }
  }
}
</style>
