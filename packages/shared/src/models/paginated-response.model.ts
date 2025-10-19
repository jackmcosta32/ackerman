export interface PaginatedResponse<TData> {
  data: TData[];
  pageSize: number;
  totalPages: number;
  currentPage: number;
  totalRecords: number;
  nextPage: number | null;
  previousPage: number | null;
}
