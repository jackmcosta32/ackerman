import {
  useQuery,
  type QueryKey,
  type DefaultError,
  type QueryFunction,
  type UseQueryOptions,
  type QueryFunctionContext,
} from '@tanstack/react-query';

import { HttpError } from '@/data/http/http-error';
import { httpApiClient } from '@/data/http/clients';
import { HTTP_STATUS } from '@/data/http/http-protocol';

const refreshSessionTokens = async (context: QueryFunctionContext) => {
  const response = await httpApiClient.request('/auth/refresh', {
    credentials: 'include',
    signal: context.signal,
  });

  return response.json();
};

const handleQueryFn = async <
  TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  context: QueryFunctionContext<TQueryKey>,
): Promise<TQueryFnData> => {
  try {
    return await queryFn(context);
  } catch (error) {
    if (
      error instanceof HttpError &&
      error.status === HTTP_STATUS.UNAUTHORIZED
    ) {
      await refreshSessionTokens(context);
      return queryFn(context);
    }

    throw error;
  }
};

export const useAuthQuery = <
  TQueryFnData,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
) => {
  return useQuery<TQueryFnData, TError, TData, TQueryKey>({
    ...options,
    queryFn: (ctx) => handleQueryFn(options.queryFn as never, ctx),
  });
};
