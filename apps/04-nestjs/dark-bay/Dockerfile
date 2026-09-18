# syntax=docker/dockerfile:1
#
# This app lives inside a pnpm workspace monorepo, so the build context for
# this Dockerfile must be the **repo root**, not this directory. Build with
# (run from the repo root):
#   docker build -f apps/04-nestjs/dark-bay/Dockerfile -t dark-bay .
# The CD workflow (.github/workflows/dark-bay-cd.yml) does exactly this.
#
# Two-stage build: install/build the whole workspace in a full toolchain
# image, then copy the entire resulting tree (including the pnpm-managed
# node_modules, whose per-package symlinks point back into the shared
# node_modules/.pnpm store at the repo root) into a lean runtime image.
# devDependencies are intentionally kept: the CMD below runs
# `pnpm run migration:run` before starting the app, and that script
# (typeorm-ts-node-commonjs) needs ts-node/typescript at container start,
# not just at build time. See src/app.module.ts for why migrations aren't
# loaded through the compiled app instead.

# Stage 1: install + build
FROM node:22-alpine AS builder

RUN corepack enable
WORKDIR /repo

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @bootcamp/dark-bay build

# Stage 2: runtime
FROM node:22-alpine

RUN corepack enable
WORKDIR /repo
ENV NODE_ENV=production

COPY --from=builder /repo ./

WORKDIR /repo/apps/04-nestjs/dark-bay
EXPOSE 3030
ENV PORT=3030
USER node

# Apply pending migrations, then start the compiled app. Postgres connection
# comes from DATABASE_URL (+ optional DATABASE_SSL) — see src/db/data-source.ts.
CMD ["sh", "-c", "pnpm run migration:run && node dist/src/main"]
