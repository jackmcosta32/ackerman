export class UserNotAuthenticatableByProvider extends Error {
  constructor(email: string, provider: string) {
    super(
      `User with email ${email} is not authenticatable by provider ${provider}`,
    );
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials');
  }
}
