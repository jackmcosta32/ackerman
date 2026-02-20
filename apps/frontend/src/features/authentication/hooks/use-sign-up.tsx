import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import {
  signUp,
  SIGN_UP_PROVIDER,
  type SignUpParams,
  type LocalSignUpParams,
  type GoogleSignUpParams,
} from '@/features/authentication/services/sign-up.service';

export { SIGN_UP_PROVIDER };
export type { GoogleSignUpParams, LocalSignUpParams, SignUpParams };

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
