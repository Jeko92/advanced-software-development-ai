# Build context is the monorepo root (not this directory) — pnpm workspace
# installs resolve `workspace:*` deps against the root pnpm-lock.yaml, which
# only exists there. Build with:
#
#   docker build -f bootcamp/05-devops/docker-advanced/scoreboard-service/Dockerfile \
#     -t scoreboard-service:v2 .
#
# (run from the repo root)

# Stage 1: build
FROM node:22-alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
RUN corepack enable

WORKDIR /repo

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @bootcamp/devops-docker-advanced-scoreboard-service-multi-stage run build
RUN pnpm deploy --filter @bootcamp/devops-docker-advanced-scoreboard-service-multi-stage --prod --legacy /prod/scoreboard-service

# Stage 2: runtime
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /prod/scoreboard-service/dist ./dist
COPY --from=builder /prod/scoreboard-service/package.json ./
COPY --from=builder /prod/scoreboard-service/node_modules ./node_modules

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
