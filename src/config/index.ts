import { MicroserviceOptions, Transport } from '@nestjs/microservices';
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
    verify_account: {
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
  microservice: MicroserviceOptions;
  google: {
    clientID: string;
    clientSecret: string;
    callbackUrl: string;
    refreshToken: string;
    accessToken: string;
    mailClientId: string;
    mailClientSecret: string;
    mailRefreshToken: string;
  };
  mail: {
    from: string;
  };
  assetsPath: string;
  clientUrl: string;
  serverUrl: string;
  redisURL: string;
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
    type: 'mongodb',
    url: process.env.MONGODB_URI,
    synchronize: false,
    // host: 'localhost',
    // port: 5432,
    // username: 'francismasha',
    // password: 'masha',
    // database: 'butternut',
    logging: 'all',
    logger: 'file',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    migrationsRun: true,
    migrations: [
      `${__dirname}/../migrations/*{.ts,.js}`,
    ],
    entities: [
      `${__dirname}/../**/entity/*.entity{.ts,.js}`,
    ],
  },
  version: appData.version,
  name: 'Food Set Go',
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
    verify_account: {
      secret: process.env.SESSION_VERIFY_ACCOUNT,
      timeout: parseInt(process.env.SESSION_VERIFY_ACCOUNT_TIMEOUT, 10),
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
  microservice: {
    transport: Transport.TCP,
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    accessToken: process.env.GOOGLE_ACCESS_TOKEN,
    mailClientId: process.env.GOOGLE_MAIL_CLIENT_ID,
    mailClientSecret: process.env.GOOGLE_MAIL_CLIENT_SECRET,
    mailRefreshToken: process.env.GOOGLE_MAIL_REFRESH_TOKEN,
  },
  mail: {
    from: process.env.MAIL_FROM,
  },
  assetsPath: `${__dirname}/../assets`,
  redisURL: process.env.REDIS_URL,
  clientUrl:
    process.env.NODE_ENV === 'development' ? process.env.DEVELOPMENT_SITE_URL : process.env.PRODUCTION_SITE_URL,
  serverUrl:
    process.env.NODE_ENV === 'development' ? process.env.DEVELOPMENT_SERVER_URL : process.env.PRODUCTION_SERVER_URL,
};
