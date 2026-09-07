# Docker Advanced - Docker Compose

You can now run a container, give it a volume so its data survives, and put it on a network so it reaches other containers by name. The arcade stack uses all three: the scoreboard service, a Postgres database with a `pgdata` volume, and a network that connects them. Starting that stack by hand is a sequence of commands that has to run in the right order with the right flags. Create the network, start the database with its volume and password, then start the scoreboard on the same network with its connection string. Stopping it is the same dance in reverse. Get one flag wrong and the scoreboard cannot find the database.

This is tedious, and it is also easy to get subtly wrong, especially for a teammate who did not write the commands. The setup lives in your shell history or a README, which is exactly the "follow these steps by hand" problem that Dockerfiles solved for image building. Compose solves it again, one level up. Instead of a Dockerfile that describes one image, you write a `docker compose` file that describes a whole stack: which services run, which images or build contexts they use, what volumes they mount, what environment they need, and how they depend on each other.

With that file in place, `docker compose up` reads it and brings everything up in one step. Compose creates a network for the stack, starts the containers, mounts the volumes, and wires the environment, all from the description in the file. `docker compose down` tears it back down just as cleanly. The whole setup becomes a single file you commit to the repository, so every teammate runs the identical stack with one command. Compose is built for local development, where a frontend, a backend, and a database need to come up together; it is not a production orchestrator, but for getting a multi-container app running on your machine it removes almost all of the manual wiring.

## The compose file

A compose file is YAML, named `compose.yaml` (or `docker-compose.yml`, which is still accepted). It describes the arcade stack like this:

```yaml
services:
  scoreboard:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://arcade-master:arcade-password@db:5432/postgres
    depends_on:
      - db

  db:
    image: postgres:18
    environment:
      POSTGRES_USER: arcade-master
      POSTGRES_PASSWORD: arcade-password
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

The file has two top-level services, `scoreboard` and `db`, plus a `volumes` block that declares the named volume:

- `services` lists the containers that make up the stack. Each key under it (`scoreboard`, `db`) is a service, and its name matters later for networking.
- `build: .` tells Compose to build the `scoreboard` image from the Dockerfile in the current directory, the same build you ran by hand in the multi-stage chapter.
- `image: postgres:17` tells Compose to pull a ready-made image for the `db` service instead of building one.
- `ports: - "3000:3000"` maps a container port to a host port, in the `host:container` form from basics. The `db` service has no `ports` entry because nothing on your machine needs to reach it directly; the scoreboard reaches it over the internal network. Add `- "5432:5432"` to `db` only if you want to connect from a host tool like DBeaver.
- `environment` sets environment variables inside a service. The scoreboard gets its `DATABASE_URL`; Postgres gets the `POSTGRES_PASSWORD` and `POSTGRES_USER` it requires.
- `depends_on: - db` tells Compose to start `db` before `scoreboard`.
- `volumes: - pgdata:/var/lib/postgresql/data` mounts the named volume into the database, exactly as in the volumes chapter. The bottom-level `volumes: pgdata:` block declares that volume so Compose creates and manages it.

One detail about `depends_on` trips people up: it waits for the database container to _start_, not for the database inside it to be _ready_ to accept connections. Postgres takes a moment to initialize after its container starts. If the scoreboard connects the instant the container is up, it can still fail. For real readiness, add a health check to the `db` service and have `scoreboard` depend on that condition.

## Service names and the default network

Compose creates a network for the stack automatically and attaches every service to it. This is the same user-defined network behavior from the networks chapter, set up for you. The hostname a service uses to reach another is the _service name_, the key under `services`.

That is why the scoreboard's connection string points at `db` (not `arcade-db` from the networks chapter):

```
postgresql://arcade-master:arcade-password@db:5432/postgres
```

In the networks chapter you connected to the database by the container name on a network you created by hand. Compose does the same thing, but the address is the service name from the file. Rename the service and you change the hostname.

## Managing the stack

Run these from the directory that contains the compose file:

| Command                               | What it does                                      |
| ------------------------------------- | ------------------------------------------------- |
| `docker compose up`                   | Starts all services, streaming their logs         |
| `docker compose up -d`                | Starts services in the background (detached)      |
| `docker compose up --build`           | Rebuilds images first, then starts                |
| `docker compose down`                 | Stops and removes the containers and the network  |
| `docker compose down -v`              | Also removes the named volumes (deletes the data) |
| `docker compose ps`                   | Lists the running services                        |
| `docker compose logs -f`              | Shows and follows logs from all services          |
| `docker compose exec <service> <cmd>` | Runs a command inside a running service           |
| `docker compose stop`                 | Stops services without removing them              |

Note that `docker compose down` leaves your named volumes alone, so the database data survives a `down` followed by an `up`. Only `down -v` deletes the volumes.

## Environment variables and .env files

Hard-coding the password in the compose file is fine for a throwaway local setup, but you usually want configurable values kept out of the committed file. Compose reads a file named `.env` in the project directory and substitutes its values into the compose file using the `${VAR}` syntax.

A `.env` file holds plain `KEY=value` lines:

```
POSTGRES_USER=arcade-master
POSTGRES_PASSWORD=arcade-password
PORT=3000
```

The compose file then references those values instead of spelling them out:

```yaml
environment:
  - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
  - PORT=${PORT}
```

Keep real secrets out of version control by adding `.env` to `.gitignore`, the same way you would for an application's environment file. To check that the substitution worked before starting anything, run `docker compose config`, which prints the final compose file with every variable resolved.

## Resources

- [Docker Compose documentation](https://docs.docker.com/compose/)
- [Compose file reference](https://docs.docker.com/reference/compose-file/)
- [Awesome Compose examples](https://github.com/docker/awesome-compose)
