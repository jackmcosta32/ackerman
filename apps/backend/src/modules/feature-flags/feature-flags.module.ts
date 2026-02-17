import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from '@/modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureFlag } from './entities/feature-flag.entity';
import { FeatureFlagsService } from './feature-flags.service';
import { FeatureFlagsController } from './feature-flags.controller';
import {
  FEATURE_FLAGS_REDIS_CLIENT,
  FEATURE_FLAGS_REDIS_SUBSCRIBER,
} from './feature-flags.tokens';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([FeatureFlag])],
  controllers: [FeatureFlagsController],
  providers: [
    FeatureFlagsService,
    {
      provide: FEATURE_FLAGS_REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new Redis({
          host: configService.getOrThrow<string>('CACHE_SERVICE_HOST'),
          port: configService.getOrThrow<number>('CACHE_SERVICE_PORT'),
          password:
            configService.get<string>('CACHE_SERVICE_PASSWORD') || undefined,
          lazyConnect: true,
        }),
    },
    {
      provide: FEATURE_FLAGS_REDIS_SUBSCRIBER,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new Redis({
          host: configService.getOrThrow<string>('CACHE_SERVICE_HOST'),
          port: configService.getOrThrow<number>('CACHE_SERVICE_PORT'),
          password:
            configService.get<string>('CACHE_SERVICE_PASSWORD') || undefined,
          lazyConnect: true,
        }),
    },
  ],
  exports: [FeatureFlagsService],
})
export class FeatureFlagsModule {}
