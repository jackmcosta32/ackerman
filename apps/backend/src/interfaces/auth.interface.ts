export interface AuthPayload {
  id: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthPayload;
}
