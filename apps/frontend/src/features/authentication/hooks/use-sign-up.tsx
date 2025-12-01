import { httpApiClient } from '@/data/http/clients';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

export enum SIGN_UP_PROVIDER {
  LOCAL = 'local',
  GOOGLE = 'google',
}

export interface GoogleSignUpParams {
  email: string;
  provider: SIGN_UP_PROVIDER.GOOGLE;
}

export interface LocalSignUpParams {
  name: string;
  email: string;
  password: string;
  provider: SIGN_UP_PROVIDER.LOCAL;
}

export type SignUpParams = GoogleSignUpParams | LocalSignUpParams;

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
