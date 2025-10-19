import { NextFunction, Request, Response } from 'express';

import { JwtValidator } from '~infra/auth';
import { UnauthorizedError } from '~presentation/errors';

/**
 * Extend Express Request to include user payload
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role?: string;
        [key: string]: unknown;
      };
    }
  }
}

/**
 * Authentication middleware - validates JWT token
 */
export function createAuthMiddleware(jwtValidator: JwtValidator) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedError('No authorization header provided');
      }

      // Extract token from "Bearer <token>"
      const parts = authHeader.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        throw new UnauthorizedError('Invalid authorization header format');
      }

      const token = parts[1];
      const payload = jwtValidator.verify(token);

      // Attach user info to request
      req.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };

      next();
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        next(error);
      } else {
        next(new UnauthorizedError('Invalid or expired token'));
      }
    }
  };
}

/**
 * Optional authentication - doesn't fail if no token provided
 */
export function createOptionalAuthMiddleware(jwtValidator: JwtValidator) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader) {
        const parts = authHeader.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
          const token = parts[1];
          const payload = jwtValidator.verify(token);
          req.user = {
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
          };
        }
      }

      next();
    } catch (error) {
      // Silently ignore invalid tokens in optional auth
      next();
    }
  };
}
