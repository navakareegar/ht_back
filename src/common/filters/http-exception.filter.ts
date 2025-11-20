import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../interfaces/response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as Record<string, any>;
        message = responseObj.message || exception.message;
        details = responseObj.error || null;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      details = exception.stack || null;
    }

    this.logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify({
        status,
        message,
        details,
        timestamp: new Date(),
      }),
    );

    const errorResponse: ApiResponse = {
      success: false,
      statusCode: status,
      message: 'Request failed',
      error: {
        message,
        details: process.env.NODE_ENV === 'production' ? undefined : details,
      },
      timestamp: new Date(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }
}
