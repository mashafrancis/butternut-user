import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';

export * from './entity';
export * from './database';
export * from './filters';
export * from './rest.exception';
export * from './request-context';

export function ucfirst(string) {
  return string[0].toUpperCase() + string.slice(1);
}

export function passwordHash(password: string) {
  const salt = randomBytes(32);
  return argon2.hash(password, { salt });
}
