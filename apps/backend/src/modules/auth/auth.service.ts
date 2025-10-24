import {
  InvalidCredentialsError,
  UserNotAuthenticatableByProvider,
} from './auth.errors';

import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AUTH_PROVIDER } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { User } from '@/modules/users/entities/user.entity';
import type { WithQueryRunner } from '@/types/typeorm.types';
import { UsersService } from '@/modules/users/users.service';
import { Authenticatable } from './entities/authenticatable.entity';
import { UserNotFoundError } from '@/modules/users/users.errors';
import { DataSource, Repository, type SaveOptions } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(Authenticatable)
    private readonly authRepository: Repository<Authenticatable>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  private async create(
    user: User,
    signUpDto: SignUpDto,
    options?: WithQueryRunner<SaveOptions>,
  ): Promise<Authenticatable> {
    const authenticatable = await Authenticatable.fromDto(user, signUpDto, {
      rounds: this.configService.get<number>('PASSWORD_ROUNDS'),
      pepper: this.configService.get<string>('PASSWORD_PEPPER'),
    });

    const repository = options?.queryRunner
      ? options.queryRunner.manager.getRepository(Authenticatable)
      : this.authRepository;

    await repository.save(authenticatable, options);

    return authenticatable;
  }

  async signIn(signInDto: SignInDto): Promise<string> {
    const user = await this.usersService.findOneByEmail(signInDto.email);

    if (!user) {
      throw new UserNotFoundError(signInDto.email);
    }

    const authenticatable = await this.authRepository.findOne({
      where: {
        user: { id: user.id },
        provider: AUTH_PROVIDER.LOCAL,
      },
    });

    if (!authenticatable) {
      throw new UserNotAuthenticatableByProvider(
        signInDto.email,
        AUTH_PROVIDER.LOCAL,
      );
    }

    const hasValidPassword = await authenticatable.validatePassword(
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
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const user = await this.usersService.create(signUpDto, {
        queryRunner,
      });

      await this.create(user, signUpDto, {
        queryRunner,
      });

      await queryRunner.commitTransaction();

      const accessToken = await this.jwtService.signAsync({ id: user.id });

      return accessToken;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
