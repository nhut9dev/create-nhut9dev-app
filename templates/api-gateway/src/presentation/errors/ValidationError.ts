import { CustomError } from './CustomError';

/**
 * Error for invalid input or request payload.
 */
export class ValidationError extends CustomError {
  constructor(message: string = 'Validation Error', statusCode: number = 400) {
    super(message, statusCode);
  }
}
