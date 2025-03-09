import { ref } from 'vue';

export function useDataTableManager(initialPage = 1, initialPerPage = 7) {
  const page = ref<number>(initialPage);
  const perPage = ref<number>(initialPerPage);
  const totalItems = ref<number>(0);
  const loading = ref<boolean>(false);

  // Funzione per cambiare la pagina corrente
  const setPage = (newPage: number) => {
    page.value = newPage;
  };

  // Funzione per cambiare il numero di elementi per pagina e resettare la pagina corrente
  const setPerPage = (newPerPage: number) => {
    perPage.value = newPerPage;
    page.value = initialPage; // Resetta la pagina alla prima quando cambia perPage
  };

  // Funzione per aggiornare il totale degli elementi (ad es. dopo una chiamata API)
  const setTotalItems = (newTotal: number) => {
    totalItems.value = newTotal;
  };

  // Definizione dell'interfaccia per la paginazione
  interface PaginationParams {
    pagination?: {
      page?: number;
      rowsPerPage?: number;
    };
  }

  // Gestione della richiesta della datatable (es. al cambio pagina o perPage)
  const handleRequest = (params: PaginationParams) => {
    if (params.pagination) {
      if (params.pagination.page !== undefined) {
        setPage(params.pagination.page);
      }
      if (params.pagination.rowsPerPage !== undefined) {
        setPerPage(params.pagination.rowsPerPage);
      }
    }
  };

  return {
    page,
    perPage,
    totalItems,
    loading,
    setPage,
    setPerPage,
    setTotalItems,
    handleRequest,
  };
}
