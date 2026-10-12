# Branded application image.
#
# Builds YOUR image from a pinned upstream tag plus the codemod in this
# directory. Nothing is forked and no diff is stored: the branding is
# re-derived from whatever the pinned source says, every build.
#
#   docker build -f infra/overlay/Dockerfile \
#     --build-arg UPSTREAM_TAG=v2.11.3 \
#     -t your-registry/app:v2.11.3-brand1 .
#
# Build context is the REPOSITORY ROOT, because the build needs
# packages/brand/brand.json and infra/overlay/apply-brand.mjs.
#
# WHAT RUNS INSIDE
# ----------------
# This is not a one-process container. Upstream splits the product across four
# Node services and fronts them with a reverse proxy:
#
#   nginx     :5000   the only published port
#     /api/  -> :3000 backend   (NestJS)
#     /      -> :4200 frontend  (Next.js)
#     /uploads/        served straight off the volume
#   workers           queue consumer — THIS is what publishes scheduled posts
#   cron              scheduler ticks
#
# Miss the workers process and the app looks completely healthy while silently
# never publishing anything. That is the failure mode this comment exists to
# prevent.
#
# WHY BUILD AT ALL, RATHER THAN RUN THE PUBLISHED IMAGE?
# The published image ships compiled CSS and compiled React, so colours and the
# logo are baked in at build time and cannot be overridden by an environment
# variable at runtime. If you are content with upstream's visual identity and
# only want your own domain and page titles, run the published image instead —
# that is cheaper and entirely legitimate. See docs/02-where-to-edit-the-app.md.

# ---------------------------------------------------------------------------
# Stage 1 — fetch the pinned upstream source
# ---------------------------------------------------------------------------
FROM alpine/git:latest AS source

ARG UPSTREAM_REPO=https://github.com/gitroomhq/postiz-app
ARG UPSTREAM_TAG=v2.11.3

WORKDIR /src
RUN git clone --depth 1 --branch "${UPSTREAM_TAG}" "${UPSTREAM_REPO}" app \
    && rm -rf app/.git

# ---------------------------------------------------------------------------
# Stage 2 — apply the brand
# ---------------------------------------------------------------------------
FROM node:22-alpine AS branded

WORKDIR /work
COPY --from=source /src/app ./app
COPY packages/brand/brand.json ./packages/brand/brand.json
COPY infra/overlay/apply-brand.mjs ./infra/overlay/apply-brand.mjs

# The codemod exits non-zero if any anchor it depends on has moved, which fails
# the build rather than shipping a half-branded image. That is the point.
RUN node infra/overlay/apply-brand.mjs --target ./app \
    && node infra/overlay/apply-brand.mjs --target ./app --check

# ---------------------------------------------------------------------------
# Stage 3 — build the application from the branded source
# ---------------------------------------------------------------------------
FROM node:22-alpine AS build

# Native deps for sharp and the image pipeline.
RUN apk add --no-cache libc6-compat python3 make g++ git vips-dev

WORKDIR /app
COPY --from=branded /work/app ./

ENV NEXT_TELEMETRY_DISABLED=1
# The frontend build is the memory-hungry part of this monorepo.
ENV NODE_OPTIONS=--max-old-space-size=4096

# `dotenv -e ../../.env` prefixes every start script upstream ships. Without a
# file to read, dotenv exits non-zero and every service dies on boot. Real
# environment variables still win over an empty file.
RUN touch .env

RUN corepack enable \
    && pnpm install --frozen-lockfile \
    && pnpm run prisma-generate \
    && pnpm run build

# ---------------------------------------------------------------------------
# Stage 4 — runtime
# ---------------------------------------------------------------------------
FROM node:22-alpine AS runtime

RUN apk add --no-cache libc6-compat nginx supervisor vips \
    && adduser -S -D -H www \
    && mkdir -p /run/nginx /var/log/supervisor /uploads

WORKDIR /app
COPY --from=build /app ./

# Upstream's own nginx config: it already maps /api/, /uploads/ and / to the
# right places and forwards the custom headers the app relies on.
COPY --from=build /app/var/docker/nginx.conf /etc/nginx/nginx.conf

# supervisord owns all five processes. `autorestart=true` matters: a worker that
# dies takes scheduled publishing with it, and nothing else would notice.
RUN printf '%s\n' \
    '[supervisord]' \
    'nodaemon=true' \
    'logfile=/dev/stdout' \
    'logfile_maxbytes=0' \
    'user=root' \
    '' \
    '[program:backend]' \
    'command=pnpm run start:prod:backend' \
    'directory=/app' \
    'autorestart=true' \
    'stdout_logfile=/dev/stdout' \
    'stdout_logfile_maxbytes=0' \
    'stderr_logfile=/dev/stderr' \
    'stderr_logfile_maxbytes=0' \
    '' \
    '[program:frontend]' \
    'command=pnpm run start:prod:frontend' \
    'directory=/app' \
    'autorestart=true' \
    'stdout_logfile=/dev/stdout' \
    'stdout_logfile_maxbytes=0' \
    'stderr_logfile=/dev/stderr' \
    'stderr_logfile_maxbytes=0' \
    '' \
    '[program:workers]' \
    'command=pnpm run start:prod:workers' \
    'directory=/app' \
    'autorestart=true' \
    'stdout_logfile=/dev/stdout' \
    'stdout_logfile_maxbytes=0' \
    'stderr_logfile=/dev/stderr' \
    'stderr_logfile_maxbytes=0' \
    '' \
    '[program:cron]' \
    'command=pnpm run start:prod:cron' \
    'directory=/app' \
    'autorestart=true' \
    'stdout_logfile=/dev/stdout' \
    'stdout_logfile_maxbytes=0' \
    'stderr_logfile=/dev/stderr' \
    'stderr_logfile_maxbytes=0' \
    '' \
    '[program:nginx]' \
    'command=nginx -g "daemon off;"' \
    'autorestart=true' \
    'stdout_logfile=/dev/stdout' \
    'stdout_logfile_maxbytes=0' \
    'stderr_logfile=/dev/stderr' \
    'stderr_logfile_maxbytes=0' \
    > /etc/supervisord.conf

# Push the schema before anything starts, then hand over to supervisord.
RUN printf '%s\n' \
    '#!/bin/sh' \
    'set -e' \
    'echo "[entrypoint] syncing database schema"' \
    'pnpm run prisma-db-push' \
    'echo "[entrypoint] starting services"' \
    'exec supervisord -c /etc/supervisord.conf' \
    > /entrypoint.sh && chmod +x /entrypoint.sh

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NOT_SECURED=false

ARG UPSTREAM_TAG=v2.11.3
LABEL org.opencontainers.image.title="Branded social scheduler"
LABEL org.opencontainers.image.source="https://github.com/Khaliddxx/scheduler"
LABEL org.opencontainers.image.licenses="AGPL-3.0"
LABEL app.upstream.tag="${UPSTREAM_TAG}"

# AGPL-3.0 section 13: users interacting over a network must be offered the
# Corresponding Source of the MODIFIED version. The manifest records exactly
# what was modified; the repository above carries the codemod that made the
# modification. Keep both.
COPY --from=branded /work/app/.brand-manifest.json ./.brand-manifest.json

# nginx listens here; it is the only port that should be published.
EXPOSE 5000

CMD ["/entrypoint.sh"]
