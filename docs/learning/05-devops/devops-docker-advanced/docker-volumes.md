# Docker Advanced - Docker Volumes

Basics treated containers as disposable, and that was the point. You could stop a container, remove it, run a fresh one from the same image, and get an identical result every time. That works as long as the container only runs code. It stops working the moment the container holds data you want to keep.

The scoreboard service is about to hit this wall. Once it stores player scores in a database, those scores live inside the container's filesystem. A container's filesystem is part of the container: when you run `docker rm`, it goes too. Restart the database container after a crash and every score is gone, because the new container starts from the original image, which never had any scores in it. This is intended since a container is meant to be replaceable, and "replaceable" and "remembers things" pull in opposite directions.

Docker resolves this by keeping the data outside the container. Instead of writing to the container's own filesystem, you point a path inside the container at separate storage that Docker manages independently. The container can come and go; the storage stays. When a new container mounts the same storage, the data is right where the old one left it. This separation does more than survive restarts. It lets you back up the data by backing up one known location, and it lets two containers share the same files when that is what you want.

Docker offers three ways to attach external storage to a container, and they differ mainly in where the data physically lives and who controls it. Most of the time you want the first one, a named volume, but it helps to know all three so you recognize them when you read other people's `docker run` commands and Compose files.

## The three storage types

| Type         | Where the data lives                               | Typical use                                            |
| ------------ | -------------------------------------------------- | ------------------------------------------------------ |
| Named volume | A location Docker manages, under `/var/lib/docker` | Databases and any data the app must keep               |
| Bind mount   | A folder you choose on the host machine            | Sharing source code or local files during development  |
| tmpfs        | The host's memory, never written to disk           | Temporary or sensitive data that should vanish on stop |

A **named volume** is storage that Docker creates and tracks by name. You do not care where on disk it sits; you refer to it by its name and Docker handles the rest. This is the default choice for application data such as a database.

A **bind mount** maps a specific folder from the host machine straight into the container. Both sides see the same files live, so a change on the host shows up in the container immediately and the other way around. This is useful while developing, when you want the container to pick up code edits without a rebuild.

A **tmpfs mount** stores data in the host's memory rather than on disk. It is fast, and it disappears completely when the container stops, since memory is not persistent. That makes it the opposite of a volume: you reach for tmpfs when you specifically do not want the data to survive, for example a scratch area or a secret you would rather never write to disk.

## Working with named volumes

A named volume has its own lifecycle, separate from any container. These commands create and inspect one:

```bash
docker volume create pgdata
docker volume ls
docker volume inspect pgdata
docker volume rm pgdata
```

- `docker volume create pgdata` creates a volume named `pgdata`. Docker also creates a volume automatically the first time you mount one that does not exist yet, so this command is optional.
- `docker volume ls` lists the volumes on your machine.
- `docker volume inspect pgdata` prints the volume's details, including where Docker stored it on disk.
- `docker volume rm pgdata` deletes the volume and the data inside it. This is the one command here that destroys data, and it only works when no container is using the volume.

To attach a volume to a container, use the `-v` flag in the form `volume-name:/path/in/container`:

```bash
docker run -v pgdata:/var/lib/postgresql/data postgres
```

- `pgdata` is the volume name on the left of the colon.
- `/var/lib/postgresql/data` is the path inside the container on the right.

Anything the container writes under `/var/lib/postgresql/data` is stored in the `pgdata` volume instead of in the container's own filesystem. Remove the container and the volume stays. Start a new container with the same `-v pgdata:/var/lib/postgresql/data` and it sees the same data.

## Bind mounts and host paths

A bind mount uses the same `-v` flag, but the left side is a path on the host instead of a volume name:

```bash
docker run -v "$(pwd)/local-data:/data" ubuntu bash
```

Docker decides between a volume and a bind mount by looking at the left side: a plain name means a named volume, a path means a bind mount. The host path has to be absolute, which is why the example uses `$(pwd)` to expand the current directory to its full path rather than writing a relative path like `./local-data`.

Host paths are where cross-platform differences show up. On macOS and Linux, `$(pwd)` is enough. On Windows under Git Bash, the shell rewrites Unix-style paths and can mangle the mount; you may see examples that prepend a slash (`/$(pwd)/local-data`) or set `MSYS_NO_PATHCONV=1` to stop that rewriting. If a bind mount behaves strangely on Windows, the path translation is the first thing to check.

## tmpfs mounts

A tmpfs mount uses its own flag, `--tmpfs`, with just a path inside the container. There is nothing on the host side because the data never reaches the host disk; it lives in memory:

```bash
docker run --tmpfs /app/cache scoreboard-service:v2
```

- `--tmpfs /app/cache` mounts an in-memory filesystem at `/app/cache` inside the container.

Anything the scoreboard writes to `/app/cache` is fast to read and write, and it is gone the moment the container stops. That is the whole point: a tmpfs mount is for data you do not want to keep. A scratch directory for temporary files fits, and so does a secret you would rather never land on disk. Unlike a named volume, there is no separate object to create, list, or remove, because nothing persists.

## Persisting the arcade database

Putting it together for Night Shift Arcade: the scoreboard needs a Postgres database whose data survives restarts. Run Postgres with a named volume mounted at the directory Postgres uses for its files:

```bash
docker run -d \
  --name arcade-db \
  -e POSTGRES_PASSWORD=arcade \
  -v pgdata:/var/lib/postgresql/data \
  postgres
```

- `-d` runs the container in the background, as in basics.
- `--name arcade-db` gives the container a name you can refer to later.
- `-e POSTGRES_PASSWORD=arcade` sets the database password through an environment variable, which the official Postgres image requires.
- `-v pgdata:/var/lib/postgresql/data` mounts the `pgdata` volume at the path where Postgres stores its database files.

With this setup the database data persists across container restarts.

## Resources

- [Storage overview - Docker Docs](https://docs.docker.com/storage/)
- [Volumes - Docker Docs](https://docs.docker.com/storage/volumes/)
- [Bind mounts - Docker Docs](https://docs.docker.com/storage/bind-mounts/)
