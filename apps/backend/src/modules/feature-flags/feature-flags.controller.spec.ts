import { FeatureFlagsController } from './feature-flags.controller';
import { FeatureFlagsService } from './feature-flags.service';
import {
  FeatureFlagAlreadyExistsError,
  FeatureFlagNotFoundError,
} from './feature-flags.errors';

describe('FeatureFlagsController', () => {
  let controller: FeatureFlagsController;
  let service: jest.Mocked<FeatureFlagsService>;

  beforeEach(() => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOneByKey: jest.fn(),
      update: jest.fn(),
      toggle: jest.fn(),
      remove: jest.fn(),
      evaluate: jest.fn(),
    } as unknown as jest.Mocked<FeatureFlagsService>;

    controller = new FeatureFlagsController(service);
  });

  it('translates duplicated key to conflict error', async () => {
    service.create.mockRejectedValue(
      new FeatureFlagAlreadyExistsError('experimental-chat'),
    );

    await expect(
      controller.create({
        key: 'experimental-chat',
      }),
    ).rejects.toThrow('already exists');
  });

  it('translates unknown flag to not found on findOne', async () => {
    service.findOneByKey.mockRejectedValue(
      new FeatureFlagNotFoundError('missing'),
    );

    await expect(controller.findOne('missing')).rejects.toThrow('not found');
  });

  it('evaluates and returns key + enabled payload', async () => {
    service.evaluate.mockResolvedValue(true);

    await expect(
      controller.evaluate('chat-v2', {
        userId: 'c7647dc7-f6da-4376-9c16-97e111fb9edc',
      }),
    ).resolves.toEqual({
      key: 'chat-v2',
      enabled: true,
    });
  });
});
