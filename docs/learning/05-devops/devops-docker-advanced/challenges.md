# Docker Advanced - Challenges

## Code along

Night Shift Arcade survived launch weekend. Now the scoreboard service needs to grow up: it has to store scores in a real database, keep them across restarts, find the database reliably, and ship as a lean image. You will take the scoreboard from the basics session and extend it through all four advanced topics, one capability at a time.

Each challenge builds on the one before it. Run one command, confirm one result, then move on.

### Challenge 1: Shrink the scoreboard with a multi-stage build

Rewrite the scoreboard's Dockerfile as a multi-stage build and confirm the final image is smaller.

1. Start from a TypeScript version of the scoreboard that has a `build` script compiling `src/` into `dist/`.
2. Write a single-stage Dockerfile first (install all dependencies, build, start), build it, and note its size with `docker images`.
3. Rewrite it as a multi-stage Dockerfile: a `builder` stage that installs all dependencies and runs the build, and a runtime stage that copies only `dist` and the package files and installs production dependencies with `npm install --omit=dev`.
4. Build the multi-stage image:

```bash
docker build -t scoreboard-service:v2 .
```

**Checkpoint**

- `docker images` shows `scoreboard-service:v2`.
- The multi-stage image is noticeably smaller than the single-stage one.

### Challenge 2: Persist the arcade database

Run Postgres with a named volume and prove the data survives the container being removed.

1. Create a volume:

```bash
docker volume create pgdata
```

2. Run Postgres with the volume mounted at its data directory:

```bash
docker run -d --name arcade-db \
  -e POSTGRES_PASSWORD=arcade \
  -v pgdata:/var/lib/postgresql/data \
  postgres
```

3. Connect and write something. Open a shell in the container and create a table with one row:

```bash
docker exec -it arcade-db psql -U postgres -c "CREATE TABLE scores (name text, points int); INSERT INTO scores VALUES ('PAC', 9001);"
```

4. Remove the container completely:

```bash
docker rm -f arcade-db
```

5. Start a fresh container with the same volume and read the row back:

```bash
docker run -d --name arcade-db \
  -e POSTGRES_PASSWORD=arcade \
  -v pgdata:/var/lib/postgresql/data \
  postgres
docker exec -it arcade-db psql -U postgres -c "SELECT * FROM scores;"
```

**Checkpoint**

- The `SELECT` returns the `PAC, 9001` row even though the original container is gone.

**Bonus: bind mount**

Mount a host folder into a container and watch changes sync live.

```bash
mkdir local-data
echo "initial" > local-data/example.txt
docker run -it -v "$(pwd)/local-data:/data" ubuntu bash
```

Inside the container, append to `/data/example.txt`, exit, and check the file on the host. On Windows under Git Bash, the host path may need adjusting (see the volumes chapter on path translation).

### Challenge 3: Connect the scoreboard to the database by name

Put both services on a network you create, and reach the database by name instead of by IP.

1. Create a network:

```bash
docker network create arcade-net
```

2. Start the database on it:

```bash
docker run -d --name arcade-db --network arcade-net \
  -e POSTGRES_PASSWORD=arcade \
  -v pgdata:/var/lib/postgresql/data \
  postgres
```

3. Confirm name resolution from another container on the same network:

```bash
docker run --rm --network arcade-net postgres \
  psql "postgresql://postgres:arcade@arcade-db:5432/postgres" -c "SELECT 1;"
```

**Checkpoint**

- The query connects using the hostname `arcade-db` and returns `1`.

**Bonus: prove isolation**

Create a second network, start a container on it, and confirm it cannot reach `arcade-db`:

```bash
docker network create lobby-net
docker run --rm --network lobby-net postgres \
  psql "postgresql://postgres:arcade@arcade-db:5432/postgres" -c "SELECT 1;"
```

This should fail, because the container is on a different network from `arcade-db`.

### Challenge 4: Bring up the whole stack with Compose

Replace the manual commands with a single compose file that runs the scoreboard and the database together.

1. In the scoreboard project, create a `compose.yaml` with two services: `scoreboard` (built from the local Dockerfile) and `db` (the `postgres:17` image with the `pgdata` volume). Point the scoreboard's `DATABASE_URL` at the `db` service name.
2. Move the password and port into a `.env` file and reference them in the compose file with `${...}`.
3. Validate the resolved configuration:

```bash
docker compose config
```

4. Build and start everything in the background:

```bash
docker compose up -d --build
```

5. Open the scoreboard in the browser at `http://localhost:3000` to confirm it connects to the database.

**Checkpoint**

- `docker compose ps` shows both `scoreboard` and `db` running.
- The scoreboard reaches the database using the service name `db`, with no network or `docker run` commands typed by hand.

6. Tear the stack down, then bring it back up, and confirm the scores are still there:

```bash
docker compose down
docker compose up -d
```

**Checkpoint**

- After `down` and `up`, the data persists, because `down` without `-v` keeps the named volume.
