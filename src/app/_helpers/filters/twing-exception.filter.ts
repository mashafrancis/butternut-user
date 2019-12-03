import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { TwingError, TwingErrorLoader } from 'twing';
import { AppLogger } from '../../app.logger';

@Catch(TwingErrorLoader)
export class TwingExceptionFilter implements ExceptionFilter {
  private logger = new AppLogger(TwingErrorLoader.name);

  catch(exception: TwingError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = HttpStatus.NOT_FOUND;

    this.logger.error(`[${exception.name}] ${exception.message}`, exception.stack);

    res
      .status(status)
      .json({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Template',
        message: 'Template not found',
        timestamp: new Date().toISOString(),
        path: req.url,
      });
  }
}
