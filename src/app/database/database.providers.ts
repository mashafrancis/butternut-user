import { createConnection } from 'typeorm';
import { config } from '../../config';
import { DATABASE_CONNECTION } from './database.constants';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: async () => createConnection(config.database),
  },
];
