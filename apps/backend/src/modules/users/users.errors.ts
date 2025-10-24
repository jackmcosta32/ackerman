export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`User already exists with email ${email}`);
  }
}

export class UserNotFoundError extends Error {
  constructor(email: string) {
    super(`Could not find user with email ${email}`);
  }
}
