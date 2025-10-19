import 'dotenv/config';

/**
 * Interface defining the structure of expected environment variables.
 */
export interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  JWT_SECRET: string;

  // Redis
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD?: string;

  // Microservices URLs
  USER_SERVICE_URL: string;
  PRODUCT_SERVICE_URL: string;
  ORDER_SERVICE_URL: string;

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
}

/**
 * Loads and validates environment variables.
 * Throws an error if critical variables are missing.
 */
export function loadEnvConfig(): EnvConfig {
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const JWT_SECRET = process.env.JWT_SECRET;

  const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
  const REDIS_PORT = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379;
  const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

  const USER_SERVICE_URL = process.env.USER_SERVICE_URL;
  const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL;
  const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL;

  const RATE_LIMIT_WINDOW_MS = process.env.RATE_LIMIT_WINDOW_MS
    ? parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10)
    : 60000;
  const RATE_LIMIT_MAX_REQUESTS = process.env.RATE_LIMIT_MAX_REQUESTS
    ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10)
    : 100;

  if (!JWT_SECRET) {
    throw new Error('Environment variable JWT_SECRET is not defined.');
  }

  if (!USER_SERVICE_URL || !PRODUCT_SERVICE_URL || !ORDER_SERVICE_URL) {
    throw new Error('Microservice URLs must be defined in environment variables.');
  }

  return {
    PORT,
    NODE_ENV,
    JWT_SECRET,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD,
    USER_SERVICE_URL,
    PRODUCT_SERVICE_URL,
    ORDER_SERVICE_URL,
    RATE_LIMIT_WINDOW_MS,
    RATE_LIMIT_MAX_REQUESTS,
  };
}
