# Docker Basics - Setup

Docker isn't a single program you run from the terminal. The `docker` command you type is only a thin client. The actual work (e.g. building images, starting containers, managing their state) happens in a background service called the Docker daemon.

If that background service is offline, your terminal will inevitably throw a `Cannot connect to the Docker daemon error`. To make this ecosystem run smoothly on personal machines, we use Docker Desktop. It bundles the command-line tool, the daemon, and a lightweight Linux virtual machine into a single application. Because containers rely heavily on specific Linux kernel features, both macOS and Windows require this hidden VM to execute them properly.

## The Docker Daemon

A daemon is a program that runs permanently in the background and waits for requests, the same idea as a web server. The Docker daemon (the process is called `dockerd`) is the part of Docker that holds all the state: it stores your images, creates and supervises your containers, and talks to registries like Docker Hub.

The `docker` command line tool does none of this itself. When you type `docker run`, the client sends a request to the daemon through an API, and the daemon does the work. The output you see in your terminal is the daemon's response, relayed by the client.

## Installation

Download the installer directly from the official Docker Desktop page.

- [macOS Users](https://docs.docker.com/desktop/setup/install/mac-install/)
- [Windows Users](https://docs.docker.com/desktop/setup/install/windows-install/)

### Docker Desktop on macOS

There are two builds, one for Apple silicon (M-series chips) and one for Intel chips. Pick the one that matches your Mac; you can check under the Apple menu, About This Mac.

After installation, start Docker from Applications. The first start asks for your password because Docker needs elevated privileges to set up its networking and the Linux VM.

### Docker Desktop on Windows

On Windows, the Linux environment for the daemon is provided by WSL 2, the Windows Subsystem for Linux, a Microsoft feature that runs a real Linux kernel inside Windows. The Docker Desktop installer enables WSL 2 for you if it is not active yet; accept the option "Use WSL 2 instead of Hyper-V" during installation. You may need to restart Windows once after the installation finishes.

Two things commonly get in the way on Windows:

- Virtualization must be enabled in the BIOS/UEFI firmware. On most modern machines it already is; if Docker Desktop complains about virtualization, that setting is the place to look.
- WSL 2 may need a manual update on older Windows installations. Running `wsl --update` in a terminal brings it to the current version.

After installation, start Docker Desktop from the Start menu. As on macOS, the daemon is only available while Docker Desktop is running.

## Verifying the Connection

Once Docker Desktop is open and running in the background, open your terminal and verify that the client can talk to the daemon:

```bash
docker version
```

The output has two sections, Client and Server. The Client section appears as soon as the command line tool is installed. The Server section is the daemon answering. If you see both, the whole chain works. If the Client section appears but the Server section is replaced by a connection error, the installation is fine and the daemon is simply not running; start Docker Desktop.

To prove the engine can actually download an image and execute it, run the official test container:

```bash
docker run hello-world
```

The daemon will reach out to Docker Hub, pull a tiny test image, and run it. If your terminal prints "Hello from Docker!", your entire chain (client, daemon, Linux VM, and network access) is functioning perfectly. You are ready to start containerizing applications.

## Resources

[Install Docker Desktop on Mac](https://docs.docker.com/desktop/setup/install/mac-install/)
[Install Docker Desktop on Windows](https://docs.docker.com/desktop/setup/install/windows-install/)
[Docker Desktop overview](https://docs.docker.com/desktop/)
[WSL 2 documentation](https://learn.microsoft.com/en-us/windows/wsl/)
