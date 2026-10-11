# Branded application image.
#
# Builds YOUR image from a pinned upstream tag plus the codemod in this
# directory. Nothing is forked and no diff is stored: the branding is re-derived
# from whatever the pinned source says, every build.
#
#   docker build -f infra/overlay/Dockerfile \
#     --build-arg UPSTREAM_TAG=v2.11.3 \
#     -t your-registry/app:v2.11.3-brand1 .
#
# Build context is the REPOSITORY ROOT, because the build needs
# packages/brand/brand.json and infra/overlay/apply-brand.mjs.
#
# WHY BUILD AT ALL, RATHER THAN RUN THE PUBLISHED IMAGE?
# The published image ships compiled CSS and compiled React. Colours and the
# logo are baked in at build time, so they cannot be overridden by an
# environment variable at runtime. If you are content with upstream's visual
# identity and only want your own domain and page titles, skip this file
# entirely and run the published image — that is the cheapest option and it is
# a legitimate one. See docs/02-where-to-edit-the-app.md, "Tier 0".

# ---------------------------------------------------------------------------
# Stage 1 — fetch the pinned upstream source
# ---------------------------------------------------------------------------
FROM alpine/git:latest AS source

ARG UPSTREAM_REPO=https://github.com/gitroomhq/postiz-app
ARG UPSTREAM_TAG=v2.11.3

WORKDIR /src
# Shallow clone of exactly one tag: fast, and it pins the input precisely.
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

# The upstream build needs these for sharp/canvas-style native deps.
RUN apk add --no-cache libc6-compat python3 make g++ git

WORKDIR /app
COPY --from=branded /work/app ./

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--max-old-space-size=4096

RUN corepack enable \
    && pnpm install --frozen-lockfile --prefer-offline \
    && pnpm run build \
    && pnpm prune --prod

# ---------------------------------------------------------------------------
# Stage 4 — runtime
# ---------------------------------------------------------------------------
FROM node:22-alpine AS runtime

RUN apk add --no-cache libc6-compat caddy supervisor \
    && addgroup -S app && adduser -S app -G app

WORKDIR /app
COPY --from=build --chown=app:app /app ./

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Carries the brand identity into the image so a running container can be
# identified without shelling in, and so a smoke test can assert on it.
ARG UPSTREAM_TAG=v2.11.3
LABEL org.opencontainers.image.title="Branded social scheduler"
LABEL org.opencontainers.image.source="https://github.com/Khaliddxx/scheduler"
LABEL org.opencontainers.image.licenses="AGPL-3.0"
LABEL app.upstream.tag="${UPSTREAM_TAG}"

# AGPL-3.0 section 13: users interacting over a network must be offered the
# Corresponding Source of the MODIFIED version. The manifest records exactly
# what was modified; the repository above carries the codemod that made the
# modification. Keep both.
COPY --from=branded --chown=app:app /work/app/.brand-manifest.json ./.brand-manifest.json

USER app
EXPOSE 5000
CMD ["pnpm", "run", "start:prod"]
