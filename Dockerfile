# * Multi-stage Dockerfile for HealthLease Hub Backend
# * Optimized for production deployment with Bun runtime

# ====================================================================================
# STAGE 1: Base Image with Bun Runtime
# ====================================================================================
FROM oven/bun:1.1-alpine AS base

# * Set working directory
WORKDIR /app

# * Install system dependencies for production
RUN apk add --no-cache \
    ca-certificates \
    tzdata \
    && rm -rf /var/cache/apk/*

# * Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S healthlease -u 1001 -G nodejs

# ====================================================================================
# STAGE 2: Dependencies Installation
# ====================================================================================
FROM base AS deps

# * Copy package files
COPY package.json bun.lock* ./

# * Install dependencies with Bun (faster than npm/yarn)
RUN bun install --frozen-lockfile --production=false

# ====================================================================================
# STAGE 3: Build Stage
# ====================================================================================
FROM base AS builder

# * Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# * Copy source code
COPY . .

# * Generate Prisma client
RUN bunx prisma generate

# * Build the application
RUN bun run build

# * Remove development dependencies after build
RUN bun install --frozen-lockfile --production

# ====================================================================================
# STAGE 4: Production Runtime
# ====================================================================================
FROM base AS runner

# * Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# * Copy built application from builder stage
COPY --from=builder --chown=healthlease:nodejs /app/dist ./dist
COPY --from=builder --chown=healthlease:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=healthlease:nodejs /app/package.json ./package.json
COPY --from=builder --chown=healthlease:nodejs /app/prisma ./prisma

# * Switch to non-root user
USER healthlease

# * Expose port
EXPOSE 3000

# * Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD bun run --silent -e "fetch('http://localhost:3000/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# * Start the application
CMD ["bun", "run", "start"]
