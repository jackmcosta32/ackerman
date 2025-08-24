import { IsEmail, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
