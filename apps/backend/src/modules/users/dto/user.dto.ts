import { Role } from '@/constants/roles.constant';
import { IsEmail, IsEnum, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(Role)
  role: Role;
}
