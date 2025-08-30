import type { Values } from 'src/types/record.type';
import { IsEnum, IsString } from 'class-validator';

export const AUTH_PROVIDER = {
  LOCAL: 'local',
  GOOGLE: 'google',
} as const;

export type AuthProvider = Values<typeof AUTH_PROVIDER>;

export class AuthenticableDto {
  @IsString()
  id: string;

  @IsEnum(AUTH_PROVIDER)
  provider?: AuthProvider;
}
