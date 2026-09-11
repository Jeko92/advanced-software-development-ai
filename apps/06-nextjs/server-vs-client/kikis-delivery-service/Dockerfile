# Dev-only image. Installs the whole pnpm workspace (this app depends on
# sibling packages via `workspace:*`, so the build context is the repo
# root — see docker-compose.yml). Source is bind-mounted in at runtime;
# this image just provides a ready `node_modules` and runs `next dev`.
FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY . .
RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/06-nextjs/server-vs-client/kikis-delivery-service

EXPOSE 3000

CMD ["pnpm", "run", "dev"]
