import { BaseMocker } from './base.mocker';
import type { PaginatedResponse } from '@workspace/shared';

export class PaginatedResponseMocker<TData> extends BaseMocker<
  PaginatedResponse<TData>
> {
  constructor(private dataMocker: BaseMocker<TData>) {
    super();
  }

  protected get model(): PaginatedResponse<TData> {
    const limit = 10;
    const total = 100;
    const page = this.factory.number.int({ min: 1 });
    const maxPage = Math.ceil(total / limit);
    const quantity = Math.min(limit, total - (page - 1) * limit);

    return {
      data: this.dataMocker.mockMany(quantity),
      pageSize: limit,
      totalPages: maxPage,
      currentPage: page,
      nextPage: Math.min(page + 1, maxPage),
      previousPage: Math.max(page - 1, 1),
      totalRecords: total,
    };
  }
}
