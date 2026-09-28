# Dev-only image, same pattern as the Next.js code-alongs in this bootcamp
# (see bootcamp/06-nextjs/*/code-along/Dockerfile): installs the whole pnpm
# workspace (this app depends on sibling packages via `workspace:*`, so the
# build context is the repo root — see ../docker-compose.yml), then relies on
# a bind-mounted source directory at runtime and runs `nest start --watch`
# for hot reload.
FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY . .
RUN pnpm install --frozen-lockfile

WORKDIR /app/bootcamp/07-realtime-communication/polling-and-sse/code-along/api

EXPOSE 3030

CMD ["pnpm", "run", "dev"]
