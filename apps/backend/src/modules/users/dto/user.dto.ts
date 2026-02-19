import { IsEmail, IsEnum, IsString } from 'class-validator';
import { UserRole } from '@workspace/shared/constants/user.constant';

export class UserDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;
}
