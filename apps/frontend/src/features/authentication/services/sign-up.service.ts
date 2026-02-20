import { httpApiClient } from '@/data/http/clients';

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

export const signUp = async (params: SignUpParams) => {
  await httpApiClient.request('/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};
