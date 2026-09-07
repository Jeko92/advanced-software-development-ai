# Docker Basics - Docker CLI

Knowing the difference between a Dockerfile, an image, and a container does not tell you what to type into your terminal. To actually use Docker, you have to execute a specific set of CLI commands.

The sequence of operations is straightforward: you tell Docker to build an image from your instructions, run that image as a background process, inspect the logs when things inevitably break, and push the final artifact to a registry. Mastering these specific commands is what gives you control over your local development environment.

## Building the Image

The build step translates your plain-text Dockerfile into a frozen, executable snapshot.

```bash
docker build -t <your-image-name> .
```

- `-t` names the image, optionally with a tag (for example `myapp:1.0`; if you give no tag, Docker uses `latest`). Without `-t`, Docker only assigns a random ID hash, and every later step, running and pushing, refers to the image by name. Tag it now or you will be copying hashes around later.
- `.` sets the build context to the current folder. The build context is the set of files Docker is allowed to see during the build, so a `COPY` instruction in the Dockerfile can only copy files from inside it. If you have a `Dockerfile` in this location, it will be used automatically.

One consequence catches most beginners: the image is a snapshot. If you edit your code after building, the image still contains the old code. You have to rebuild to pick up changes.

> A Note on Naming Conventions:  
> _You can technically name a local image anything you want (like `my-nestjs-app:1.0`). However, if you ever plan to push that image to Docker Hub, the registry demands a strict format: `<your-username>/<image-name>:<version>`. Without your username attached, Docker Hub assumes you are trying to overwrite an official public image and will immediately reject the push with an access error. To save an extra re-tagging step later, many developers simply include their registry username right in the initial build command: `docker build -t yourusername/my-nestjs-app:1.0 .`_

## Running a container

An image does nothing by itself. To execute the application inside it, Docker creates a container from the image: a running, isolated instance.

```bash
docker run --name <your-container> -d <your-image-name>
```

- `--name` gives the container a name you choose. Docker would otherwise assign a random one, and every command that comes later, reading logs, stopping, removing, needs a way to refer to this exact container.
- `-d` runs the container detached, in the background. Most containerized applications are servers that run until told to stop. Without `-d`, the container takes over your terminal and you cannot type the next command until it exits.

## The container lifecycle

Detached containers come with a catch: you cannot see them. There is no window, no terminal output, nothing on screen that tells you whether your application is running or crashed two seconds after start. A second catch follows from the first. A container that stops is not deleted. It stays on disk, in a stopped state, and keeps its name reserved, which is why a second `docker run --name` with the same name fails. While you iterate on an app, building, running, fixing, running again, you accumulate stopped containers and old images. These commands let you see and clean up that state:

- `docker ps` lists running containers. This is how you check whether your container is actually up.
- `docker ps --all` also lists stopped containers, including the ones that crashed on startup. If `docker ps` does not show your container, look here.
- `docker stop <container_id>` stops a running container.
- `docker start <container_id>` starts a stopped container again, without creating a new one.
- `docker rm <container_id>` removes a stopped container and frees its name.
- `docker images` lists the images on your machine.
- `docker image rm <image_name>` removes an image you no longer need. Images pile up with every rebuild and take real disk space.
- `docker inspect <object_id>` prints the full metadata of a container or other Docker object, useful when you need details like network settings.
- `docker image inspect <image_name>` does the same for an image.

## Pulling and Pushing Images

So far the image exists only on your machine, which means the central promise of Docker, the same artifact runs everywhere, stops at your own laptop. Docker Hub is the registry that closes this gap. You push your image there; teammates and servers pull it from there.

```bash
docker push <your-dockerhub-username>/<your-image-name>
```

The image name must start with your Docker Hub username because the registry organizes images by account, the same way GitHub organizes repositories.

Pulling is the same mechanism from the consumer side:

```bash
docker pull postgres
```

This downloads the official Postgres image from Docker Hub. It is a common way to get a local database during development: you get a running Postgres database without installing Postgres on your machine.

```bash
docker run --name local-db -d -p 5432:5432 postgres
```

- `-p 5432:5432` maps a port in the format `host:container`. Containers are isolated, so an application listening on a port inside the container is unreachable from your machine until you map it. With this mapping, local applications connect with `mongodb://localhost:5432`.

## Resources

[Dockerfile reference](https://docs.docker.com/reference/dockerfile/)
[Docker CLI reference](https://docs.docker.com/reference/cli/docker/)
