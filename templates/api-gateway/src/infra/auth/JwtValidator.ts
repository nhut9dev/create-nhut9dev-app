import jwt from 'jsonwebtoken';

import { EnvConfig } from '~infra/config';

export interface JwtPayload {
  userId: string;
  email: string;
  role?: string;
  [key: string]: unknown;
}

/**
 * JWT validation service for API Gateway
 * Validates tokens without database lookup (stateless)
 */
export class JwtValidator {
  private jwtSecret: string;

  constructor(config: EnvConfig) {
    this.jwtSecret = config.JWT_SECRET;
  }

  /**
   * Verify and decode JWT token
   */
  verify(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as JwtPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      throw new Error('Token verification failed');
    }
  }

  /**
   * Decode token without verification (for debugging)
   */
  decode(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (error) {
      return null;
    }
  }
}
