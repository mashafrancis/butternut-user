import 'dotenv/config';
import 'reflect-metadata';

import * as exitHook from 'async-exit-hook';
import { AppDispatcher, AppLogger } from './app';

const logger = new AppLogger('Index');

logger.log(`Start`);

const dispatcher = new AppDispatcher();

dispatcher
  .dispatch()
  .then(() => logger.log('Everything up running'))
  .catch((e) => {
    logger.error(e.message, e.stack);
    process.exit(1);
  });

exitHook((callback) => {
  dispatcher
    .shutdown()
    .then(() => {
      logger.log('Graceful shutdown the server');
      callback();
    });
});
