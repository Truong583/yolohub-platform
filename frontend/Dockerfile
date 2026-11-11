
# ============================================================
# YOLOHUB FRONTEND - PRODUCTION DOCKERFILE
# Next.js Standalone Build
# ============================================================

# ------------------------------------------------------------
# STAGE 1: INSTALL DEPENDENCIES
# ------------------------------------------------------------

FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm install

# ------------------------------------------------------------
# STAGE 2: BUILD NEXT.JS APPLICATION
# ------------------------------------------------------------

FROM node:20-alpine AS builder

WORKDIR /app

# API URL được truyền từ GitHub Actions khi Docker Build
# NEXT_PUBLIC_* được Next.js đóng gói vào frontend bundle
ARG NEXT_PUBLIC_API_URL=https://api.truongtest.id.vn/api/v1
ARG NEXT_PUBLIC_SITE_URL=https://truongtest.id.vn

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

COPY --from=deps /app/node_modules ./node_modules

COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ------------------------------------------------------------
# STAGE 3: PRODUCTION RUNTIME
# ------------------------------------------------------------

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000
ENV HOSTNAME="0.0.0.0"

# Tạo user không có quyền root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Tạo thư mục Next.js
RUN mkdir .next && chown nextjs:nodejs .next

# Copy các file cần thiết từ build stage
COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs \
    /app/.next/standalone ./

COPY --from=builder --chown=nextjs:nodejs \
    /app/.next/static ./.next/static

# Chạy bằng user thường
USER nextjs

EXPOSE 4000

CMD ["node", "server.js"]
