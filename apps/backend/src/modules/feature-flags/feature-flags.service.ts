import {
  Inject,
  Logger,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';

import {
  FEATURE_FLAGS_REDIS_CLIENT,
  FEATURE_FLAGS_REDIS_SUBSCRIBER,
} from './feature-flags.tokens';

import {
  FEATURE_FLAGS_L1_TTL_MS,
  FEATURE_FLAGS_REDIS_CHANNEL,
  FEATURE_FLAGS_REDIS_TTL_SEC,
} from '@/constants/configs.constant';

import {
  FeatureFlagNotFoundError,
  FeatureFlagAlreadyExistsError,
} from './feature-flags.errors';

import Redis from 'ioredis';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FeatureFlag } from './entities/feature-flag.entity';
import { CreateFeatureFlagDto } from './dto/create-feature-flag.dto';
import { UpdateFeatureFlagDto } from './dto/update-feature-flag.dto';

interface FeatureFlagContext {
  userId?: string;
}

interface CachedFeatureFlag {
  flag: FeatureFlag | null;
  expiresAt: number;
}

interface InvalidationPayload {
  key?: string;
  clearAll?: boolean;
}

@Injectable()
export class FeatureFlagsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(FeatureFlagsService.name);
  private readonly localCache = new Map<string, CachedFeatureFlag>();
  private readonly l1TtlMs: number;
  private readonly redisTtlSec: number;
  private readonly channel: string;
  private readonly redisPrefix = 'feature-flags:key:';

  constructor(
    @InjectRepository(FeatureFlag)
    private readonly featureFlagsRepository: Repository<FeatureFlag>,
    private readonly configService: ConfigService,
    @Inject(FEATURE_FLAGS_REDIS_CLIENT)
    private readonly redisClient: Redis,
    @Inject(FEATURE_FLAGS_REDIS_SUBSCRIBER)
    private readonly redisSubscriber: Redis,
  ) {
    this.l1TtlMs = this.configService.get<number>(
      FEATURE_FLAGS_L1_TTL_MS,
      10000,
    );
    this.redisTtlSec = this.configService.get<number>(
      FEATURE_FLAGS_REDIS_TTL_SEC,
      60,
    );
    this.channel = this.configService.get<string>(
      FEATURE_FLAGS_REDIS_CHANNEL,
      'feature-flags:invalidate',
    );
  }

  async onModuleInit() {
    try {
      this.redisSubscriber.on('message', (_, message) => {
        this.handleInvalidationMessage(message);
      });
      await this.redisSubscriber.connect();
      await this.redisSubscriber.subscribe(this.channel);
    } catch (error) {
      this.logger.warn(`Failed to initialize Redis pub/sub: ${String(error)}`);
    }
  }

  async onModuleDestroy() {
    await Promise.allSettled([
      this.redisClient.quit(),
      this.redisSubscriber.quit(),
    ]);
  }

  async create(
    createFeatureFlagDto: CreateFeatureFlagDto,
  ): Promise<FeatureFlag> {
    const existing = await this.featureFlagsRepository.findOneBy({
      key: createFeatureFlagDto.key,
    });

    if (existing) {
      throw new FeatureFlagAlreadyExistsError(createFeatureFlagDto.key);
    }

    const featureFlag = this.featureFlagsRepository.create({
      ...createFeatureFlagDto,
      enabled: createFeatureFlagDto.enabled ?? false,
      rolloutPercentage: createFeatureFlagDto.rolloutPercentage ?? 0,
      targetUserIds: createFeatureFlagDto.targetUserIds ?? [],
      description: createFeatureFlagDto.description ?? null,
    });

    const created = await this.featureFlagsRepository.save(featureFlag);

    await this.cacheAndNotify(created);

    return created;
  }

  findAll(): Promise<FeatureFlag[]> {
    return this.featureFlagsRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOneByKey(key: string): Promise<FeatureFlag> {
    const featureFlag = await this.featureFlagsRepository.findOneBy({ key });

    if (!featureFlag) {
      throw new FeatureFlagNotFoundError(key);
    }

    return featureFlag;
  }

  async update(
    key: string,
    updateFeatureFlagDto: UpdateFeatureFlagDto,
  ): Promise<FeatureFlag> {
    const featureFlag = await this.findOneByKey(key);

    const updated = this.featureFlagsRepository.merge(featureFlag, {
      ...updateFeatureFlagDto,
      description:
        updateFeatureFlagDto.description === undefined
          ? featureFlag.description
          : updateFeatureFlagDto.description,
      targetUserIds:
        updateFeatureFlagDto.targetUserIds ?? featureFlag.targetUserIds,
      enabled: updateFeatureFlagDto.enabled ?? featureFlag.enabled,
      rolloutPercentage:
        updateFeatureFlagDto.rolloutPercentage ?? featureFlag.rolloutPercentage,
    });

    const saved = await this.featureFlagsRepository.save(updated);

    await this.cacheAndNotify(saved);

    return saved;
  }

  async toggle(key: string): Promise<FeatureFlag> {
    const featureFlag = await this.findOneByKey(key);
    featureFlag.enabled = !featureFlag.enabled;
    const updated = await this.featureFlagsRepository.save(featureFlag);

    await this.cacheAndNotify(updated);

    return updated;
  }

  async remove(key: string): Promise<void> {
    const featureFlag = await this.findOneByKey(key);
    await this.featureFlagsRepository.softRemove(featureFlag);
    await this.evictFlag(key);
    await this.publishInvalidation({ key });
  }

  async evaluate(key: string, context?: FeatureFlagContext): Promise<boolean> {
    return this.isEnabled(key, context);
  }

  async isEnabled(key: string, context?: FeatureFlagContext): Promise<boolean> {
    try {
      const featureFlag = await this.getCachedFlag(key);

      if (!featureFlag) {
        return false;
      }

      if (!featureFlag.enabled) {
        return false;
      }

      const userId = context?.userId;
      const targetUserIds = featureFlag.targetUserIds ?? [];

      if (userId && targetUserIds.includes(userId)) {
        return true;
      }

      if (userId && featureFlag.rolloutPercentage > 0) {
        return this.isUserInRolloutBucket(
          key,
          userId,
          featureFlag.rolloutPercentage,
        );
      }

      const hasTargeting =
        targetUserIds.length > 0 || featureFlag.rolloutPercentage > 0;

      if (hasTargeting) {
        return featureFlag.rolloutPercentage >= 100;
      }

      return featureFlag.enabled;
    } catch (error) {
      this.logger.warn(
        `Feature flag evaluation failed for "${key}": ${String(error)}`,
      );
      return false;
    }
  }

  private getRedisKey(key: string): string {
    return `${this.redisPrefix}${key}`;
  }

  private getFromLocalCache(key: string): FeatureFlag | null | undefined {
    const cached = this.localCache.get(key);

    if (!cached) {
      return undefined;
    }

    if (Date.now() >= cached.expiresAt) {
      this.localCache.delete(key);
      return undefined;
    }

    return cached.flag;
  }

  private setLocalCache(key: string, flag: FeatureFlag | null): void {
    this.localCache.set(key, {
      flag,
      expiresAt: Date.now() + this.l1TtlMs,
    });
  }

  private async getCachedFlag(key: string): Promise<FeatureFlag | null> {
    const l1Value = this.getFromLocalCache(key);
    if (l1Value !== undefined) {
      return l1Value;
    }

    const redisKey = this.getRedisKey(key);

    try {
      const redisValue = await this.redisClient.get(redisKey);

      if (redisValue) {
        const featureFlag = JSON.parse(redisValue) as FeatureFlag;
        this.setLocalCache(key, featureFlag);
        return featureFlag;
      }
    } catch (error) {
      this.logger.warn(`Redis read failed for "${key}": ${String(error)}`);
    }

    const fromDatabase = await this.featureFlagsRepository.findOneBy({ key });
    this.setLocalCache(key, fromDatabase);

    if (fromDatabase) {
      await this.setRedisCache(fromDatabase);
    }

    return fromDatabase;
  }

  private async setRedisCache(featureFlag: FeatureFlag): Promise<void> {
    try {
      await this.redisClient.set(
        this.getRedisKey(featureFlag.key),
        JSON.stringify(featureFlag),
        'EX',
        this.redisTtlSec,
      );
    } catch (error) {
      this.logger.warn(
        `Redis write failed for "${featureFlag.key}": ${String(error)}`,
      );
    }
  }

  private async evictFlag(key: string): Promise<void> {
    this.localCache.delete(key);

    try {
      await this.redisClient.del(this.getRedisKey(key));
    } catch (error) {
      this.logger.warn(`Redis delete failed for "${key}": ${String(error)}`);
    }
  }

  private async cacheAndNotify(featureFlag: FeatureFlag): Promise<void> {
    this.setLocalCache(featureFlag.key, featureFlag);
    await this.setRedisCache(featureFlag);
    await this.publishInvalidation({ key: featureFlag.key });
  }

  private async publishInvalidation(
    payload: InvalidationPayload,
  ): Promise<void> {
    try {
      await this.redisClient.publish(this.channel, JSON.stringify(payload));
    } catch (error) {
      this.logger.warn(`Redis publish failed: ${String(error)}`);
    }
  }

  private handleInvalidationMessage(message: string): void {
    try {
      const payload = JSON.parse(message) as InvalidationPayload;

      if (payload.clearAll) {
        this.localCache.clear();
        return;
      }

      if (payload.key) {
        this.localCache.delete(payload.key);
      }
    } catch (error) {
      this.logger.warn(`Invalid invalidation payload: ${String(error)}`);
    }
  }

  private isUserInRolloutBucket(
    key: string,
    userId: string,
    rolloutPercentage: number,
  ): boolean {
    const hashInput = `${key}:${userId}`;
    const hash = this.getDeterministicHash(hashInput);
    return hash % 100 < rolloutPercentage;
  }

  private getDeterministicHash(input: string): number {
    let hash = 5381;

    for (let index = 0; index < input.length; index += 1) {
      hash = (hash * 33) ^ input.charCodeAt(index);
    }

    return Math.abs(hash >>> 0);
  }
}
