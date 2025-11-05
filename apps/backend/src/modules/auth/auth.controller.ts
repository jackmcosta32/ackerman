import {
  Res,
  Get,
  Req,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Controller,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';

import {
  InvalidCredentialsError,
  UserNotAuthenticatableByProvider,
} from './auth.errors';

import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from '@/constants/cookies.constant';

import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { UserAlreadyExistsError } from '@/modules/users/users.errors';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    try {
      const { accessToken, refreshToken } =
        await this.authService.signIn(signInDto);

      res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: this.configService.getOrThrow<number>(
          'JWT_ACCESS_TOKEN_COOKIE_EXPIRATION_TIME',
        ),
      });

      res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        path: '/auth/refresh',
        maxAge: this.configService.getOrThrow<number>(
          'JWT_REFRESH_TOKEN_COOKIE_EXPIRATION_TIME',
        ),
      });

      return res.send({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (error instanceof UserNotAuthenticatableByProvider) {
        throw new UnauthorizedException(
          'No linked account found for this provider',
        );
      }

      throw error;
    }
  }

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    try {
      await this.authService.signUp(signUpDto);
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException('User already exists');
      }

      throw error;
    }
  }

  @Get('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      const previousRefreshToken = req.cookies[REFRESH_TOKEN_COOKIE] as string;

      const { accessToken, refreshToken } =
        await this.authService.refresh(previousRefreshToken);

      res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: this.configService.getOrThrow<number>(
          'JWT_ACCESS_TOKEN_COOKIE_EXPIRATION_TIME',
        ),
      });

      res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        path: '/auth/refresh',
        maxAge: this.configService.getOrThrow<number>(
          'JWT_REFRESH_TOKEN_COOKIE_EXPIRATION_TIME',
        ),
      });

      return res.send({
        accessToken,
        refreshToken,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @Get('sign-out')
  signOut(@Res() res: Response) {
    res.clearCookie(ACCESS_TOKEN_COOKIE);
    res.clearCookie(REFRESH_TOKEN_COOKIE);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }
}
