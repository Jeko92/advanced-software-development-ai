# Docker Basics - Docker Terminology

When developers first encounter Docker, the terminology often creates an immediate barrier. You might hear a teammate say "run the Dockerfile" or "push the container," even though those actions apply to entirely different objects. This mix-up directly slows down debugging. If an error surfaces in your terminal, you need to quickly identify whether the failure happened in the build instructions, the packaged artifact, or the running instance.

Separating these concepts early makes the entire workflow logical. Think of this in terms of traditional software development: you write source code, compile it into an executable, and run that executable as a process. Docker uses an identical paradigm.

## Dockerfile (The Source Code)

A Dockerfile is the plain-text build definition. It contains a list of instructions, such as selecting a base operating system, copying your application files, installing dependencies, and defining the default startup command. Nothing executes here; it is purely the recipe.

## Image (The Executable)

An image is the build artifact produced by reading a Dockerfile. It represents a frozen, read-only snapshot containing your application code, dependencies, and runtime configuration. Because an image is immutable, you can distribute it to any machine and guarantee it remains exactly the same.

## Container (The Process)

A container is a live, running instance of an image. It executes the packaged application inside an isolated environment. You can start, stop, restart, and destroy containers independently without ever altering the underlying image.

## Docker Engine (The Local Runtime)

Docker Engine is the background service running on your machine that actually does the heavy lifting. When you type commands to build an image or start a container, the Docker Engine executes that work. It manages the local storage for your images and the lifecycle of your containers.

## Docker Hub (The Registry)

Docker Hub is a public registry where developers store and share images. It functions exactly like npm does for JavaScript packages or GitHub for source code. When you want to add a Postgres database to your stack, you download the official Postgres image from Docker Hub rather than building it from scratch.

## Resources

[Docker overview](https://docs.docker.com/get-started/docker-overview/)
[Docker Hub](https://hub.docker.com/)
