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
      :pagination="pagination"
      :loading="tableLoading"
      @update:pagination="handlePaginationChange"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>

      <template v-slot:header-cell="slotProps">
        <q-th
          :props="slotProps"
          class="bg-secondary text-white"
          :style="{
            fontSize: '15px',
            fontWeight: 'bold',
            width: slotProps.col.width ? `${slotProps.col.width}px!important` : '150px'
          }"
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
        <q-td
          :props="slotProps"
          :style="{
            width: slotProps.col.width ? `${slotProps.col.width}px!important` : '150px',
            maxWidth: slotProps.col.width ? `${slotProps.col.width}px!important` : '150px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }"
        >
          {{ slotProps.value }}
        </q-td>
      </template>

      <slot></slot>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useDataTable } from '@/composables/useDataTable';
import { QTableColumn } from 'quasar';

interface TableRow {
  [key: string]: unknown;
}

const props = withDefaults(defineProps<{
  rows: TableRow[];
  columns: QTableColumn[];
  rowKey: string;
  rowsPerPageOptions?: number[];
  rowsPerPageLabel?: string;
  noDataMessage?: string;
  loading?: boolean;
}>(), {
  rowsPerPageOptions: () => [15, 30, 50],
  rowsPerPageLabel: 'labels.recordsPerPage',
  noDataMessage: 'errors.noUserFound',
});

const {
  loading: tableLoading,
  pagination,
  handlePaginationChange,
  setRows,
} = useDataTable();

watch(() => props.rows, (newRows: TableRow[]) => {
  setRows(newRows);
}, { immediate: true });
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
}

:deep(.q-table th),
:deep(.q-table td) {
  width: auto;
}

:deep(.q-table tbody td) {
  max-width: none;
}
</style>
