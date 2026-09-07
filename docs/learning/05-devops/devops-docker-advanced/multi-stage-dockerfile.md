# Docker Advanced - Multi-Stage Dockerfile

In basics you wrote a single-stage Dockerfile: one `FROM`, install dependencies, copy the code, set a start command. That works, but it bundles two jobs that have nothing to do with each other into the same image. One job is building the app: installing every dependency, compiling, running whatever turns your source into something runnable. The other job is running it. The build job needs compilers, type definitions, and development dependencies. The run job needs none of that. When both happen in one stage, all the build-time baggage ends up baked into the image you ship.

This matters once the scoreboard service is written in TypeScript. TypeScript does not run directly when using node; it has to be compiled to JavaScript first, which means the image needs the TypeScript compiler and the `devDependencies` that come with it. A single-stage image would carry the compiler, the type packages, and your original `.ts` source files to production, none of which the running app touches. The image is bigger than it needs to be, and it exposes more than it needs to.

A multi-stage Dockerfile splits these two jobs apart inside one file. You write more than one `FROM` instruction, and each `FROM` starts a new stage with its own clean filesystem. The first stage does the messy build work. The second stage starts fresh and copies in only the finished result, the compiled `dist` folder, leaving the compiler and the source behind. Docker runs every stage during the build but keeps only the last one as the final image. Everything in the earlier stages is discarded once their output has been copied forward. The result is a smaller image that contains the running app and its production dependencies, and nothing from the workbench it was built on.

## The build stage

Here is a multi-stage Dockerfile for the TypeScript version of the scoreboard service. The first stage compiles the app:

```dockerfile
# Stage 1: build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
```

- `FROM node:22-alpine AS builder` starts the first stage and gives it the name `builder`. The name is what later stages use to refer back to this one. `alpine` is a minimal base image, smaller than the `slim` variant you saw in basics, which fits a chapter about keeping images small.
- `WORKDIR /app` sets the working directory for this stage. Every path that follows is relative to `/app`, so the build output lands in `/app/dist`.
- `COPY package*.json ./` and `RUN npm ci` installs the dependencies based on the `package-lock.json` file. It is a reproducable install and does not alter the lock file. It is preferable for production since it produces less unexpected behavior.
- `COPY . .` copies the rest of the source into the stage, and `RUN npm run build` compiles it. For the scoreboard, the `build` script runs `tsc`, which turns the TypeScript in `src/` into JavaScript in `dist/`.

## The runtime stage

The second stage starts from a fresh base image and takes only what the running app needs:

```dockerfile
# Stage 1 : build
FROM node:22-alpine AS builder
...

# Stage 2: runtime
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]
```

- The second `FROM node:22-alpine` begins a new stage with an empty filesystem. Nothing from the build stage exists here unless it is copied in explicitly. This stage has no name because it is the last one, and the last stage becomes the final image.
- `WORKDIR /app` sets the working directory again. Each stage is independent, so the working directory from the build stage does not carry over.
- `COPY --from=builder /app/dist ./dist` is the instruction that connects the two stages. Instead of copying from the build context on your machine, `--from=builder` copies from the filesystem of the `builder` stage. Here it pulls the compiled `dist` folder forward and leaves the TypeScript source behind.
- `COPY --from=builder /app/package*.json ./` brings the dependency manifest across so the next step knows what to install.
- `RUN npm ci --omit=dev` installs only the production dependencies. The `--omit=dev` flag skips `devDependencies` such as the TypeScript compiler, which the compiled app does not need at runtime.
- `EXPOSE 3000` documents the port the app listens on, `ENV NODE_ENV=production` sets the environment to production, and `CMD ["npm", "start"]` starts the app when a container starts.

## Building the image

The build command is the same one from basics. Docker reads the whole file and runs the stages in order:

```bash
docker build -t scoreboard-service:v2 .
```

Docker executes the build stage, then the runtime stage, and discards the build stage once its output has been copied forward. The image that lands in `docker images` is the runtime stage alone, without the compiler, the `devDependencies`, or the original source.

## Single-stage versus multi-stage

The two approaches package the same app but ship very different images:

| Aspect           | Single-stage Dockerfile        | Multi-stage Dockerfile         |
| ---------------- | ------------------------------ | ------------------------------ |
| Final image size | Larger, includes build tools   | Smaller, runtime files only    |
| Build artifacts  | Source and `dist` both present | Only `dist` copied forward     |
| Dependencies     | Production and dev installed   | Production only in final image |
| Build tools      | Compiler ships to production   | Compiler stays in build stage  |

## Resources

- [Multi-stage builds - Docker Docs](https://docs.docker.com/build/building/multi-stage/)
- [NestJS deployment guide](https://docs.nestjs.com/deployment)
- [Node.js official image on Docker Hub](https://hub.docker.com/_/node)
