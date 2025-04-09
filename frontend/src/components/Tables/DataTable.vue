<template>
  <div class="table-container">
    <q-table
      style="border-radius: 24px; min-height: 436px"
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

      <template v-slot:body="props">
        <q-tr :props="props" @click="showRowDetails(props.row)" class="cursor-pointer hover-highlight">
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            :style="{
              width: col.width ? `${col.width}px!important` : '150px',
              maxWidth: col.width ? `${col.width}px!important` : '150px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }"
          >
            {{ col.value }}
          </q-td>
        </q-tr>
      </template>

      <slot></slot>
    </q-table>

    <UserModal v-if="props.modalUserInfo" v-model="showModal" :row-data="selectedRow" :isRegistration="false"/>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue';
import { useDataTable } from '@/composables/useDataTable';
import { QTableColumn } from 'quasar';
import UserModal from '@/components/Modals/components/UserModal.vue';

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
  modalUserInfo?: boolean;
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

const showModal = ref(false);
const selectedRow = ref<TableRow | null>(null);

const showRowDetails = (row: TableRow) => {
  selectedRow.value = row;
  showModal.value = true;
};

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
