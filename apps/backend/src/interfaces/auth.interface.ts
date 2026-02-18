import type { Request } from 'express';
import type { Socket } from 'socket.io';
import { Role } from '@/constants/roles.constant';

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
