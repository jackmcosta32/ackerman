import {
  IsEmail,
  IsString,
  MinLength,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({ minLength: 8, minSymbols: 1 })
  password: string;
}
