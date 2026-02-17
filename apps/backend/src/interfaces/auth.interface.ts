import type { Request } from 'express';
import { Role } from '@/constants/roles.constant';
import type { Socket } from 'node_modules/socket.io/dist/socket';

export interface AuthPayload {
  id: string;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user: AuthPayload;
  role?: Role;
}

export interface AuthenticatedSocket extends Socket {
  data: {
    user: AuthPayload;
  };
}
