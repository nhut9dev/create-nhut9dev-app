import 'dotenv/config';


import { App } from './app';
import { loadEnvConfig } from '~infra/config';
import { AppContainer } from '~infra/container';

async function bootstrap(): Promise<void> {
  // 1. Load Environment Configuration
  const envConfig = loadEnvConfig();
  const PORT = envConfig.PORT;

  // 2. Connect to Database

  // 3. Initialize Application Container
  const container = new AppContainer(envConfig);

  // 4. Register all application routers
  const appInstance = new App({
    routers: container.getAllRouters(),
  });

  const app = appInstance.getApp();

  // Start the HTTP server
  app
    .listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check available at http://localhost:${PORT}/health`);
    })
    .on('error', (error: Error) => {
      console.error(`Server failed to start: ${error.message}`);
      process.exit(1); // Exit with a failure code
    });
}

// Execute the bootstrap function
bootstrap();
