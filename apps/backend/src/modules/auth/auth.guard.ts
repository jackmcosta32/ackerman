import { Injectable } from '@nestjs/common';
import { JwtAuthGuard } from './strategies/jwt/jwt-auth.guard';

@Injectable()
export class AuthGuard extends JwtAuthGuard {}
