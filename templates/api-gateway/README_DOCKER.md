# Docker Setup Guide

This API Gateway includes Docker support for easy deployment with Redis caching.

## Prerequisites

- Docker (version 20.10 or higher) with Docker Compose v2
  - Docker Compose v2 is included with Docker Desktop
  - For Linux, follow [official installation guide](https://docs.docker.com/compose/install/)
  - Verify installation: `docker compose version`

## Quick Start

### 1. Setup Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` and update the values as needed, especially:
- `JWT_SECRET` - Change this to a secure random string in production
- `USER_SERVICE_URL`, `PRODUCT_SERVICE_URL`, `ORDER_SERVICE_URL` - Set your microservice URLs
- `REDIS_PASSWORD` - Set a password for Redis in production (optional)

### 2. Start with Docker Compose

#### Production Mode

```bash
# Build and start all services
docker compose up -d

# View logs
docker compose logs -f

# Check service status
docker compose ps
```

The API Gateway will be available at `http://localhost:8080`

Redis will be available at `localhost:6379`

#### Development Mode

Uncomment the `gateway-dev` service in `docker-compose.yml`, then:

```bash
# Start development services
docker compose up gateway-dev redis

# The gateway will auto-reload on code changes
```

### 3. Stop Services

```bash
# Stop all services
docker compose down

# Stop and remove volumes (caution: clears Redis cache)
docker compose down -v
```

## Docker Commands

### Build Docker Image

```bash
# Build production image
docker build -t api-gateway .

# Build with custom tag
docker build -t api-gateway:1.0.0 .
```

### Run Container Manually

```bash
# Run production container
docker run -d \
  --name api-gateway \
  -p 8080:8080 \
  --env-file .env \
  api-gateway

# View logs
docker logs -f api-gateway

# Stop container
docker stop api-gateway
docker rm api-gateway
```

## Health Check

The API Gateway includes a health check endpoint:

```bash
curl http://localhost:8080/health
```

Docker will automatically monitor this endpoint and restart the container if unhealthy.

## Testing with Mock Services

The `docker-compose.yml` includes commented-out mock microservices for testing. To enable them:

1. Uncomment the `user-service`, `product-service`, and `order-service` sections
2. Update your `.env` to point to these services:

```env
USER_SERVICE_URL=http://user-service:1080
PRODUCT_SERVICE_URL=http://product-service:1080
ORDER_SERVICE_URL=http://order-service:1080
```

3. Start the services:

```bash
docker compose up -d
```

## Redis Configuration

Redis is configured with:
- Max memory: 256MB
- Eviction policy: allkeys-lru (removes least recently used keys)
- AOF persistence enabled

To monitor Redis:

```bash
# Connect to Redis CLI
docker compose exec redis redis-cli

# Monitor commands
docker compose exec redis redis-cli monitor

# Check memory usage
docker compose exec redis redis-cli info memory
```

## Volumes

Docker Compose creates the following volume:

- `redis_data` - Redis persistence files

To clear Redis cache:

```bash
docker compose exec redis redis-cli FLUSHALL
```

## Troubleshooting

### Port Already in Use

If port 8080 is already in use, change the `PORT` in `.env` file:

```env
PORT=8081
```

### Redis Connection Failed

Check if Redis is running:

```bash
docker compose ps redis
docker compose logs redis
```

### Gateway Can't Connect to Microservices

Make sure your microservices are accessible from Docker:
- If services run on host machine, use `host.docker.internal` instead of `localhost`
- If services run in Docker, ensure they're on the same network

Example for services on host:

```env
USER_SERVICE_URL=http://host.docker.internal:3001
```

### Reset Everything

```bash
# Stop and remove all containers, networks, and volumes
docker compose down -v

# Rebuild from scratch
docker compose up --build
```

## Production Deployment

For production deployment:

1. Update `.env` with production values
2. Set strong `JWT_SECRET`
3. Enable Redis password protection:
   ```env
   REDIS_PASSWORD=your-secure-password
   ```
4. Configure rate limiting based on your needs
5. Use a reverse proxy (nginx, traefik) for SSL termination
6. Monitor Redis memory usage and adjust limits
7. Set up Redis persistence backups if needed

## Network Architecture

When using Docker Compose, all services are on the `gateway-network`:

```
┌─────────────────────┐
│   API Gateway       │
│   (port 8080)       │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
┌────▼───┐  ┌───▼────────┐
│ Redis  │  │ Micro-     │
│ Cache  │  │ services   │
└────────┘  └────────────┘
```

Microservices outside Docker should be reachable via the configured URLs.
