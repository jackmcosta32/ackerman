import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { UserAlreadyExistsError } from './users.errors';
import { UpdateUserDtoMocker } from '@/test-utils/mocks/update-user-dto.mocker';
import { CreateUserDtoMocker } from '@/test-utils/mocks/create-user-dto.mocker';
import { mockDatabaseConnectionModule } from '@/test-utils/mock-database-connection';

const createUserDtoMocker = new CreateUserDtoMocker();
const updateUserDtoMocker = new UpdateUserDtoMocker();

describe('[Integration] UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        mockDatabaseConnectionModule(),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto = createUserDtoMocker.mock();

      const user = await service.create(dto);

      expect(user).toBeDefined();
      expect(user.email).toBe(dto.email);
    });

    it('should throw if user already exists', async () => {
      const dto = createUserDtoMocker.mock();

      await service.create(dto);

      await expect(service.create(dto)).rejects.toThrow(UserAlreadyExistsError);
    });
  });

  describe('update', () => {
    it("should return null if user doesn't exist", async () => {
      const dto = updateUserDtoMocker.mock();
      const result = await service.update('non-existing-id', dto);

      expect(result).toBeNull();
    });

    it('should update a user if it exists', async () => {
      const createDto = createUserDtoMocker.mock();
      const updateDto = updateUserDtoMocker.mock();

      const createdUser = await service.create(createDto);

      const user = await service.update(createdUser.id, updateDto);

      expect(user).toBeDefined();
      expect(user!.name).toBe(updateDto.name);
    });
  });

  describe('delete', () => {
    it("should return false if user doesn't exist", async () => {
      const result = await service.remove('non-existing-id');

      expect(result).toBeFalsy();
    });

    it('should return true if the user exists', async () => {
      const createDto = createUserDtoMocker.mock();

      const createdUser = await service.create(createDto);

      const result = await service.remove(createdUser.id);

      expect(result).toBeTruthy();
    });
  });
});
