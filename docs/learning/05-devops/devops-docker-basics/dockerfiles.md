# Docker Basics - Dockerfile

Every project requires initial setup:

1. Install a specific runtime
2. Copy configuration files
3. Execute package managers
4. Launch the server

Traditionally, these steps live in a README file. A developer reads the steps, types them into a terminal, and hopes for the best.
When someone skips a line, uses a globally installed package that conflicts, or runs commands out of order, this is where the "works on my machine" problem comes from.

A Dockerfile replaces the README's setup section with something a machine can execute. It is a plain text file, named `Dockerfile` with no file extension, that usually sits in the root of your project. Each line is one instruction, and the Docker Engine reads them from top to bottom to produce an image. Because the instructions are executed by Docker instead of followed by a person, the result is the same on every machine, every time.

## The Core Instructions

The format is deliberately simple. An instruction starts with an uppercase keyword (`FROM`, `COPY`, `RUN`) followed by its arguments, and a handful of these keywords cover almost everything you need in early projects. You do not need to describe a complete operating system either. Almost every Dockerfile starts from an existing base image that already contains an operating system and a runtime, and only adds what is specific to your application: your code, your dependencies, and the command that starts the app.

Let's look at a Dockerfile tailored for a typical Node.js application. Six commands are enough to containerize the app:

```dockerfile
FROM node:26-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
ENV DB_PASSWORD=password123456
EXPOSE 3000
CMD ["npm", "start"]
```

- `FROM node:26-alpine` selects the base image to build on. Everything else happens on top of it.
- `WORKDIR /app` sets the folder inside the image where the following instructions run. It also creates the folder if it does not exist. Without it, your files would land somewhere in the image's root filesystem.
- `COPY package*.json ./` copies `package.json` (and `package-lock.json`, thanks to the `*` wildcard) from your project into the image's working directory. `COPY` always copies from the build context, the folder you passed to `docker build`, into the image.
- `RUN npm install --only=production` executes a command inside the image during the build. Here it installs the dependencies listed in `package.json`. The `--only=production` flag skips development dependencies like test runners, which the running app does not need.
- `COPY . .` copies the rest of the project, your actual application code, into the image.
- `ENV DB_PASSWORD=password123456` sets a default environment variable inside the image. Applications can read this at runtime just like they would read from a local .env file. You can override this value later when you start the container.
- `EXPOSE 3030:3000` tells Docker to map the host's port 3030 to the container's port 3000.
- `CMD ["npm", "start"]` defines the command a container runs when it starts. The square-bracket form is a JSON array: the first element is the program, the rest are its arguments.

To prevent copying the node_modules folder or .env files from the host into the image, you can use a `.dockerignore` file that works like a `.gitignore` file.

## Base Images

The `FROM` line is always first, because every other instruction modifies the image it names. You rarely build from an empty image. Installing an operating system and a Node.js runtime by hand would take dozens of instructions and is a solved problem, so you start from an official image that already did that work.

The name `node:26-alpine` has two parts:

- `node` is the image name, here the official Node.js image from Docker Hub.
- `26-alpine` is the tag. `26` pins the major Node version, so a rebuild next year still uses Node 26 instead of silently jumping to a newer release. `alpine` refers to **Alpine Linux**, an extremely lightweight, security-oriented Linux distribution used as the base operating system for this Docker image. While standard Node.js Docker images are based on heavier distributions like Debian which can be 50 - 100 MB+, the Alpine version is only around 5 MB. This makes builds fast and images lighter.

Pinning a version in the tag matters more than it looks. `FROM node` without a tag means `node:latest`, and `latest` changes over time. The whole point of the Dockerfile is reproducibility, and an unpinned base image quietly undermines it.

## Build Time vs. Start Time

`RUN` and `CMD` look similar, both hold a command, and mixing them up is the most common beginner mistake in Dockerfiles.

- `RUN` executes while the image is being built. Its result, for example the installed `node_modules` folder, is baked into the image. A `RUN` instruction runs once per build, not when containers start.
- `CMD` executes when a container starts. It is not run during the build at all; it is stored in the image as the default startup command. Every container created from the image runs it, every time.

A useful test: does the step produce files the app needs (install, compile, download)? Then it belongs in `RUN`. Is it the act of starting the application itself? Then it is the `CMD`. A Dockerfile can contain many `RUN` instructions but only one effective `CMD`; if you write several, only the last one counts.

## Build Cache

Notice how we copied `package.json` and ran `npm install` before copying the rest of the application code. This is a deliberate strategy to speed up builds.

Every instruction in a Dockerfile creates a distinct "layer". Docker caches these layers. When you rebuild an image, Docker reuses the cached layers from the top down until it detects a change. Application source code changes constantly; dependencies change rarely. By placing the `npm install` step above the source code `COPY ` step, the heavy dependency installation remains securely cached. Docker will only execute the quick source code copy during your day-to-day iterations. If we had copied everything on line 3, a single typo fix in a controller would trigger a full, painful slow `npm install` on the next build.

You do not have to manage this cache. Ordering instructions from least-changing to most-changing is enough to benefit from it.

## Resources

[Dockerfile reference](https://docs.docker.com/reference/dockerfile/)
[Node.js official image on Docker Hub](https://hub.docker.com/_/node)
[Docker build cache](https://docs.docker.com/build/cache/)
