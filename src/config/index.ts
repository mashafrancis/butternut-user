interface Config {
  port: number | null | undefined;
  host: string | null | undefined;
  logger: {
    level: string;
    transports?: any[];
  };
}

export const config: Config = {
  port: parseInt(process.env.PORT, 10),
  host: process.env.APP_HOST,
  logger: {
    level: process.env.LOG_LEVEL,
  },
};
