import type {
  AuthenticatedSocket,
  AuthenticatedRequest,
} from '@/modules/auth/interfaces/auth.interface';

import {
  extractTokenFromWebSocket,
  extractTokenFromHttpRequest,
} from './jwt.utils';

import { AuthService } from '@/modules/auth/auth.service';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextType = context.getType();

    if (contextType === 'ws') {
      const socket = context.switchToWs().getClient<AuthenticatedSocket>();
      const token = extractTokenFromWebSocket(socket);

      socket.data.user = await this.authService.validateToken(token);
    } else if (contextType === 'http') {
      const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
      const token = extractTokenFromHttpRequest(request);

      request.user = await this.authService.validateToken(token);
    }

    return true;
  }
}
