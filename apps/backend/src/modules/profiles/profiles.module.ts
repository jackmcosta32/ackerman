import { Module } from '@nestjs/common';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { ProfilesController } from './profiles.controller';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [ProfilesController],
  providers: [],
})
export class ProfilesModule {}
