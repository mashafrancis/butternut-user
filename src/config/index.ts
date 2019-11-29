import { readFileSync } from 'fs';
import { ConnectionOptions } from 'typeorm';

const appPackage = readFileSync(`${__dirname}/../../package.json`, {
  encoding: 'utf8',
});
const appData = JSON.parse(appPackage);

interface Config {
  port: number | null | undefined;
  host: string | null | undefined;
  uuid: string;
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
  session: {
    domain: string;
    secret: string;
    timeout: number;
    refresh: {
      secret: string;
      timeout: number;
    };
    password_reset: {
      secret: string;
      timeout: number;
    };
    verify: {
      secret: string;
      timeout: number;
    }
  };
}

export const config: Config = {
  port: parseInt(process.env.PORT, 10),
  host: process.env.APP_HOST,
  uuid: process.env.UUID,
  logger: {
    level: process.env.LOG_LEVEL,
  },
  isProduction: process.env.NODE_ENV === 'production',
  database: {
    type: 'postgres',
    // url: process.env.MONGODB_URI,
    synchronize: false,
    host: 'localhost',
    port: 5432,
    username: 'francismasha',
    password: 'masha',
    database: 'butternut',
    logging: 'all',
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
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
  session: {
    domain: process.env.SESSION_DOMAIN,
    secret: process.env.SESSION_SECRET,
    timeout: parseInt(process.env.SESSION_TIMEOUT, 10),
    refresh: {
      secret: process.env.SESSION_REFRESH_SECRET,
      timeout: parseInt(process.env.SESSION_REFRESH_TIMEOUT, 10),
    },
    password_reset: {
      secret: process.env.SESSION_PASSWORD_RESET_SECRET,
      timeout: parseInt(process.env.SESSION_PASSWORD_RESET_TIMEOUT, 10),
    },
    verify: {
      secret: process.env.SESSION_VERIFY_SECRET,
      timeout: parseInt(process.env.SESSION_VERIFY_TIMEOUT, 10),
    },
  },
};
