import { ref, computed } from 'vue';

interface Pagination {
  page: number;
  rowsPerPage: number;
  rowsNumber?: number;
}

interface TableRow {
  [key: string]: unknown;
}

export function useDataTable() {
  const loading = ref(false);
  const pagination = ref<Pagination>({ page: 1, rowsPerPage: 7 });
  const rows = ref<TableRow[]>([]);
  const totalRows = ref(0);

  const setRows = (newRows: TableRow[]) => {
    rows.value = newRows;
  };

  const setTotalRows = (total: number) => {
    totalRows.value = total;
  };

  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading;
  };

  const handlePaginationChange = (newPagination: Pagination) => {
    pagination.value = newPagination;
  };

  return {
    loading: computed(() => loading.value),
    pagination: computed(() => pagination.value),
    rows: computed(() => rows.value),
    totalRows: computed(() => totalRows.value),
    setRows,
    setTotalRows,
    setLoading,
    handlePaginationChange,
  };
}
