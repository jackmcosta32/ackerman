import {
  AUTH_PROVIDER,
  AuthenticatableDto,
  type AuthProvider,
} from '@/modules/auth/dto/auth.dto';

import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import bcrypt from 'bcrypt';
import { SignUpDto } from '@/modules/auth/dto/sign-up.dto';
import { User } from '@/modules/users/entities/user.entity';

const DEFAULT_ROUNDS = 10;

export interface HashPasswordOptions {
  pepper?: string;
  rounds?: number;
}

export interface ValidatePasswordOptions {
  pepper?: string;
}

@Entity()
export class Authenticatable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  passwordHash?: string;

  @Column({ enum: AUTH_PROVIDER, default: AUTH_PROVIDER.LOCAL })
  provider: AuthProvider;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  static async hashPassword(
    plainPassword: string,
    options?: HashPasswordOptions,
  ): Promise<string> {
    const { pepper, rounds = DEFAULT_ROUNDS } = options || {};
    const password = pepper ? pepper + plainPassword : plainPassword;

    return bcrypt.hash(password, rounds);
  }

  async validatePassword(
    plainPassword: string,
    options?: ValidatePasswordOptions,
  ): Promise<boolean> {
    if (!this.passwordHash) return false;

    const { pepper } = options || {};
    const password = pepper ? pepper + plainPassword : plainPassword;

    return bcrypt.compare(password, this.passwordHash);
  }

  static async fromDto(
    user: User,
    dto: SignUpDto,
    options?: HashPasswordOptions,
  ): Promise<Authenticatable> {
    const authenticatable = new Authenticatable();

    authenticatable.user = user;
    authenticatable.provider = dto.provider ?? AUTH_PROVIDER.LOCAL;

    if (dto.password) {
      authenticatable.passwordHash = await Authenticatable.hashPassword(
        dto.password,
        options,
      );
    }

    return authenticatable;
  }

  toDto(): AuthenticatableDto {
    const dto = new AuthenticatableDto();

    dto.id = this.id;
    dto.provider = this.provider;

    return dto;
  }
}
