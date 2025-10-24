import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { Authenticatable } from './entities/authenticatable.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Authenticatable])],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
