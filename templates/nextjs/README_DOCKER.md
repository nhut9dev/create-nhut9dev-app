# Docker Setup Guide

This Next.js project includes Docker support for easy deployment.

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

Edit `.env` and add your environment variables. Remember:
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Other variables are only available server-side

### 2. Start with Docker Compose

#### Production Mode

```bash
# Build and start the application
docker compose up -d

# View logs
docker compose logs -f

# Check service status
docker compose ps
```

The application will be available at `http://localhost:3000`

#### Development Mode

Uncomment the `nextjs-dev` service in `docker-compose.yml`, then:

```bash
# Start development server
docker compose up nextjs-dev

# The app will auto-reload on code changes
```

### 3. Stop Services

```bash
# Stop all services
docker compose down
```

## Docker Commands

### Build Docker Image

```bash
# Build production image
docker build -t nextjs-app .

# Build with custom tag
docker build -t nextjs-app:1.0.0 .
```

### Run Container Manually

```bash
# Run production container
docker run -d \
  --name nextjs-app \
  -p 3000:3000 \
  --env-file .env \
  nextjs-app

# View logs
docker logs -f nextjs-app

# Stop container
docker stop nextjs-app
docker rm nextjs-app
```

## Health Check

The application includes a health check endpoint:

```bash
curl http://localhost:3000/api/health
```

Docker will automatically monitor this endpoint and restart the container if unhealthy.

## Build Optimization

The Dockerfile uses Next.js standalone output mode for optimized builds:

- **Smaller image size** - Only includes necessary files
- **Faster deployments** - Reduced image size means faster push/pull
- **Production-ready** - Optimized for production use

Build stages:
1. **deps** - Install dependencies
2. **builder** - Build the application
3. **runner** - Production runtime (final image)

## Environment Variables

### Public Variables (exposed to browser)

```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_APP_NAME=My App
```

Access in code:
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

### Private Variables (server-side only)

```env
DATABASE_URL=postgresql://...
API_SECRET_KEY=secret123
```

Access only in server components, API routes, or server actions:
```typescript
const dbUrl = process.env.DATABASE_URL;
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, change the `PORT` in `.env` file:

```env
PORT=3001
```

And update `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"
```

### Build Errors

If you encounter build errors:

```bash
# Clear Docker cache and rebuild
docker compose build --no-cache

# Check build logs
docker compose up --build
```

### Image Size Too Large

The production image should be under 200MB. If it's larger:

1. Check `.dockerignore` - ensure unnecessary files are excluded
2. Verify `output: 'standalone'` is set in `next.config.ts`
3. Remove unused dependencies from `package.json`

### Development Mode Not Working

If development mode doesn't auto-reload:

1. Ensure volumes are mounted correctly in `docker-compose.yml`
2. Check that you're using the `nextjs-dev` service
3. Verify file permissions on mounted volumes

### Reset Everything

```bash
# Stop and remove all containers
docker compose down

# Remove images
docker rmi nextjs-app

# Rebuild from scratch
docker compose up --build
```

## Production Deployment

For production deployment:

1. **Set Environment Variables**
   ```env
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   ```

2. **Build Optimized Image**
   ```bash
   docker build -t nextjs-app:production .
   ```

3. **Security Considerations**
   - Never commit `.env` files
   - Use Docker secrets for sensitive data
   - Run container as non-root user (already configured)

4. **Use Reverse Proxy**
   - Deploy behind nginx or traefik for SSL
   - Enable HTTP/2 and compression
   - Set up rate limiting

5. **Scaling**
   ```bash
   docker compose up --scale nextjs=3
   ```

## Best Practices

1. **Layer Caching**
   - Package files copied first for better layer caching
   - Source code copied after dependencies

2. **Multi-stage Build**
   - Separates build and runtime dependencies
   - Keeps final image small

3. **Non-root User**
   - Runs as `nextjs` user for security
   - UID 1001, GID 1001

4. **Health Checks**
   - Container automatically restarts if unhealthy
   - Prevents serving broken deployments

## Example Deployment Workflow

```bash
# 1. Update code
git pull origin main

# 2. Update environment
vim .env

# 3. Rebuild and restart
docker compose down
docker compose up --build -d

# 4. Check logs
docker compose logs -f

# 5. Verify health
curl http://localhost:3000/api/health
```

## Common Docker Compose Commands

```bash
# View logs for specific service
docker compose logs -f nextjs

# Rebuild specific service
docker compose up --build nextjs

# Execute command in running container
docker compose exec nextjs sh

# View resource usage
docker stats

# Clean up unused resources
docker system prune -a
```
