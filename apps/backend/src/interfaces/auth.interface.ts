import type { Request } from 'express';
import type { Socket } from 'socket.io';
import { UserRole } from '@workspace/shared/constants/user.constant';

export interface AuthPayload {
  id: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user: AuthPayload;
  role?: UserRole;
}

export interface AuthenticatedSocket extends Socket {
  data: {
    user: AuthPayload;
  };
}
