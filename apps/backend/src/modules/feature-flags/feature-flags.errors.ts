export class FeatureFlagAlreadyExistsError extends Error {
  constructor(key: string) {
    super(`Feature flag "${key}" already exists`);
  }
}

export class FeatureFlagNotFoundError extends Error {
  constructor(key: string) {
    super(`Feature flag "${key}" not found`);
  }
}
