# Docker Advanced - Intro

## Learning Objectives

- Split a Dockerfile into a build stage and a runtime stage, and explain why the final image gets smaller and safer.
- Keep data alive after a container is gone using named volumes, and tell volumes, bind mounts, and tmpfs apart.
- Connect containers on a user-defined network so they reach each other by name, and isolate groups of containers that should not.
- Describe a multi-container application in a single `docker compose` file and bring the whole stack up and down with one command.
- Turn that stack into a development environment that runs inside a container, with live-reloaded source and an editor that opens directly into it.

## Overview

The basics session left you with one container at a time. You wrote a Dockerfile, built it into an image, ran the image, and pushed it to Docker Hub so the same artifact runs everywhere. That covers a single service that starts up, does its job, and needs nothing from the outside.

Real applications rarely stay that simple. The scoreboard service from the basics code-along needs a database to store player scores, and that database needs its data to survive a restart. The service and the database have to find each other and talk. The image you ship should not carry the compiler and the test runners that were only needed while building it. And once you have two, three, or four containers that belong together, starting them by hand with a separate `docker run` for each (in the right order, with the right flags) stops being practical.

This session adds the pieces that turn a single container into a working stack. Multi-stage builds shrink the image by throwing away everything the running app does not need. Volumes give a container somewhere to keep data that outlives it. Networks let containers reach each other by name instead of by guessing IP addresses. Docker Compose ties all of that together in one file, so the whole setup starts with a single command. The last chapter turns that stack into a development environment, where you edit code on your machine but run it inside the container. Each chapter picks up the Night Shift Arcade project from basics and extends it, so the examples build on one image you already understand.
