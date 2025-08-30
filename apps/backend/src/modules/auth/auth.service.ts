import {
  UserNotFoundError,
  InvalidCredentialsError,
  UserNotAuthenticableByProvider,
} from './auth.errors';

import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AUTH_PROVIDER } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/modules/users/users.service';
import { Authenticable } from './entities/authenticable.entity';
import { CreateAuthenticableDto } from './dto/create-authenticable.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Authenticable)
    private readonly authRepository: Repository<Authenticable>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  private async create(
    createAuthenticableDto: CreateAuthenticableDto,
  ): Promise<Authenticable> {
    const authenticable = await Authenticable.fromDto(createAuthenticableDto, {
      rounds: this.configService.get<number>('PASSWORD_ROUNDS'),
      pepper: this.configService.get<string>('PASSWORD_PEPPER'),
    });

    await this.authRepository.save(authenticable);

    return authenticable;
  }

  async signIn(signInDto: SignInDto): Promise<string> {
    const user = await this.usersService.findOneByEmail(signInDto.email);

    if (!user) {
      throw new UserNotFoundError(signInDto.email);
    }

    const authenticable = await this.authRepository.findOne({
      where: {
        userId: user.id,
        provider: AUTH_PROVIDER.LOCAL,
      },
    });

    if (!authenticable) {
      throw new UserNotAuthenticableByProvider(
        signInDto.email,
        AUTH_PROVIDER.LOCAL,
      );
    }

    const hasValidPassword = await authenticable?.validatePassword(
      signInDto.password,
      {
        pepper: this.configService.get<string>('PASSWORD_PEPPER'),
      },
    );

    if (!hasValidPassword) {
      throw new InvalidCredentialsError();
    }

    const accessToken = await this.jwtService.signAsync({ id: user.id });

    return accessToken;
  }

  async signUp(signUpDto: SignUpDto): Promise<string> {
    const user = await this.usersService.create(signUpDto);

    await this.create({
      userId: user.id,
      provider: AUTH_PROVIDER.LOCAL,
    });

    const accessToken = await this.jwtService.signAsync({ id: user.id });

    return accessToken;
  }
}
