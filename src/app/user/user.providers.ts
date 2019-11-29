import { Connection } from 'typeorm';
import { DATABASE_CONNECTION } from '../database/database.constants';
import { UserEmailEntity, UserEntity } from './entity';
import { UserSubscriptionEntity } from './entity/user-subscription.entity';
import { USER_EMAIL_TOKEN, USER_SUBSCRIPTION_TOKEN, USER_TOKEN } from './user.constants';

export const userProviders = [
  {
    provide: USER_TOKEN,
    useFactory: (connection: Connection) => connection.getRepository(UserEntity),
    inject: [DATABASE_CONNECTION],
  },
  {
    provide: USER_EMAIL_TOKEN,
    useFactory: (connection: Connection) => connection.getRepository(UserEmailEntity),
    inject: [DATABASE_CONNECTION],
  },
  {
    provide: USER_SUBSCRIPTION_TOKEN,
    useFactory: (connection: Connection) => connection.getRepository(UserSubscriptionEntity),
    inject: [DATABASE_CONNECTION],
  },
];
