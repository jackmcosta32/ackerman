import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/modules/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<string> {
    const user = await this.usersService.findOneByEmail(signInDto.email);

    const hasValidPassword = await user?.validatePassword(signInDto.password, {
      pepper: this.configService.get<string>('JWT_SECRET'),
    });

    if (!user || !hasValidPassword) {
      throw new UnauthorizedException();
    }

    const accessToken = await this.jwtService.signAsync({ id: user.id });

    return accessToken;
  }

  async signUp(signUpDto: SignUpDto): Promise<string> {
    const user = await this.usersService.create(signUpDto);

    const accessToken = await this.jwtService.signAsync({ id: user.id });

    return accessToken;
  }
}
