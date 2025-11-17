export type Values<TRecord> = TRecord[keyof TRecord];

export type Literal<TValue extends string | number> = TValue extends number
  ? number
  : (string & {}) | TValue;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;

export const HTTP_METHOD = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

export type HttpHeader = Record<string, string>;

export type HttpMethod = Literal<Values<typeof HTTP_METHOD>>;

export type HttpStatus = Literal<Values<typeof HTTP_STATUS>>;

export interface HttpResponse<TData = Response> extends Response {
  json(): Promise<TData>;
}

export interface HttpClient {
  readonly baseUrl?: string;
  readonly defaultHeaders?: HttpHeader;
  request: (input: string | URL, init?: RequestInit) => Promise<HttpResponse>;
}
