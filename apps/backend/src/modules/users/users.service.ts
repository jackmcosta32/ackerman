import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository, type SaveOptions } from 'typeorm';
import { UserAlreadyExistsError } from './users.errors';
import type { WithQueryRunner } from '@/types/typeorm.types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    options?: WithQueryRunner<SaveOptions>,
  ): Promise<User> {
    const user = User.fromDto(createUserDto);

    const existingUser = await this.findOneByEmail(createUserDto.email);

    if (existingUser) {
      throw new UserAlreadyExistsError(createUserDto.email);
    }

    const repository = options?.queryRunner
      ? options.queryRunner.manager.getRepository(User)
      : this.usersRepository;

    return repository.save(user, options);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    const updateResult = await this.usersRepository.update(id, updateUserDto);

    if (!updateResult.affected) return null;

    return this.usersRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.usersRepository.delete(id);

    return Boolean(result.affected);
  }
}
