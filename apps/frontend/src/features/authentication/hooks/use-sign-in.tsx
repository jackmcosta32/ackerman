import { httpApiClient } from '@/data/http/clients';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

export interface SignInParams {
  email: string;
  password: string;
}

const signIn = async (params: SignInParams) => {
  await httpApiClient.request('/auth/sign-in', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};

export const SIGN_IN_MUTATION_KEY = ['signIn'];

export const useSignIn = (
  options?: UseMutationOptions<void, Error, SignInParams>,
) => {
  return useMutation({
    mutationFn: signIn,
    mutationKey: SIGN_IN_MUTATION_KEY,
    ...options,
  });
};
