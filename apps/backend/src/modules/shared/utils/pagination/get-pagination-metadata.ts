import type { PaginationMetadata } from '@workspace/shared';

export interface GetPaginationMetadataParams {
  pageSize: number;
  currentPage: number;
  totalRecords: number;
}

export const getPaginationMetadata = (
  params?: GetPaginationMetadataParams,
): PaginationMetadata => {
  const { pageSize = 1, currentPage = 0, totalRecords = 0 } = params ?? {};

  const nextPage = currentPage + 1;
  const previousPage = currentPage - 1;
  const totalPages = Math.ceil(totalRecords / pageSize);

  return {
    pageSize,
    totalPages,
    currentPage,
    totalRecords,
    nextPage: nextPage <= totalPages - 1 ? nextPage : null,
    previousPage: previousPage >= 0 ? previousPage : null,
  };
};
