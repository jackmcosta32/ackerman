import { cache } from 'react';
import { httpApiClient } from '@/data/http/clients';

export const refreshSessionTokens = cache(async (options?: RequestInit) => {
  const response = await httpApiClient.request('/auth/refresh', {
    credentials: 'include',
    ...options,
  });

  return response.json();
});
