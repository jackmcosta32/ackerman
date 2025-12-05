import type { HttpStatus } from './http-protocol';

export class HttpError extends Error {
  public status: HttpStatus;
  public response: Response;
  public request: RequestInit;

  constructor(params: {
    message?: string;
    status: HttpStatus;
    response: Response;
    request: RequestInit;
  }) {
    super(params.message);

    this.name = 'HttpError';
    this.status = params.status;
    this.request = params.request;
    this.response = params.response;
  }
}
