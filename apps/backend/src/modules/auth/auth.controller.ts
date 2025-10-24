import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto) {
    const accessToken = await this.authService.signIn(signInDto);

    return { accessToken };
  }

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
}
