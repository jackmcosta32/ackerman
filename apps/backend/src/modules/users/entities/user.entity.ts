import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  Authenticable,
  type HashPasswordOptions,
} from 'src/modules/auth/entities/authenticable.entity';

import { UserDto } from '../dto/user.dto';
import { CreateUserDto } from '../dto/create-user.dto';

@Entity()
export class User extends Authenticable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  static async fromDto(
    dto: CreateUserDto,
    options?: HashPasswordOptions,
  ): Promise<User> {
    const user = new User();

    user.email = dto.email;
    user.passwordHash = await User.hashPassword(dto.password, options);

    return user;
  }

  toDto(): UserDto {
    const dto = new UserDto();

    dto.id = this.id;
    dto.email = this.email;

    return dto;
  }
}
