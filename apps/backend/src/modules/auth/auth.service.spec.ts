import {} from './auth.errors';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@/modules/users/entities/user.entity';
import { UsersService } from '@/modules/users/users.service';
import { Authenticatable } from './entities/authenticatable.entity';
import { UserAlreadyExistsError } from '@/modules/users/users.errors';
import { SignUpDtoMocker } from '@/test-utils/mocks/sign-up-dto.mocker';
import { mockDatabaseConnectionModule } from '@/test-utils/mock-database-connection';

const MOCKED_CONFIGS = {
  PASSWORD_ROUNDS: '',
  PASSWORD_PEPPER: '',
};

const signUpDtoMocker = new SignUpDtoMocker();

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        mockDatabaseConnectionModule(),
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([Authenticatable]),
      ],
      providers: [AuthService, JwtService, UsersService, ConfigService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    it('should allow the a user to sign up using the local provider', () => {
      const dto = signUpDtoMocker.mock();

      expect(() => service.signUp(dto)).not.toThrow();
    });

    it('should throw if user already exists', () => {
      const dto = signUpDtoMocker.mock();

      expect(() => service.signUp(dto)).toThrow(UserAlreadyExistsError);
    });
  });
});
