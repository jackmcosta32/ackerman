import { io } from 'socket.io-client';
import { envs } from '@/configs/envs.config';

export const socketApiClient = io(envs.VITE_API_URL, {
  transports: ['websocket'],
});
