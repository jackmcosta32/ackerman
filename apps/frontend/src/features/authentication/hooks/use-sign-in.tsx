import {
  signIn,
  type SignInParams,
} from '@/features/authentication/services/sign-in.service';

import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

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
