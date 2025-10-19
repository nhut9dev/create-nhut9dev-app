import { CustomError } from './CustomError';

/**
 * Error for conflicts, e.g., trying to create a resource that already exists.
 */
export class ConflictError extends CustomError {
  constructor(message: string = 'Conflict', statusCode: number = 409) {
    super(message, statusCode);
  }
}
