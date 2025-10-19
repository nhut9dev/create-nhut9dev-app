import { CustomError } from './CustomError';

/**
 * Error for authentication failures (e.g., invalid token).
 */
export class UnauthorizedError extends CustomError {
  constructor(message: string = 'Unauthorized', statusCode: number = 401) {
    super(message, statusCode);
  }
}
