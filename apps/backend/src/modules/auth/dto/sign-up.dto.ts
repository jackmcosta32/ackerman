import { IsStrongPassword } from 'class-validator';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

export class SignUpDto extends CreateUserDto {
  @IsStrongPassword({ minLength: 8, minSymbols: 1 })
  password: string;
}
