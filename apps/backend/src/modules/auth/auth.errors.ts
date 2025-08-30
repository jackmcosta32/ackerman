export class UserNotFoundError extends Error {
  constructor(email: string) {
    super(`Could not find user with email ${email}`);
  }
}

export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`User already exists with email ${email}`);
  }
}

export class UserNotAuthenticableByProvider extends Error {
  constructor(email: string, provider: string) {
    super(
      `User with email ${email} is not authenticable by provider ${provider}`,
    );
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials');
  }
}
