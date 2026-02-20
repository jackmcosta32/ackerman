import {
  useMutation,
  type DefaultError,
  type MutationFunction,
  type MutationFunctionContext,
  type UseMutationOptions,
} from '@tanstack/react-query';

import { HttpError } from '@/data/http/http-error';
import { HTTP_STATUS } from '@/data/http/http-protocol';
import { refreshSessionTokens } from '@/features/authentication/services/refresh-session-tokens.service';

const handleMutationFn = async <TData, TVariables>(
  mutationFn: MutationFunction<TData, TVariables>,
  variables: TVariables,
  context: MutationFunctionContext,
): Promise<TData> => {
  try {
    return await mutationFn(variables, context);
  } catch (error) {
    if (
      error instanceof HttpError &&
      error.status === HTTP_STATUS.UNAUTHORIZED
    ) {
      await refreshSessionTokens();
      return mutationFn(variables, context);
    }

    throw error;
  }
};

export const useAuthMutation = <
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
) => {
  return useMutation<TData, TError, TVariables, TContext>({
    ...options,
    mutationFn: (variables, context) =>
      handleMutationFn<TData, TVariables>(
        options.mutationFn as never,
        variables,
        context,
      ),
  });
};
