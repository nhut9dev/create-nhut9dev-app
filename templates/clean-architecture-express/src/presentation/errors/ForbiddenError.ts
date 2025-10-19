import { CustomError } from './CustomError';

/**
 * Error for authorization failures (e.g., insufficient permissions).
 */
export class ForbiddenError extends CustomError {
  constructor(message: string = 'Forbidden', statusCode: number = 403) {
    super(message, statusCode);
  }
}
