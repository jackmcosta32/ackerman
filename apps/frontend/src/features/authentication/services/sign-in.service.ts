import { httpApiClient } from '@/data/http/clients';

export interface SignInParams {
  email: string;
  password: string;
}

export const signIn = async (params: SignInParams) => {
  await httpApiClient.request('/auth/sign-in', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(params),
  });
};
