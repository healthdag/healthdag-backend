# Docker Setup for HealthLease Hub Backend

This document provides instructions for building and running the HealthLease Hub Backend using Docker.

## Prerequisites

- Docker installed and running
- Git (to clone the repository)

## Quick Start

### 1. Build the Docker Image

```bash
# Build the image
docker build -t healthlease-hub-backend:latest .

# Or use the build script
./docker-build.sh
```

### 2. Run the Container

```bash
# Run with basic configuration
docker run -d \
  --name healthlease-backend \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  healthlease-hub-backend:latest

# Run with environment file
docker run -d \
  --name healthlease-backend \
  -p 3000:3000 \
  --env-file .env \
  healthlease-hub-backend:latest
```

### 3. Access the Application

- **API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **API Documentation**: http://localhost:3000/ui
- **OpenAPI Spec**: http://localhost:3000/doc

## Environment Variables

Copy `env.example` to `.env` and configure the following variables:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Application
NODE_ENV=production
PORT=3000

# Web3 (BlockDAG)
RPC_URL=https://rpc.blockdag.network
PRIVATE_KEY=your_private_key_here
BLOCKDAG_NETWORK=mainnet

# IPFS (Pinata)
PINATA_JWT=your_pinata_jwt_here
PINATA_GATEWAY=https://gateway.pinata.cloud

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

## Docker Commands

### Build Commands

```bash
# Build image
docker build -t healthlease-hub-backend:latest .

# Build with specific tag
docker build -t healthlease-hub-backend:v1.0.0 .

# Build without cache
docker build --no-cache -t healthlease-hub-backend:latest .
```

### Run Commands

```bash
# Run container
docker run -d --name healthlease-backend -p 3000:3000 healthlease-hub-backend:latest

# Run with environment variables
docker run -d \
  --name healthlease-backend \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="your-secret" \
  healthlease-hub-backend:latest

# Run with volume mounts
docker run -d \
  --name healthlease-backend \
  -p 3000:3000 \
  -v $(pwd)/logs:/app/logs \
  healthlease-hub-backend:latest
```

### Management Commands

```bash
# View running containers
docker ps

# View container logs
docker logs healthlease-backend

# Follow logs
docker logs -f healthlease-backend

# Stop container
docker stop healthlease-backend

# Start container
docker start healthlease-backend

# Remove container
docker rm healthlease-backend

# Remove image
docker rmi healthlease-hub-backend:latest
```

## Production Deployment

### 1. Build Production Image

```bash
docker build -t healthlease-hub-backend:prod .
```

### 2. Run with Production Settings

```bash
docker run -d \
  --name healthlease-backend-prod \
  -p 3000:3000 \
  --restart unless-stopped \
  --env-file .env.production \
  healthlease-hub-backend:prod
```

### 3. Health Monitoring

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' healthlease-backend-prod

# Test health endpoint
curl http://localhost:3000/health
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Find process using port 3000
   lsof -i :3000
   
   # Kill process or use different port
   docker run -p 3001:3000 healthlease-hub-backend:latest
   ```

2. **Container Won't Start**
   ```bash
   # Check logs
   docker logs healthlease-backend
   
   # Check container status
   docker ps -a
   ```

3. **Database Connection Issues**
   ```bash
   # Verify DATABASE_URL is correct
   # Ensure database is accessible from container
   # Check network connectivity
   ```

### Debug Mode

```bash
# Run container in interactive mode
docker run -it --rm \
  -p 3000:3000 \
  -e NODE_ENV=development \
  healthlease-hub-backend:latest \
  /bin/sh

# Run with debug logging
docker run -d \
  --name healthlease-backend-debug \
  -p 3000:3000 \
  -e DEBUG=true \
  -e LOG_LEVEL=debug \
  healthlease-hub-backend:latest
```

## Security Considerations

1. **Never commit `.env` files** - Use `env.example` as template
2. **Use strong JWT secrets** - Generate random strings
3. **Secure private keys** - Store in secure environment variables
4. **Run as non-root user** - Container runs as `healthlease` user
5. **Use HTTPS in production** - Configure reverse proxy with SSL

## Performance Optimization

1. **Multi-stage build** - Reduces final image size
2. **Alpine Linux** - Minimal base image
3. **Production dependencies only** - Removes dev dependencies
4. **Health checks** - Built-in container health monitoring
5. **Non-root user** - Security best practice

## Support

For issues or questions:
- Check container logs: `docker logs healthlease-backend`
- Verify environment variables
- Test health endpoint: `curl http://localhost:3000/health`
- Review this documentation
