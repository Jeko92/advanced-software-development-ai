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

# `corepack enable` alone only installs shims — it still fetches the actual
# pnpm binary from the registry on first use. `prepare --activate` downloads
# and pins it into this layer at build time instead, so no image needs
# network access to npm's registry just to run pnpm at container start.
RUN corepack enable && corepack prepare pnpm@11.20.0 --activate
WORKDIR /repo

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @bootcamp/dark-bay build

# Stage 2: runtime
FROM node:22-alpine

# Pin COREPACK_HOME to a fixed path rather than corepack's default (under
# whichever user's home directory is active). The `node` user takes over
# below, and without this, `prepare --activate` here (run as root) caches
# pnpm somewhere the `node` user can't see — corepack would then think it's
# never been prepared and try to download it again at every container start.
ENV COREPACK_HOME=/opt/corepack
RUN corepack enable && corepack prepare pnpm@11.20.0 --activate
WORKDIR /repo
ENV NODE_ENV=production

COPY --from=builder /repo ./
# `migration:run` (via pnpm, in a workspace) writes scratch files at the
# workspace root, not just inside this app's own folder — without this, the
# non-root `node` user below can't write there and the container crashes
# before ever binding to a port.
RUN chown -R node:node /repo /opt/corepack

WORKDIR /repo/apps/04-nestjs/dark-bay
EXPOSE 3030
ENV PORT=3030
USER node

# Apply pending migrations, then start the compiled app. Postgres connection
# comes from DATABASE_URL (+ optional DATABASE_SSL) — see src/db/data-source.ts.
CMD ["sh", "-c", "pnpm run migration:run && node dist/src/main"]
