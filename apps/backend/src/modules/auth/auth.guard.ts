import { Request } from 'express';
import { AuthService } from './auth.service';
import { ACCESS_TOKEN_COOKIE } from '@/constants/cookies.constant';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromCookies(request: Request): string | undefined {
    const cookies = request.cookies as Record<string, string | undefined>;

    return cookies[ACCESS_TOKEN_COOKIE];
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const headerAccessToken = this.extractTokenFromHeader(request);
    const cookieAccessToken = this.extractTokenFromCookies(request);

    const token = headerAccessToken ?? cookieAccessToken;

    request['user'] = await this.authService.validateToken(token);

    return true;
  }
}
