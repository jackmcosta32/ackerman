import { envs } from '@/configs/envs.config';
import { HttpFetchClient } from './http-fetch';

export const httpApiClient = new HttpFetchClient({
  baseUrl: envs.VITE_API_URL,
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
});
