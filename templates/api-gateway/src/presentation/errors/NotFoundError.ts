import { CustomError } from './CustomError';

/**
 * Error for resources not found.
 */
export class NotFoundError extends CustomError {
  constructor(message: string = 'Resource not found', statusCode: number = 404) {
    super(message, statusCode);
  }
}
