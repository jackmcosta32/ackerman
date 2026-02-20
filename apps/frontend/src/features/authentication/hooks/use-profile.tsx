import { useAuthQuery } from './use-auth-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import type { User } from '@/features/authentication/models/user.model';
import { getProfile } from '@/features/authentication/services/profile.service';

export const GET_PROFILE_QUERY_KEY = ['getProfile'];

export const useProfile = (options?: UseQueryOptions<User, Error>) => {
  return useAuthQuery({
    queryKey: GET_PROFILE_QUERY_KEY,
    queryFn: getProfile,
    ...options,
  });
};
