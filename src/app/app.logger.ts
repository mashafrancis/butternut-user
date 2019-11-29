import { LoggerService } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';
const { combine, timestamp, printf } = format;
import { config } from '../config';

export class AppLogger implements LoggerService {
  private logger: Logger;

  constructor(label?: string) {
    const options = {
      file: {
        level: 'info' || 'error',
        filename: `${__dirname}/../../logs/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
      },
    };

    this.logger = createLogger({
      format: combine(
        format.label({ label }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.splat(),
        format.json(),
        printf(({ level, message, label, timestamp }) => {
          return `${timestamp} [${label}] ${level.toUpperCase()} - ${message}`;
        })
      ),
      level: config.logger.level,
      transports: [(process.env.NODE_ENV !== 'development')
        ? new transports.File(options.file)
        : new transports.Console({
          format: format.combine(
            format.errors({ stack: true }),
            format.cli(),
            format.splat()
          ),
        }),
      ],
    });
  }

  error(message: string, trace: string) {
    this.logger.error(message, trace);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  log(message: string) {
    this.logger.info(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  silly(message: string) {
    this.logger.silly(message);
  }
}
