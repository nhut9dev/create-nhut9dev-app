import { Request, Response, Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { JwtValidator } from '~infra/auth';
import { ServiceRegistry } from '~infra/services';
import { createAuthMiddleware, createOptionalAuthMiddleware } from '~presentation/middlewares';

interface GatewayRoutesConfig {
  serviceRegistry: ServiceRegistry;
  jwtValidator: JwtValidator;
}

/**
 * Setup gateway routes that proxy requests to microservices
 */
export function createGatewayRoutes(config: GatewayRoutesConfig): Router {
  const router = Router();
  const { serviceRegistry, jwtValidator } = config;

  // Middleware factories
  const authMiddleware = createAuthMiddleware(jwtValidator);
  const optionalAuthMiddleware = createOptionalAuthMiddleware(jwtValidator);

  // ===== User Service Routes =====
  router.use(
    '/api/users',
    authMiddleware, // Require authentication for user routes
    createProxyMiddleware({
      target: serviceRegistry.getServiceUrl('user'),
      changeOrigin: true,
      pathRewrite: {
        '^/api/users': '/api/users', // Keep the same path or rewrite as needed
      },
      onProxyReq: (proxyReq, req: Request) => {
        // Forward user info to the service
        if (req.user) {
          proxyReq.setHeader('X-User-Id', req.user.userId);
          proxyReq.setHeader('X-User-Email', req.user.email);
          if (req.user.role) {
            proxyReq.setHeader('X-User-Role', req.user.role);
          }
        }
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        (res as Response).status(502).json({
          success: false,
          message: 'Bad Gateway - User service unavailable',
        });
      },
    }),
  );

  // ===== Product Service Routes =====
  router.use(
    '/api/products',
    optionalAuthMiddleware, // Optional auth - public products, but can get user-specific data if authenticated
    createProxyMiddleware({
      target: serviceRegistry.getServiceUrl('product'),
      changeOrigin: true,
      pathRewrite: {
        '^/api/products': '/api/products',
      },
      onProxyReq: (proxyReq, req: Request) => {
        if (req.user) {
          proxyReq.setHeader('X-User-Id', req.user.userId);
        }
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        (res as Response).status(502).json({
          success: false,
          message: 'Bad Gateway - Product service unavailable',
        });
      },
    }),
  );

  // ===== Order Service Routes =====
  router.use(
    '/api/orders',
    authMiddleware, // Require authentication for orders
    createProxyMiddleware({
      target: serviceRegistry.getServiceUrl('order'),
      changeOrigin: true,
      pathRewrite: {
        '^/api/orders': '/api/orders',
      },
      onProxyReq: (proxyReq, req: Request) => {
        if (req.user) {
          proxyReq.setHeader('X-User-Id', req.user.userId);
          proxyReq.setHeader('X-User-Email', req.user.email);
          if (req.user.role) {
            proxyReq.setHeader('X-User-Role', req.user.role);
          }
        }
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        (res as Response).status(502).json({
          success: false,
          message: 'Bad Gateway - Order service unavailable',
        });
      },
    }),
  );

  return router;
}
