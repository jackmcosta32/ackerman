import bcrypt from 'bcrypt';

const DEFAULT_ROUNDS = 10;

interface HashPasswordOptions {
  pepper?: string;
  rounds?: number;
}

interface ValidatePasswordOptions {
  pepper?: string;
}

export abstract class Authenticable {
  abstract passwordHash: string;

  static async hashPassword(
    plainPassword: string,
    options?: HashPasswordOptions,
  ): Promise<string> {
    const { pepper, rounds = DEFAULT_ROUNDS } = options || {};
    const password = pepper ? pepper + plainPassword : plainPassword;

    const salt = await bcrypt.genSalt(rounds);

    return bcrypt.hash(password, salt);
  }

  async validatePassword(
    plainPassword: string,
    options?: ValidatePasswordOptions,
  ): Promise<boolean> {
    const { pepper } = options || {};
    const password = pepper ? pepper + plainPassword : plainPassword;

    return bcrypt.compare(password, this.passwordHash);
  }
}
