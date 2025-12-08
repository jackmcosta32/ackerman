import {
  HTTP_STATUS,
  type HttpClient,
  type HttpHeader,
  type HttpResponse,
} from './http-protocol';

import { HttpError } from './http-error';
import type { ErrorResponse } from '@workspace/shared';

export interface HttpClientConstructor {
  baseUrl?: string;
  defaultHeaders?: HttpHeader;
}

export class HttpFetchClient implements HttpClient {
  baseUrl?: string;
  defaultHeaders?: HttpHeader | undefined;

  constructor(params: HttpClientConstructor) {
    this.baseUrl = params.baseUrl;
    this.defaultHeaders = params.defaultHeaders;
  }

  private parseHeaders(headers?: HeadersInit): HeadersInit {
    const requestHeaders = new Headers({
      ...this.defaultHeaders,
      ...headers,
    });

    return Object.fromEntries(requestHeaders.entries());
  }

  async request<TData, TError = ErrorResponse>(
    input: string | URL,
    init?: RequestInit,
  ): Promise<HttpResponse<TData>> {
    const requestUrl = new URL(input, this.baseUrl);
    const requestHeaders = this.parseHeaders(init?.headers);
    const requestInit = { ...init, headers: requestHeaders };

    const response = await fetch(requestUrl, requestInit);
    const responseStatus = response.status ?? HTTP_STATUS.SERVER_ERROR;
    const responseMessage = response.statusText;

    if (!response.ok) {
      throw new HttpError<TError>({
        response,
        request: requestInit,
        status: responseStatus,
        message: responseMessage,
      });
    }

    return response;
  }
}
