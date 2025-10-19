import 'dotenv/config';

import { App } from './app';
import { JwtValidator } from '~infra/auth';
import { RedisClient } from '~infra/cache';
import { loadEnvConfig } from '~infra/config';
import { ServiceRegistry } from '~infra/services';
import { createGatewayRoutes } from '~presentation/routes';

async function bootstrap(): Promise<void> {
  try {
    // 1. Load environment configuration
    const envConfig = loadEnvConfig();
    const PORT = envConfig.PORT;

    console.log('🚀 Starting API Gateway...');
    console.log(`📝 Environment: ${envConfig.NODE_ENV}`);

    // 2. Initialize Redis (optional - comment out if not using Redis)
    let redisClient: RedisClient | undefined;
    try {
      redisClient = new RedisClient(envConfig);
      console.log('✅ Redis connected');
    } catch (error) {
      console.warn('⚠️  Redis connection failed, continuing without cache:', error);
    }

    // 3. Initialize Service Registry
    const serviceRegistry = new ServiceRegistry(envConfig);
    console.log('✅ Service Registry initialized');
    console.log('📡 Registered services:');
    serviceRegistry.getAllServices().forEach((url, name) => {
      console.log(`   - ${name}: ${url}`);
    });

    // 4. Initialize JWT Validator
    const jwtValidator = new JwtValidator(envConfig);
    console.log('✅ JWT Validator initialized');

    // 5. Create gateway routes
    const gatewayRouter = createGatewayRoutes({
      serviceRegistry,
      jwtValidator,
    });

    // 6. Initialize Express app
    const appInstance = new App({
      config: envConfig,
      gatewayRouter,
      redisClient: redisClient?.getClient(),
    });

    const app = appInstance.getApp();

    // 7. Start HTTP server
    app
      .listen(PORT, () => {
        console.log('');
        console.log('🎉 API Gateway is running!');
        console.log(`🌐 Server: http://localhost:${PORT}`);
        console.log(`💚 Health: http://localhost:${PORT}/health`);
        console.log('');
        console.log('📌 Available routes:');
        console.log(`   - /api/users/*    -> ${envConfig.USER_SERVICE_URL}`);
        console.log(`   - /api/products/* -> ${envConfig.PRODUCT_SERVICE_URL}`);
        console.log(`   - /api/orders/*   -> ${envConfig.ORDER_SERVICE_URL}`);
        console.log('');
      })
      .on('error', (error: Error) => {
        console.error('❌ Server failed to start:', error.message);
        process.exit(1);
      });

    // Handle graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('⚠️  SIGTERM received, shutting down gracefully...');
      if (redisClient) {
        await redisClient.disconnect();
      }
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('⚠️  SIGINT received, shutting down gracefully...');
      if (redisClient) {
        await redisClient.disconnect();
      }
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Failed to bootstrap API Gateway:', error);
    process.exit(1);
  }
}

// Execute bootstrap
bootstrap();
