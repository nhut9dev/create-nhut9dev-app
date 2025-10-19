import Redis from 'ioredis';

import { EnvConfig } from '~infra/config';

/**
 * Redis client wrapper for caching
 */
export class RedisClient {
  private client: Redis;

  constructor(config: EnvConfig) {
    this.client = new Redis({
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
      password: config.REDIS_PASSWORD,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.client.on('connect', () => {
      console.log('Redis client connected');
    });

    this.client.on('error', (err) => {
      console.error('Redis client error:', err);
    });
  }

  /**
   * Get value from cache
   */
  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error(`Redis GET error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in cache with optional TTL (in seconds)
   */
  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.client.setex(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      console.error(`Redis SET error for key ${key}:`, error);
    }
  }

  /**
   * Delete value from cache
   */
  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error(`Redis DEL error for key ${key}:`, error);
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Redis EXISTS error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get Redis client instance
   */
  getClient(): Redis {
    return this.client;
  }

  /**
   * Close Redis connection
   */
  async disconnect(): Promise<void> {
    await this.client.quit();
  }
}
