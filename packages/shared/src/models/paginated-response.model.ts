export interface PaginationMetadata {
  totalRecords: number;
  currentPage: number;
  previousPage: number | null;
  nextPage?: number | null;
  totalPages: number;
  pageSize: number;
}

export interface PaginatedRequest {
  limit?: number;
  page?: number;
}

export interface PaginatedResponse<TData> {
  pagination: PaginationMetadata;
  data: TData[];
}
