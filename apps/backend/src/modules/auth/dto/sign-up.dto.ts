import { AUTH_PROVIDER, type AuthProvider } from './auth.dto';
import { IsEnum, ValidateIf, IsStrongPassword } from 'class-validator';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

export class SignUpDto extends CreateUserDto {
  @IsEnum(AUTH_PROVIDER)
  provider?: AuthProvider;

  @ValidateIf((entity: SignUpDto) => entity.provider === AUTH_PROVIDER.LOCAL)
  @IsStrongPassword({ minLength: 8, minSymbols: 1 })
  password?: string;
}
