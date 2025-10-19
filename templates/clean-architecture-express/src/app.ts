import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { CustomError } from '~presentation/errors';

import { StatusCodes } from '~shared/constants';

// Define an interface for the dependencies the App class needs.
// This promotes dependency inversion and allows for easier testing and modularity.
export interface AppDependencies {
  routers: express.Router[]; // An array of Express routers from your application layer
  // In a more complex setup, you might inject a logger, configuration, database connection, etc.
  // Example: logger: Logger; config: AppConfig;
}

export class App {
  private app: Application;
  private readonly routers: express.Router[];
  // private readonly logger: Logger; // Example of an injected logger

  constructor(dependencies: AppDependencies) {
    this.app = express();
    this.routers = dependencies.routers;
    // this.logger = dependencies.logger; // Assign injected logger

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  /**
   * Configures global middleware for the Express application.
   */
  private initializeMiddleware(): void {
    this.app.use(helmet()); // Secure your apps by setting various HTTP headers
    this.app.use(cors()); // Enable CORS with default options (consider more restrictive for production)
    this.app.use(express.json()); // Parse incoming requests with JSON payloads
    this.app.use(express.urlencoded({ extended: true })); // Parse incoming requests with URL-encoded payloads
    this.app.use(morgan('dev')); // HTTP request logger middleware ('dev' for development, 'combined' for production)
  }

  /**
   * Sets up the application's routes, including a basic health check and all injected routers.
   */
  private initializeRoutes(): void {
    // Basic health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(StatusCodes.OK).json({ status: 'UP', timestamp: new Date().toISOString() });
    });

    // Register all provided routers.
    // Each router typically represents a module or feature set within your application.
    this.routers.forEach((router) => {
      this.app.use('/', router); // Mount routers at the root path, or a specific base path like '/api'
    });
  }

  /**
   * Configures error handling middleware.
   * This should always be the last set of middleware.
   */
  private initializeErrorHandling(): void {
    // Catch 404 Not Found errors and forward to the general error handler
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const error = new Error(`Not Found - ${req.originalUrl}`);
      res.status(StatusCodes.NOT_FOUND);
      next(error); // Pass the error to the next middleware (our general error handler)
    });

    // General error handling middleware
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      // Log the error for debugging purposes (use a dedicated logger in production)
      console.error(err.stack);

      let statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;
      let message = 'An unexpected error occurred.';

      if (err instanceof CustomError) {
        statusCode = err.statusCode;
        message = err.message;
      } else if (res.statusCode !== StatusCodes.OK) {
        // If a status code was already set by a previous middleware (e.g., 404 handler)
        statusCode = res.statusCode;
        message = err.message;
      } else {
        message = err.message;
      }

      res.status(statusCode).json({
        success: false,
        message: message,
        // Only expose stack trace in non-production environments for security
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
      });
    });
  }

  /**
   * Returns the configured Express application instance.
   */
  public getApp(): Application {
    return this.app;
  }
}
