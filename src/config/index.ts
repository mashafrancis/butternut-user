import { readFileSync } from 'fs';
import { ConnectionOptions } from 'typeorm';

const appPackage = readFileSync(`${__dirname}/../../package.json`, {
  encoding: 'utf8',
});
const appData = JSON.parse(appPackage);

interface Config {
  port: number | null | undefined;
  host: string | null | undefined;
  logger: {
    level: string;
    transports?: any[];
  };
  isProduction: boolean;
  database: ConnectionOptions;
  version: string;
  name: string;
  description: string;
  validator: {
    validationError: {
      target: boolean;
      value: boolean;
    }
  };
}

export const config: Config = {
  port: parseInt(process.env.PORT, 10),
  host: process.env.APP_HOST,
  logger: {
    level: process.env.LOG_LEVEL,
  },
  isProduction: process.env.NODE_ENV === 'production',
  database: {
    type: 'mongodb',
    url: process.env.MONGODB_URI,
    // synchronize: true,
    logging: 'all',
    useNewUrlParser: true,
    migrationsRun: true,
    migrations: [
      `${__dirname}/../migrations/*{.ts,.js}`,
    ],
    entities: [
      `${__dirname}/../**/entity/*.entity{.ts,.js}`,
    ],
  },
  version: appData.version,
  name: appData.name,
  description: appData.description,
  validator: {
    validationError: {
      target: false,
      value: false,
    },
  },
};
