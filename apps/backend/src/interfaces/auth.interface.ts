import type { Socket } from 'node_modules/socket.io/dist/socket';

export interface AuthPayload {
  id: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthPayload;
}

export interface AuthenticatedSocket extends Socket {
  data: {
    user: AuthPayload;
  };
}
