import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AppLogger } from './app.logger';

import { config } from '../config';

export class AppDispatcher {
  private app: INestApplication;
  private logger = new AppLogger(AppDispatcher.name);

  private async createServer(): Promise<void> {
    this.app = await NestFactory.create(AppModule, {
      logger: new AppLogger('Nest'),
    });
  }

  async dispatch(): Promise<void> {
    await this.createServer();
    return this.startServer();
  }

  async shutdown(): Promise<void> {
    await this.app.close();
  }

  private async startServer(): Promise<void> {
    await this.app.listen(config.port, config.host);
    this.logger.log(`😎 Graphql is exposed at http://${config.host}:${config.port}/graphql 😎`);
    this.logger.log(`😎 Server is listening http://${config.host}:${config.port} 😎`);
  }
}
