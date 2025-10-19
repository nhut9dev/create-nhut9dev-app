/**
 * Base custom error class for application-specific errors.
 * This allows for more granular error handling in the global error middleware.
 */
export class CustomError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean; // Indicates if this is an error the application can handle gracefully

  constructor(message: string, statusCode: number, isOperational: boolean = true) {
    super(message);
    this.name = this.constructor.name; // Set the error name to the class name
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor); // Captures stack trace for better debugging
  }
}
