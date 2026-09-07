# Docker Basics - Intro

## Learning Objectives

- Explain the core Docker terms: Docker Engine, Docker Hub, Dockerfile, image, and container.
- Describe the basic workflow from writing a Dockerfile to running and sharing an image.
- Execute foundational Docker CLI commands to build, run, pull, and push.
- Containerize a web application and manage its runtime environment variables.

## Overview

Many development problems are not caused by application code. They come from environment differences: A NestJS application might run perfectly on your macOS laptop but crash immediately on a teammate's Windows machine or the production server. These failures may happen because of mismatched Node.js versions, missing system libraries, or conflicting global dependencies.

Docker solves this by wrapping the application and its entire runtime environment into a single, standardized unit called a container. Instead of writing a complex setup guide and hoping every developer follows it flawlessly, you define the environment in code. This guarantees that your application starts exactly the same way, regardless of the host operating system.

This module is structured to get you building and running containers quickly. We start by clearing the terminology so you know exactly which artifact you are interacting with. From there, you will set up your local environment, write your first Dockerfile, inject environment variables, and push a working image to a public registry.
