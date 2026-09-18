# syntax=docker/dockerfile:1
#
# This app lives inside a pnpm workspace monorepo, so the build context for
# this Dockerfile must be the **repo root**, not this directory — pnpm
# workspace installs resolve `workspace:*` deps against the root
# pnpm-lock.yaml, which only exists there. Build with (run from the repo
# root):
#   docker build -f apps/04-nestjs/dark-bay/Dockerfile -t dark-bay .
# The CD workflow (.github/workflows/dark-bay-cd.yml) does exactly this.
#
# Same `pnpm deploy` pattern as
# bootcamp/05-devops/ci-cd/code-along/Dockerfile: install/build inside the
# full workspace, then prune to a self-contained, non-workspace copy for the
# runtime stage. This isn't just an optimization — running anything
# workspace-aware (`pnpm install`/`pnpm run`) inside the runtime container
# was the actual bug: pnpm checks a workspace member's node_modules against
# the store metadata recorded by whichever user last touched it, and since
# the builder stage installs as root while the runtime stage runs as the
# non-root `node` user, it decided the mismatch meant node_modules was
# invalid — and reinstalled all 88 workspace projects from the registry at
# every container start, which is what was actually causing Render's "no
# open ports detected" (it never finished in time). A `pnpm deploy`'d
# package is no longer a workspace member at all, so that check never
# triggers, and the runtime CMD below never invokes the `pnpm` CLI anyway.
#
# devDependencies are kept (no `--prod` on the deploy step, unlike
# code-along's): the CMD runs `typeorm-ts-node-commonjs` before starting the
# app, which needs ts-node/typescript at container start, not just at build
# time — and therefore, unlike code-along (which only ever runs pre-compiled
# JS at runtime), also needs a working tsconfig.json at runtime. That's the
# one place this pattern needs an extra step: `pnpm deploy` doesn't
# materialize `workspace:*` devDependencies at all — it symlinks them to
# their absolute path *on the host that ran the build*, which is obviously
# dangling once copied into a fresh image. code-along never notices because
# it never resolves tsconfig.json outside the build stage; see the
# `@bootcamp/tsconfig` copy below for why this one does.

# Stage 1: build
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@11.20.0 --activate
WORKDIR /repo

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @bootcamp/dark-bay build
RUN pnpm deploy --filter @bootcamp/dark-bay --legacy /prod/dark-bay
# Replace the dangling `workspace:*` symlink (see comment above) with the
# real (tiny, static, dependency-free) package contents.
RUN rm -f /prod/dark-bay/node_modules/@bootcamp/tsconfig && \
    cp -r /repo/packages/tsconfig /prod/dark-bay/node_modules/@bootcamp/tsconfig

# Stage 2: runtime
FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder --chown=node:node /prod/dark-bay ./

EXPOSE 3030
ENV PORT=3030
USER node

# Apply pending migrations, then start the compiled app. Postgres connection
# comes from DATABASE_URL (+ optional DATABASE_SSL) — see src/db/data-source.ts.
# Invoked directly via the bin shim, not `pnpm run migration:run` — see the
# top-of-file comment for why that distinction matters here.
CMD ["sh", "-c", "node_modules/.bin/typeorm-ts-node-commonjs -d src/db/data-source.ts migration:run && node dist/src/main"]
