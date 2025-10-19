import cors from 'cors';
import express, { Application, NextFunction, Request, Response, Router } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { EnvConfig } from '~infra/config';
import { CustomError } from '~presentation/errors';
import { createRateLimitMiddleware, requestLogger } from '~presentation/middlewares';
import { StatusCodes } from '~shared/constants';

export interface AppDependencies {
  config: EnvConfig;
  gatewayRouter: Router;
  redisClient?: unknown; // Optional Redis client for rate limiting
}

export class App {
  private app: Application;
  private config: EnvConfig;
  private gatewayRouter: Router;

  constructor(dependencies: AppDependencies) {
    this.app = express();
    this.config = dependencies.config;
    this.gatewayRouter = dependencies.gatewayRouter;

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  /**
   * Configure global middleware
   */
  private initializeMiddleware(): void {
    this.app.use(helmet()); // Security headers
    this.app.use(cors()); // Enable CORS
    this.app.use(express.json()); // Parse JSON payloads
    this.app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads
    this.app.use(morgan('dev')); // HTTP request logger
    this.app.use(requestLogger); // Custom request logger

    // Rate limiting
    const rateLimiter = createRateLimitMiddleware(this.config);
    this.app.use(rateLimiter);
  }

  /**
   * Setup routes
   */
  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(StatusCodes.OK).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        service: 'API Gateway',
      });
    });

    // Gateway routes (proxy to microservices)
    this.app.use('/', this.gatewayRouter);
  }

  /**
   * Error handling middleware
   */
  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const error = new Error(`Not Found - ${req.originalUrl}`);
      res.status(StatusCodes.NOT_FOUND);
      next(error);
    });

    // Global error handler
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(err.stack);

      let statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;
      let message = 'An unexpected error occurred.';

      if (err instanceof CustomError) {
        statusCode = err.statusCode;
        message = err.message;
      } else if (res.statusCode !== StatusCodes.OK) {
        statusCode = res.statusCode;
        message = err.message;
      } else {
        message = err.message;
      }

      res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
      });
    });
  }

  /**
   * Get Express app instance
   */
  public getApp(): Application {
    return this.app;
  }
}
