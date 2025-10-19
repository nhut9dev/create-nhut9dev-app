import { Response } from 'express';

import { StatusCodes } from '~shared/constants';

/**
 * Standardized helper for sending successful API responses.
 * @param res Express Response object.
 * @param data The data payload to send.
 * @param message An optional success message.
 * @param statusCode The HTTP status code (defaults to 200 OK).
 */
export function successResponse<T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = StatusCodes.OK,
): void {
  res.status(statusCode).json({
    success: true,
    status: statusCode,
    message,
    data,
  });
}

/**
 * Standardized helper for sending error API responses.
 * This helper is typically used for known, handled errors before the global error middleware.
 * For unhandled errors, the global error middleware in app.ts will take over.
 * @param res Express Response object.
 * @param message The error message.
 * @param statusCode The HTTP status code (defaults to 500 Internal Server Error).
 * @param errors Optional array of detailed error messages or objects.
 */
export function errorResponse(
  res: Response,
  message: string = 'An unexpected error occurred',
  statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
  errors?: string[] | object[],
): void {
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    errors,
  });
}
