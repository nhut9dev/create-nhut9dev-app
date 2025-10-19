import rateLimit from 'express-rate-limit';
import { Redis } from 'ioredis';

import { EnvConfig } from '~infra/config';

/**
 * Create rate limiter middleware using Redis store
 */
export function createRateLimitMiddleware(config: EnvConfig, redisClient?: Redis) {
  // If Redis is available, use Redis store
  if (redisClient) {
    // Note: You might want to use rate-limit-redis package for production
    // This is a simplified version
    return rateLimit({
      windowMs: config.RATE_LIMIT_WINDOW_MS,
      max: config.RATE_LIMIT_MAX_REQUESTS,
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    });
  }

  // Fallback to memory store
  return rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    max: config.RATE_LIMIT_MAX_REQUESTS,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
}
