# syntax=docker/dockerfile:1

# Build context is the monorepo root (not this directory) — pnpm workspace
# installs resolve `workspace:*` deps against the root pnpm-lock.yaml, which
# only exists there, and the CD workflow's docker/build-push-action can't run
# a separate local pre-build step before `docker build`. So unlike
# docker-basics/code-along (which builds outside the image via `pnpm deploy`
# and packages the result), this Dockerfile does the whole build inside a
# builder stage. Build with:
#
#   docker build -f bootcamp/05-devops/ci-cd/code-along/Dockerfile \
#     -t devops-ci-cd-code-along .
#
# (run from the repo root)

# Stage 1: build
FROM node:26-alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
RUN corepack enable

WORKDIR /repo

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @bootcamp/devops-ci-cd-code-along run build
RUN pnpm deploy --filter @bootcamp/devops-ci-cd-code-along --prod --legacy /prod/code-along

# Stage 2: runtime
FROM node:26-alpine

WORKDIR /app

COPY --from=builder /prod/code-along/dist ./dist
COPY --from=builder /prod/code-along/package.json ./
COPY --from=builder /prod/code-along/node_modules ./node_modules

EXPOSE 3000
ENV NODE_ENV=production
USER node
CMD ["node", "dist/main.js"]
