import {
  AUTH_PROVIDER,
  AuthenticableDto,
  type AuthProvider,
} from '../dto/auth.dto';

import bcrypt from 'bcrypt';
import { Column, Entity, ForeignKey, PrimaryGeneratedColumn } from 'typeorm';
import { CreateAuthenticableDto } from '../dto/create-authenticable.dto';
import { User } from 'src/modules/users/entities/user.entity';

const DEFAULT_ROUNDS = 10;

export interface HashPasswordOptions {
  pepper?: string;
  rounds?: number;
}

export interface ValidatePasswordOptions {
  pepper?: string;
}

@Entity()
export class Authenticable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  passwordHash?: string;

  @Column({ enum: AUTH_PROVIDER, default: AUTH_PROVIDER.LOCAL })
  provider: AuthProvider;

  @ForeignKey(() => User)
  userId: string;

  static async hashPassword(
    plainPassword: string,
    options?: HashPasswordOptions,
  ): Promise<string> {
    const { pepper, rounds = DEFAULT_ROUNDS } = options || {};
    const password = pepper ? pepper + plainPassword : plainPassword;

    const salt = await bcrypt.genSalt(rounds);

    return bcrypt.hash(password, salt);
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
    dto: CreateAuthenticableDto,
    options?: HashPasswordOptions,
  ): Promise<Authenticable> {
    const authenticable = new Authenticable();

    authenticable.userId = dto.userId;
    authenticable.provider = dto.provider ?? AUTH_PROVIDER.LOCAL;

    if (dto.password) {
      authenticable.passwordHash = await Authenticable.hashPassword(
        dto.password,
        options,
      );
    }

    return authenticable;
  }

  toDto(): AuthenticableDto {
    const dto = new AuthenticableDto();

    dto.id = this.id;
    dto.provider = this.provider;

    return dto;
  }
}
