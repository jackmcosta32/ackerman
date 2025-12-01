import { useAuthQuery } from './use-auth-query';
import { httpApiClient } from '@/data/http/clients';
import type { UseQueryOptions } from '@tanstack/react-query';
import type { User } from '@/features/authentication/models/user.model';

const getProfile = async () => {
  const response = await httpApiClient.request<User>('/users/profile', {
    credentials: 'include',
  });

  return response.json();
};

export const GET_PROFILE_QUERY_KEY = ['getProfile'];

export const useProfile = (options?: UseQueryOptions<User, Error>) => {
  return useAuthQuery({
    queryKey: GET_PROFILE_QUERY_KEY,
    queryFn: getProfile,
    ...options,
  });
};
