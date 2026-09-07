# DevOps Docker Basics — Code-Along

A minimal "Hello World" NestJS app used to practice the fundamentals of
containerizing an application: writing a `Dockerfile`, building an image,
and running a container.

## Setup

```bash
pnpm install
```

## Commands

```bash
pnpm dev               # boot the app on http://localhost:3000
pnpm build              # compile to dist/
pnpm start:prod         # run the compiled app (node dist/main.js)
pnpm test               # unit specs under src/
pnpm test:e2e           # end-to-end spec under test/
pnpm typecheck
pnpm lint
```

## Containerizing it

The `Dockerfile` packages an **already-built** app - it does not install
dependencies or compile TypeScript inside the container. That's a
deliberate simplification for this basics lesson (multi-stage builds that
do the whole build inside Docker are covered in Docker Advanced).

This package lives in a **pnpm workspace**, so its `node_modules` isn't
self-contained - most entries are symlinks into the monorepo root's shared
pnpm store (`<repo-root>/node_modules/.pnpm/...`). A plain `docker build .`
here would only have this folder as build context, so
`COPY node_modules ./node_modules` would copy dangling symlinks, not the
actual packages - the container would fail at startup with
`Cannot find package '@nestjs/core'`. [`pnpm deploy`](https://pnpm.io/cli/deploy)
avoids that: it produces a self-contained copy of this package (real
files, no cross-workspace symlinks) in `.deploy/` (gitignored), and that's
what's actually built into the image.

Run these directly - no package.json scripts involved:

```bash
# 1. Build the app and produce a self-contained copy for Docker
pnpm install
pnpm build
pnpm --filter . deploy --prod --legacy .deploy

# 2. Build the image (context is .deploy/, not this directory)
docker build -t devops-docker-basics .deploy

# 3. Run it - foreground, so Ctrl+C stops and removes the container
docker run --rm -p 3000:3000 --env-file .env devops-docker-basics
```

Then visit http://localhost:3000 - you should see `Hello World!`. `Ctrl+C`
sends SIGINT to `docker run`, which stops the container; `--rm` then
removes it. That only works cleanly when `docker run` is the foreground
process in your terminal - piping it through another script/process
runner can swallow the signal and leave the container running.

If you'd rather run it in the background and manage it yourself:

```bash
docker run -d --name docker-basics -p 3000:3000 --env-file .env devops-docker-basics

docker ps                      # confirm it's running
docker logs -f docker-basics   # follow its output
docker stop docker-basics      # stop it
docker rm docker-basics        # remove the stopped container
```

`--env-file .env` demonstrates passing configuration into the container at
runtime instead of baking it into the image; the app only reads `PORT`
(see `.env.example`).
