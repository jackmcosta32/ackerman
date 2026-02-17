import type Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { FeatureFlagsService } from './feature-flags.service';
import type { FeatureFlag } from './entities/feature-flag.entity';
import type { Repository } from 'typeorm';

type FeatureFlagRepository = Pick<
  Repository<FeatureFlag>,
  'findOneBy' | 'find' | 'create' | 'save' | 'merge' | 'softRemove'
>;

class RedisMock {
  store = new Map<string, string>();
  handlers = new Map<string, (channel: string, message: string) => void>();

  get = jest.fn((key: string) => Promise.resolve(this.store.get(key) ?? null));
  set = jest.fn((key: string, value: string) => {
    this.store.set(key, value);
    return Promise.resolve('OK');
  });
  del = jest.fn((key: string) => {
    this.store.delete(key);
    return Promise.resolve(1);
  });
  publish = jest.fn(() => Promise.resolve(1));
  connect = jest.fn(() => Promise.resolve(undefined));
  subscribe = jest.fn(() => Promise.resolve(1));
  quit = jest.fn(() => Promise.resolve('OK'));

  on = jest.fn(
    (event: string, callback: (channel: string, message: string) => void) => {
      this.handlers.set(event, callback);
      return this;
    },
  );
}

const createFlag = (overrides: Partial<FeatureFlag> = {}): FeatureFlag =>
  ({
    id: 'c90d84ba-e4fb-433f-8f5a-98b97ddf5f23',
    key: 'chat-v2',
    description: null,
    enabled: true,
    rolloutPercentage: 0,
    targetUserIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: undefined,
    ...overrides,
  }) as FeatureFlag;

describe('FeatureFlagsService', () => {
  let service: FeatureFlagsService;
  let repository: jest.Mocked<FeatureFlagRepository>;
  let redisClient: RedisMock;
  let redisSubscriber: RedisMock;

  beforeEach(() => {
    repository = {
      findOneBy: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      merge: jest.fn(),
      softRemove: jest.fn(),
    };

    redisClient = new RedisMock();
    redisSubscriber = new RedisMock();

    const configService = {
      get: jest.fn((key: string, defaultValue?: unknown) => {
        if (key === 'FEATURE_FLAGS_L1_TTL_MS') return 10000;
        if (key === 'FEATURE_FLAGS_REDIS_TTL_SEC') return 60;
        if (key === 'FEATURE_FLAGS_REDIS_CHANNEL')
          return 'feature-flags:invalidate';
        return defaultValue;
      }),
      getOrThrow: jest.fn((key: string) => {
        const map: Record<string, string | number> = {
          CACHE_SERVICE_HOST: '127.0.0.1',
          CACHE_SERVICE_PORT: 6379,
        };
        return map[key];
      }),
    } as unknown as ConfigService;

    service = new FeatureFlagsService(
      repository as unknown as Repository<FeatureFlag>,
      configService,
      redisClient as unknown as Redis,
      redisSubscriber as unknown as Redis,
    );
  });

  it('returns false when flag is missing', async () => {
    repository.findOneBy.mockResolvedValue(null);

    await expect(service.isEnabled('unknown-flag')).resolves.toBe(false);
  });

  it('returns false when flag is disabled', async () => {
    repository.findOneBy.mockResolvedValue(createFlag({ enabled: false }));

    await expect(service.isEnabled('chat-v2')).resolves.toBe(false);
  });

  it('returns true when user is explicitly targeted', async () => {
    repository.findOneBy.mockResolvedValue(
      createFlag({
        enabled: true,
        rolloutPercentage: 0,
        targetUserIds: ['158070ec-8097-4af8-9bb3-e8c60769a8bc'],
      }),
    );

    await expect(
      service.isEnabled('chat-v2', {
        userId: '158070ec-8097-4af8-9bb3-e8c60769a8bc',
      }),
    ).resolves.toBe(true);
  });

  it('evaluates rollout deterministically for the same user', async () => {
    repository.findOneBy.mockResolvedValue(
      createFlag({
        enabled: true,
        rolloutPercentage: 30,
      }),
    );

    const first = await service.isEnabled('chat-v2', {
      userId: '8b1f8ebe-e830-4c57-a616-9924a6534a84',
    });

    const second = await service.isEnabled('chat-v2', {
      userId: '8b1f8ebe-e830-4c57-a616-9924a6534a84',
    });

    expect(first).toBe(second);
  });

  it('reads from local cache after first lookup', async () => {
    repository.findOneBy.mockResolvedValue(createFlag());

    await service.isEnabled('chat-v2');
    await service.isEnabled('chat-v2');

    expect(repository.findOneBy).toHaveBeenCalledTimes(1);
    expect(redisClient.get).toHaveBeenCalledTimes(1);
  });

  it('reads from redis when available and skips database', async () => {
    redisClient.get.mockResolvedValue(
      JSON.stringify(
        createFlag({
          key: 'chat-v2',
          enabled: true,
        }),
      ),
    );

    await expect(service.isEnabled('chat-v2')).resolves.toBe(true);
    expect(repository.findOneBy).not.toHaveBeenCalled();
  });

  it('fails closed when repository throws', async () => {
    repository.findOneBy.mockRejectedValue(new Error('database offline'));

    await expect(service.isEnabled('chat-v2')).resolves.toBe(false);
  });
});
