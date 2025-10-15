// import { HttpException } from '@nestjs/common';
// import { ErrorResponseI } from './utils/utils.interface';

// class AppException extends HttpException {
//   constructor(message: string, status: number, state: boolean = false) {
//     super({ message, state, statusCode: status }, status);
//   }
// }

// export const AppResponse = {
//   success: (message: string, statusCode?: number, data: object = {}) => {
//     return {
//       message,
//       status: true,
//       statusCode,
//       data,
//     };
//   },
//   error: (err: ErrorResponseI) => {
//     const message = err?.message
//       ? err.message
//       : `internal server error @ ${err?.location}`;

//     throw new AppException(message, err?.status ?? 500);
//   },
// };

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private logger = new Logger('GlobalExceptionFilter');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Log with service location if available
    this.logger.error({
      message: exception.message,
      status: exception.status || 500,
      stack: exception.stack,
    });

    const status = exception.getStatus?.() || 500;
    const message = exception.message || 'Internal server error';

    response.status(status).json({
      success: false,
      message,
      status,
      timestamp: new Date().toISOString(),
    });
  }
}

// Register in main.ts
