import { httpApiClient } from '@/data/http/clients';
import type { QueryFunctionContext } from '@tanstack/react-query';

export const refreshSessionTokens = async (context: QueryFunctionContext) => {
  const response = await httpApiClient.request('/auth/refresh', {
    credentials: 'include',
    signal: context.signal,
  });

  return response.json();
};
