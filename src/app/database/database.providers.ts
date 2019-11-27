import { createConnection } from 'typeorm';
import { config } from '../../config';
import { DB_CONNECTION_TOKEN } from './database.constants';

export const databaseProviders = [
  {
    provide: DB_CONNECTION_TOKEN,
    useFactory: async () => createConnection(config.database),
  },
];
