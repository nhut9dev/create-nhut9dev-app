# {{projectName}}

API Gateway for microservices architecture built with Node.js, Express, and TypeScript.

## Features

- ✅ **Request Routing** - Proxy requests to microservices
- ✅ **Authentication** - JWT token validation (stateless)
- ✅ **Rate Limiting** - Protect services from abuse
- ✅ **Caching** - Redis integration for response caching
- ✅ **Service Discovery** - Service registry pattern
- ✅ **Logging** - Winston logger with structured logging
- ✅ **Error Handling** - Centralized error management
- ✅ **CORS & Security** - Helmet.js security headers
- ✅ **TypeScript** - Full type safety
- ✅ **Hot Reload** - Development with nodemon

## Architecture

```
API Gateway (Port 8080)
├── /api/users/*    ──► User Service (Port 3001)
├── /api/products/* ──► Product Service (Port 3002)
└── /api/orders/*   ──► Order Service (Port 3003)
```

## Getting Started

### Prerequisites

- Node.js >= 18
- Redis (optional, for caching and distributed rate limiting)
- Running microservices (user, product, order services)

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

3. Configure environment variables:
```env
# Server
PORT=8080
NODE_ENV=development

# JWT Secret (must match your auth service)
JWT_SECRET=your_super_secret_jwt_key

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Microservices URLs
USER_SERVICE_URL=http://localhost:3001
PRODUCT_SERVICE_URL=http://localhost:3002
ORDER_SERVICE_URL=http://localhost:3003

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

### Development

Start development server:
```bash
npm run dev
```

### Build & Production

```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## API Endpoints

### Health Check
```
GET /health
```

Response:
```json
{
  "status": "UP",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "API Gateway"
}
```

### Proxied Routes

All routes are forwarded to corresponding microservices:

#### User Service
```
GET    /api/users/*       (requires auth)
POST   /api/users/*       (requires auth)
PUT    /api/users/*       (requires auth)
DELETE /api/users/*       (requires auth)
```

#### Product Service
```
GET    /api/products/*    (optional auth)
POST   /api/products/*    (optional auth)
PUT    /api/products/*    (optional auth)
DELETE /api/products/*    (optional auth)
```

#### Order Service
```
GET    /api/orders/*      (requires auth)
POST   /api/orders/*      (requires auth)
PUT    /api/orders/*      (requires auth)
DELETE /api/orders/*      (requires auth)
```

## Authentication

The gateway validates JWT tokens and forwards user information to microservices via headers:

```
Authorization: Bearer <token>
```

Forwarded headers to microservices:
- `X-User-Id`: User ID from token
- `X-User-Email`: User email
- `X-User-Role`: User role (if present)

Example request:
```bash
curl -H "Authorization: Bearer eyJhbGc..." \
     http://localhost:8080/api/users/profile
```

## Project Structure

```
src/
├── infra/                  # Infrastructure Layer
│   ├── config/            # Environment configuration
│   ├── services/          # Service registry, HTTP client
│   ├── cache/             # Redis client
│   └── auth/              # JWT validator
├── presentation/          # Presentation Layer
│   ├── middlewares/       # Auth, rate limit, logging
│   ├── routes/            # Gateway route definitions
│   └── errors/            # Custom error classes
├── shared/                # Shared utilities
│   ├── types/
│   ├── constants/
│   └── helpers/
├── app.ts                 # Express app setup
└── server.ts              # Server bootstrap
```

## Adding New Service Routes

To add a new microservice route:

**1. Add service URL to `.env`:**
```env
PAYMENT_SERVICE_URL=http://localhost:3004
```

**2. Update `EnvConfig` interface** (`src/infra/config/env.ts`):
```typescript
export interface EnvConfig {
  // ... existing
  PAYMENT_SERVICE_URL: string;
}
```

**3. Load environment variable** (`src/infra/config/env.ts`):
```typescript
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL;
```

**4. Register in Service Registry** (`src/infra/services/ServiceRegistry.ts`):
```typescript
this.services = new Map([
  // ... existing services
  ['payment', config.PAYMENT_SERVICE_URL],
]);
```

**5. Add route proxy** (`src/presentation/routes/gateway.routes.ts`):
```typescript
router.use(
  '/api/payments',
  authMiddleware,
  createProxyMiddleware({
    target: serviceRegistry.getServiceUrl('payment'),
    changeOrigin: true,
    pathRewrite: {
      '^/api/payments': '/api/payments',
    },
    onProxyReq: (proxyReq, req: Request) => {
      if (req.user) {
        proxyReq.setHeader('X-User-Id', req.user.userId);
      }
    },
    onError: (err, req, res) => {
      (res as Response).status(502).json({
        success: false,
        message: 'Bad Gateway - Payment service unavailable',
      });
    },
  }),
);
```

## Rate Limiting

Default rate limit: **100 requests per minute** per IP.

Customize in `.env`:
```env
RATE_LIMIT_WINDOW_MS=60000      # 1 minute
RATE_LIMIT_MAX_REQUESTS=100     # 100 requests
```

## Caching (Optional)

Redis caching is available but not enabled by default. To enable:

1. Start Redis server
2. Configure Redis in `.env`
3. Use `RedisClient` in your routes to cache responses

Example:
```typescript
const cacheKey = `users:${userId}`;
const cached = await redisClient.get(cacheKey);
if (cached) {
  return res.json(JSON.parse(cached));
}
// ... fetch from service
await redisClient.set(cacheKey, JSON.stringify(data), 300); // 5 min TTL
```

## Service Discovery

The current implementation uses a static `ServiceRegistry`. For production, consider:

- **Consul** - Service mesh with health checks
- **Eureka** - Netflix service discovery
- **Kubernetes** - Built-in service discovery
- **etcd** - Distributed configuration store

## Monitoring & Logging

Logs are output to console with Winston. For production, add:

- **File transports** - Persistent log storage
- **Log aggregation** - ELK stack, Datadog, etc.
- **Metrics** - Prometheus, Grafana
- **Tracing** - Jaeger, Zipkin

## Error Handling

The gateway handles errors from microservices:

- **502 Bad Gateway** - Service unavailable
- **401 Unauthorized** - Invalid/missing token
- **429 Too Many Requests** - Rate limit exceeded
- **500 Internal Server Error** - Unexpected errors

## Production Considerations

- [ ] Use HTTPS (TLS/SSL certificates)
- [ ] Implement circuit breakers (resilience4j, opossum)
- [ ] Add request/response transformation
- [ ] Implement API versioning
- [ ] Add WebSocket support if needed
- [ ] Set up load balancing
- [ ] Configure CORS properly for production
- [ ] Use environment-specific configs
- [ ] Add health checks for downstream services
- [ ] Implement distributed tracing

## License

MIT
