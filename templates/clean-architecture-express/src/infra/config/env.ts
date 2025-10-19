import 'dotenv/config';

// Ensure dotenv is loaded at the earliest point

/**
 * Interface defining the structure of expected environment variables.
 */
export interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  JWT_SECRET: string; // For authentication middleware
}

/**
 * Loads and validates environment variables.
 * Throws an error if critical variables are missing, ensuring the application
 * starts with a valid configuration.
 * @returns The validated environment configuration object.
 */
export function loadEnvConfig(): EnvConfig {
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const JWT_SECRET = process.env.JWT_SECRET;

 

  if (!JWT_SECRET) {
    throw new Error('Environment variable JWT_SECRET is not defined.');
  }

  return {
    PORT,
    NODE_ENV,
    JWT_SECRET,
  };
}
