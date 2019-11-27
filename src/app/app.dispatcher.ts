import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import * as cors from 'cors';
import * as helmet from 'helmet';

import { AppModule } from '../app.module';

import { config } from '../config';
import { AppLogger } from './app.logger';

export class AppDispatcher {
  private app: INestApplication;
  private logger = new AppLogger(AppDispatcher.name);

  private async createServer(): Promise<void> {
    this.app = await NestFactory.create(AppModule, {
      logger: new AppLogger('Nest'),
    });
    useContainer(this.app.select(AppModule), { fallbackOnErrors: true });
    this.app.use(cors());
    if (config.isProduction) {
      this.app.use(helmet());
    }
    const options = new DocumentBuilder()
      .setTitle(config.name)
      .setDescription(config.description)
      .setVersion(config.version)
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(this.app, options);
    document.paths['/graphql'] = { get: { tags: ['graphql'] }, post: { tags: ['graphql'] } };
    SwaggerModule.setup('/swagger', this.app, document);
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
