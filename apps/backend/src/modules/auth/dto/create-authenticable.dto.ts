import {
  IsEnum,
  IsString,
  ValidateIf,
  IsStrongPassword,
} from 'class-validator';

import { AUTH_PROVIDER, type AuthProvider } from './auth.dto';

export class CreateAuthenticableDto {
  @IsString()
  userId: string;

  @IsEnum(AUTH_PROVIDER)
  provider?: AuthProvider;

  @ValidateIf(
    (entity: CreateAuthenticableDto) => entity.provider === AUTH_PROVIDER.LOCAL,
  )
  @IsStrongPassword({ minLength: 8, minSymbols: 1 })
  password?: string;
}
