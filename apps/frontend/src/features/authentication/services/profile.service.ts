import { httpApiClient } from '@/data/http/clients';
import type { User } from '@/features/authentication/models/user.model';

export const getProfile = async () => {
  const response = await httpApiClient.request<User>('/users/profile', {
    credentials: 'include',
  });

  return response.json();
};
