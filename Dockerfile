# Multi-stage Docker build for Tendzd Bahrain Multi-Vendor Platform
# Optimized for production deployment with Arabic font support and security

# Stage 1: Dependencies
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install dependencies with clean cache
RUN npm ci --only=production && npm cache clean --force

# Install Arabic fonts for PDF generation and image processing
RUN apk add --no-cache \
    fontconfig \
    ttf-dejavu \
    ttf-liberation \
    fonts-noto-arabic \
    && fc-cache -f

# Stage 2: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copy source code
COPY . .

# Set build-time environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=1

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Stage 3: Runtime
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install Arabic fonts in runtime
RUN apk add --no-cache \
    fontconfig \
    ttf-dejavu \
    ttf-liberation \
    fonts-noto-arabic \
    && fc-cache -f

# Copy public assets
COPY --from=builder /app/public ./public

# Create .next directory with proper permissions
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma files
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# Create directories for file uploads and cache
RUN mkdir -p /app/uploads /app/cache /app/logs
RUN chown -R nextjs:nodejs /app/uploads /app/cache /app/logs

# Health check script
COPY --chown=nextjs:nodejs <<EOF /app/healthcheck.js
const http = require('http');

const options = {
  host: 'localhost',
  port: process.env.PORT || 3000,
  path: '/api/health',
  timeout: 2000,
};

const request = http.request(options, (res) => {
  console.log(\`Health check status: \${res.statusCode}\`);
  process.exitCode = res.statusCode === 200 ? 0 : 1;
});

request.on('error', (err) => {
  console.error('Health check failed:', err);
  process.exitCode = 1;
});

request.end();
EOF

# Set up health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

USER nextjs

EXPOSE 3000

# Start the application
CMD ["node", "server.js"]

# Labels for metadata
LABEL maintainer="Tendzd Platform Team"
LABEL description="Bahrain Multi-Vendor E-commerce Platform"
LABEL version="1.0.0"
LABEL org.opencontainers.image.title="Tendzd Platform"
LABEL org.opencontainers.image.description="Next.js 15 multi-vendor platform with Arabic RTL support"
LABEL org.opencontainers.image.source="https://github.com/tendzd/bahrain-platform"
LABEL org.opencontainers.image.vendor="Tendzd"