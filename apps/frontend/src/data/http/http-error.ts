import type { ErrorResponse } from '@workspace/shared';
import type { HttpStatus, HttpResponse } from './http-protocol';

export class HttpError<TData = ErrorResponse> extends Error {
  public status: HttpStatus;
  public response: HttpResponse<TData>;
  public request: RequestInit;

  constructor(params: {
    message?: string;
    status: HttpStatus;
    response: HttpResponse<TData>;
    request: RequestInit;
  }) {
    super(params.message);

    this.name = 'HttpError';
    this.status = params.status;
    this.request = params.request;
    this.response = params.response;
  }
}
