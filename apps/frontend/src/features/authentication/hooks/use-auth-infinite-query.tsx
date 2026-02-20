import {
  useInfiniteQuery,
  type QueryKey,
  type DefaultError,
  type QueryFunction,
  type QueryFunctionContext,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import { HttpError } from '@/data/http/http-error';
import { HTTP_STATUS } from '@/data/http/http-protocol';
import { refreshSessionTokens } from '@/features/authentication/services/refresh-session-tokens.service';

const handleInfiniteQueryFn = async <
  TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
>(
  queryFn: QueryFunction<TQueryFnData, TQueryKey, TPageParam>,
  context: QueryFunctionContext<TQueryKey, TPageParam>,
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

export const useAuthInfiniteQuery = <
  TQueryFnData,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
>(
  options: UseInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >,
) => {
  return useInfiniteQuery<TQueryFnData, TError, TData, TQueryKey, TPageParam>({
    ...options,
    queryFn: (ctx) =>
      handleInfiniteQueryFn<TQueryFnData, TQueryKey, TPageParam>(
        options.queryFn as never,
        ctx,
      ),
  });
};
