import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';

export * from './entity';
export * from './filters';
export * from './database';
export * from './graphql';
export * from './rest.exception';
export * from './request-context';
export * from './middleware/request-context.middleware';

export const ucfirst = string => string[0].toUpperCase() + string.slice(1);

export const passwordHash = (password: string) => {
  const salt = randomBytes(32);
  return argon2.hash(password, { salt });
};

export const verifyPassword = (hashedPassword: string, password: string) => {
  return argon2.verify(hashedPassword, password);
};
