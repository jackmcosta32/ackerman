import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserDto } from '../dto/user.dto';
import { Role } from '@/constants/roles.constant';
import { CreateUserDto } from '../dto/create-user.dto';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  static fromDto(dto: CreateUserDto): User {
    const user = new User();

    user.email = dto.email;
    user.name = dto.name;

    return user;
  }

  toDto(): UserDto {
    const dto = new UserDto();

    dto.id = this.id;
    dto.role = this.role;
    dto.name = this.name;
    dto.email = this.email;

    return dto;
  }
}
