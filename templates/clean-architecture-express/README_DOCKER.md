# Docker Setup Guide

This project includes Docker support for easy deployment and development.

## Prerequisites

- Docker (version 20.10 or higher) with Docker Compose v2
  - Docker Compose v2 is included with Docker Desktop
  - For Linux, follow [official installation guide](https://docs.docker.com/compose/install/)
  - Verify installation: `docker compose version`

## Quick Start

This project supports multiple environments:
- **Local Development** - Run directly on your machine (no Docker needed)
- **Development with Docker** - Containerized dev environment with hot reload
- **Production** - Optimized production build in Docker

### Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure:
- `NODE_ENV` - Set to `development`, `staging`, or `production`
- `PORT` - Application port (default: 3000)
- `JWT_SECRET` - Secret key for JWT (use strong random string in production)
- `DATABASE_URL` - Database connection string (if using a database)

## Running the Application

### Option 1: Local Development (No Docker)

Best for rapid development with your local tools:

```bash
# Install dependencies
npm install

# Run development server with hot reload
npm run dev

# The app runs on http://localhost:3000
```

**Pros:**
- Fastest startup and hot reload
- Direct access to debugger
- No Docker overhead

**Cons:**
- Need to manage local dependencies
- Different from production environment

### Option 2: Development with Docker

Containerized development with hot reload:

```bash
# Build and start development environment
docker compose -f docker-compose.dev.yml up

# Run in background
docker compose -f docker-compose.dev.yml up -d

# View logs
docker compose -f docker-compose.dev.yml logs -f

# Stop services
docker compose -f docker-compose.dev.yml down
```

**Pros:**
- Isolated environment
- Closer to production setup
- Easy to add databases/services
- Hot reload with volume mounts

**Cons:**
- Slower startup than local
- Docker overhead

### Option 3: Production with Docker

Optimized production build:

```bash
# Build and start production environment
docker compose up -d

# View logs
docker compose logs -f

# Check service status
docker compose ps

# Stop services
docker compose down
```

**Pros:**
- Production-optimized build
- Minimal image size
- Security hardened (non-root user)

**Cons:**
- No hot reload
- Rebuild needed for code changes

## Adding a Database

The template doesn't include a database by default. Choose and configure based on your needs:

### MongoDB

1. Uncomment the `volumes:` section at the bottom of `docker-compose.yml`
2. Uncomment the `mongodb` service in `docker-compose.yml`
3. Uncomment the `mongodb_data` volume
4. Update `.env`:
   ```env
   DATABASE_URL=mongodb://admin:password@mongodb:27017/myapp?authSource=admin
   DB_USERNAME=admin
   DB_PASSWORD=password
   DB_NAME=myapp
   ```
5. Add `depends_on: mongodb` to the `app` service

### PostgreSQL

1. Uncomment the `volumes:` section at the bottom of `docker-compose.yml`
2. Uncomment the `postgres` service in `docker-compose.yml`
3. Uncomment the `postgres_data` volume
4. Update `.env`:
   ```env
   DATABASE_URL=postgresql://postgres:password@postgres:5432/myapp
   DB_USERNAME=postgres
   DB_PASSWORD=password
   DB_NAME=myapp
   ```
5. Add `depends_on: postgres` to the `app` service

### MySQL

1. Uncomment the `volumes:` section at the bottom of `docker-compose.yml`
2. Uncomment the `mysql` service in `docker-compose.yml`
3. Uncomment the `mysql_data` volume
4. Update `.env`:
   ```env
   DATABASE_URL=mysql://user:password@mysql:3306/myapp
   DB_USERNAME=user
   DB_PASSWORD=password
   DB_NAME=myapp
   DB_ROOT_PASSWORD=rootpassword
   ```
5. Add `depends_on: mysql` to the `app` service

### Redis (for caching)

1. Uncomment the `volumes:` section at the bottom of `docker-compose.yml`
2. Uncomment the `redis` service in `docker-compose.yml`
3. Uncomment the `redis_data` volume
4. Update `.env`:
   ```env
   REDIS_HOST=redis
   REDIS_PORT=6379
   ```

## Docker Commands

### Build Docker Image

```bash
# Build production image
docker build -t clean-arch-app .

# Build with custom tag
docker build -t clean-arch-app:1.0.0 .
```

### Run Container Manually

```bash
# Run production container
docker run -d \
  --name clean-arch-app \
  -p 3000:3000 \
  --env-file .env \
  clean-arch-app

# View logs
docker logs -f clean-arch-app

# Stop container
docker stop clean-arch-app
docker rm clean-arch-app
```

## Health Check

The application includes a health check endpoint:

```bash
curl http://localhost:3000/health
```

Docker will automatically monitor this endpoint and restart the container if unhealthy.

## Data Persistence

When you add a database service, Docker Compose will create volumes for data persistence. To backup data:

### MongoDB Backup
```bash
docker compose exec mongodb mongodump --out /data/backup
```

### PostgreSQL Backup
```bash
docker compose exec postgres pg_dump -U postgres myapp > backup.sql
```

### MySQL Backup
```bash
docker compose exec mysql mysqldump -u root -p myapp > backup.sql
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, change the `PORT` in `.env` file:

```env
PORT=3001
```

### Container Won't Start

Check logs for errors:

```bash
docker compose logs app
```

If using a database:
```bash
docker compose logs mongodb  # or postgres/mysql
```

### Database Connection Failed

1. Ensure the database service is running:
   ```bash
   docker compose ps
   ```

2. Check database logs:
   ```bash
   docker compose logs mongodb  # or postgres/mysql
   ```

3. Verify `DATABASE_URL` in `.env` matches your setup

### Reset Everything

```bash
# Stop and remove all containers, networks, and volumes
docker compose down -v

# Rebuild from scratch
docker compose up --build
```

## Production Deployment

For production deployment:

1. **Update Environment Variables**
   ```env
   NODE_ENV=production
   JWT_SECRET=<generate-secure-random-string>
   DATABASE_URL=<your-production-database-url>
   ```

2. **Secure Database**
   - Use strong passwords
   - Enable authentication
   - Use SSL/TLS connections
   - Restrict network access

3. **Use Docker Secrets** (for sensitive data)
   ```bash
   echo "my-secret" | docker secret create jwt_secret -
   ```

4. **Deploy Behind Reverse Proxy**
   - Use nginx or traefik for SSL termination
   - Enable HTTP/2 and compression
   - Set up rate limiting

5. **Monitor and Backup**
   - Set up health monitoring
   - Configure automated backups
   - Use volume snapshots

## Best Practices

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Use Docker secrets** for sensitive data in production
3. **Regular backups** of database volumes
4. **Monitor container health** with Docker health checks
5. **Keep images updated** - rebuild regularly for security patches
6. **Use specific image tags** instead of `latest` in production

## External Database

If you prefer using an external database (cloud-hosted):

1. Don't uncomment any database service in `docker-compose.yml`
2. Set `DATABASE_URL` in `.env` to your external database connection string
3. Start only the app service:
   ```bash
   docker compose up app
   ```

Example with external MongoDB Atlas:
```env
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/myapp?retryWrites=true&w=majority
```
