import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLogger } from '../../app.logger';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new AppLogger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    let status = HttpStatus.BAD_REQUEST;

    if (typeof exception === 'string') {
      // tslint:disable-next-line:no-parameter-reassignment
      exception = new HttpException({ error: 'Undefined', message: exception }, status);
    }

    if (typeof exception.message === 'string') {
      // tslint:disable-next-line:no-parameter-reassignment
      exception = new HttpException({ error: 'Undefined', message: exception.message }, status);
    }

    if (exception.getStatus) {
      status = exception.getStatus();
    }

    this.logger.error(`[${exception.message.error}] ${exception.message.message}`, exception.stack);

    res
      .status(status)
      .json({
        statusCode: status,
        ...exception.getResponse() as object,
        timestamp: new Date().toISOString(),
        path: req.url,
      });
  }
}
