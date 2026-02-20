import { httpApiClient } from '@/data/http/clients';

export const refreshSessionTokens = async (options?: RequestInit) => {
  const response = await httpApiClient.request('/auth/refresh', {
    credentials: 'include',
    ...options,
  });

  return response.json();
};
