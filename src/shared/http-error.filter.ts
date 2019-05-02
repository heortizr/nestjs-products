import {
  Catch,
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
  Logger,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      code: status,
      timestamp: Date.now(),
      path: req.url,
      method: req.method,
      message: exception.message.error || exception.message || null,
    };

    Logger.error(
      `${req.method} ${req.url}`,
      JSON.stringify(errorResponse),
      'HttpErrorFilter',
    );

    res.status(status).json(errorResponse);
  }
}
