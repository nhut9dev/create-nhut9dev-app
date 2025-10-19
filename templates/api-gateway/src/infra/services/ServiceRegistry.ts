import { EnvConfig } from '~infra/config';

/**
 * Service Registry - Maps service names to their URLs
 * In production, this could be replaced with service discovery (Consul, Eureka, etc.)
 */
export class ServiceRegistry {
  private services: Map<string, string>;

  constructor(config: EnvConfig) {
    this.services = new Map([
      ['user', config.USER_SERVICE_URL],
      ['product', config.PRODUCT_SERVICE_URL],
      ['order', config.ORDER_SERVICE_URL],
    ]);
  }

  /**
   * Get service URL by name
   */
  getServiceUrl(serviceName: string): string {
    const url = this.services.get(serviceName);
    if (!url) {
      throw new Error(`Service '${serviceName}' not found in registry`);
    }
    return url;
  }

  /**
   * Register a new service
   */
  register(serviceName: string, url: string): void {
    this.services.set(serviceName, url);
  }

  /**
   * Get all registered services
   */
  getAllServices(): Map<string, string> {
    return new Map(this.services);
  }
}
