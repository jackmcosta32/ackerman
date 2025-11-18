import { httpApiClient } from '@/data/http/clients';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

export interface SignUpParams {
  email: string;
  password: string;
}

const signUp = async (params: SignUpParams) => {
  await httpApiClient.request('/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};

export const SIGN_UP_MUTATION_KEY = ['signUp'];

export const useSignUp = (
  options?: UseMutationOptions<void, Error, SignUpParams>,
) => {
  return useMutation({
    mutationFn: signUp,
    mutationKey: SIGN_UP_MUTATION_KEY,
    ...options,
  });
};
