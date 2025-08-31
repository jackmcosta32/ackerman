import {
  Res,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  Controller,
} from '@nestjs/common';

import type { Response } from 'express';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ConfigService } from '@nestjs/config';
import { NODE_ENV } from 'src/constants/configs.constant';
import { ACCESS_TOKEN_COOKIE } from 'src/constants/cookies.constant';
import { ONE_MINUTE } from '@workspace/shared/constants/time.constant';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private setAuthCookies(res: Response, accessToken: string) {
    const secure = this.configService.get(NODE_ENV) === 'production';

    res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
      secure: secure,
      httpOnly: true,
      maxAge: 15 * ONE_MINUTE,
      sameSite: 'strict',
    });
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = await this.authService.signIn(signInDto);

    this.setAuthCookies(res, accessToken);

    return { accessToken };
  }

  @Post('sign-up')
  @HttpCode(HttpStatus.OK)
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = await this.authService.signUp(signUpDto);

    this.setAuthCookies(res, accessToken);

    return { accessToken };
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(ACCESS_TOKEN_COOKIE);

    return { message: 'Signed out successfully' };
  }
}
