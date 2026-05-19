# syntax=docker/dockerfile:1.7
# Multi-stage build for revroute-docs (Next.js 15 + Nextra docs).
# Builds inside Docker — works for CI runners with enough RAM (~3-4 GB).
# For RAM-constrained hosts, build natively + use Dockerfile.serve.
#
# Build:
#   docker build -t revroute-docs:latest .
# Run:
#   docker run --rm -p 3335:3000 --env-file .env revroute-docs:latest

############################################
# Stage 1: deps — install npm dependencies
############################################
FROM node:20-slim AS deps
WORKDIR /app

# Caching: package-lock.json change invalidates this layer; source edits don't.
COPY package.json package-lock.json ./

# npm ci is deterministic + faster than npm install when lockfile exists
RUN --mount=type=cache,target=/root/.npm \
    npm ci

############################################
# Stage 2: builder — generate llms.txt + next build + pagefind index
############################################
FROM node:20-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* must be present at build time — Next.js inlines them.
ARG NEXT_PUBLIC_YANDEX_METRIKA_ID
ENV NEXT_PUBLIC_YANDEX_METRIKA_ID=${NEXT_PUBLIC_YANDEX_METRIKA_ID}

# Build-time env: API URL to fetch program data for static pages.
ARG REVROUTE_API_URL
ARG REVROUTE_WORKSPACE_ID
ARG REVROUTE_PUBLIC_DOMAIN
ENV REVROUTE_API_URL=${REVROUTE_API_URL}
ENV REVROUTE_WORKSPACE_ID=${REVROUTE_WORKSPACE_ID}
ENV REVROUTE_PUBLIC_DOMAIN=${REVROUTE_PUBLIC_DOMAIN}

ENV NEXT_TELEMETRY_DISABLED=1

# `npm run build` runs:
#   prebuild  → generate-llms-full.mjs (writes llms.txt)
#   build     → next build (with output: 'standalone')
#   postbuild → pagefind (static search index in public/_pagefind/)
RUN --mount=type=cache,id=next,target=/app/.next/cache \
    npm run build

############################################
# Stage 3: runner — minimal runtime
############################################
FROM node:20-slim AS runner
WORKDIR /app

RUN groupadd -g 1001 nodejs \
    && useradd -u 1001 -g nodejs -s /bin/sh nextjs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Standalone output: server.js + minimal node_modules (only traced deps).
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Public assets including pagefind search index from postbuild
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
