# Docker Basics - Challenges

## Code along

You are the new Platform Engineer for Night Shift Arcade, a retro gaming studio preparing for a global launch weekend.

Your team has three launch tasks:

- package the scoreboard service so every dev machine runs the same setup
- publish the public leaderboard image to Docker Hub
- spin up a local MongoDB container for player profiles

Your mission is to containerize each piece so launch day does not fail because of machine differences. At each step, run one command and confirm one result before moving on.

### Install Docker

As described in the setup chapter, install Docker Desktop on your machine.

### Launch prep

Create a workspace and enter it:

Create the first project folder:

```bash
mkdir scoreboard-service
cd scoreboard-service
```

### Part 1: Scoreboard service (Dockerfile -> image -> container)

Create a tiny Node app:

Create a file named `package.json` and paste:

```json
{
  "name": "scoreboard-service",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  }
}
```

Create a file named `index.js` and paste:

```javascript
console.log("Arcade scoreboard online: player queue synced.");
setInterval(() => {
  console.log("Heartbeat: scoreboard service still running.");
}, 30000);
```

Now create your Dockerfile:

Create a file named `Dockerfile` and paste:

```dockerfile
FROM node:26-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
CMD ["npm", "start"]
```

Build an image:

```bash
docker build -t scoreboard-service:v1 .
```

What this command means:

- `build` tells Docker to create an image from the `Dockerfile`.
- `-t` means "tag" (name your image).
- `scoreboard-service:v1` is the tag value in `name:version` format.
- `.` means "use the current folder as the build context" (files Docker can access while building).

**Checkpoint**

- build finishes successfully
- `docker images` shows `scoreboard-service` with tag `v1`

Run a container:

```bash
docker run --name scoreboard-c1 -d scoreboard-service:v1
```

**Checkpoint**

- `docker ps` shows `scoreboard-c1` in running state
- if it exits immediately, rebuild the image after saving `index.js`: `docker build -t scoreboard-service:v1 .`

Read logs:

```bash
docker logs scoreboard-c1
```

If you already waited 30+ seconds and want to see the heartbeat without scrolling old output:

```bash
docker logs --tail 5 scoreboard-c1
```

**Checkpoint**

- logs include `Arcade scoreboard online`
- after ~30 seconds, logs include `Heartbeat: scoreboard service still running.`

Stop and remove the container:

```bash
docker stop scoreboard-c1
docker rm scoreboard-c1
```

**Checkpoint**

- `docker ps --all` no longer lists `scoreboard-c1`

### Part 2: Workflow drill (build, run, pull, push)

Pull a public image:

```bash
docker pull postgres
```

What this command means:

- `pull` downloads an image from a registry (Docker Hub by default).
- `postgres` is the image name to download.

**Checkpoint**

- `docker images` lists `postgres`

Run Postgres locally:

```bash
docker run --name arcade-postgres -d -p 5432:5432 postgres
```

**Checkpoint**

- `docker ps` shows `arcade-postgres`
- port mapping includes `5432->5432`

Inspect the container:

```bash
docker inspect arcade-postgres
```

**Checkpoint**

- output contains `"Name": "/arcade-postgres"`

Stop and remove it:

```bash
docker stop arcade-postgres
docker rm arcade-postgres
```

### Part 3: Leaderboard release (Docker Hub roundtrip)

Reuse the same project as your public leaderboard service and publish it.

Tag the local image for Docker Hub:

```bash
docker tag scoreboard-service:v1 <your-dockerhub-username>/arcade-leaderboard:v1
```

What this command means:

- `tag` creates another name for an existing local image.
- `scoreboard-service:v1` is the source image.
- `<your-dockerhub-username>/arcade-leaderboard:v1` is the new repository/tag format Docker Hub expects.

Push it:

```bash
docker push <your-dockerhub-username>/arcade-leaderboard:v1
```

**Checkpoint**

- push completes without errors

Simulate a fresh machine:

```bash
docker image rm <your-dockerhub-username>/arcade-leaderboard:v1
docker pull <your-dockerhub-username>/arcade-leaderboard:v1
docker rm -f leaderboard-c1
docker run --name leaderboard-c1 -d <your-dockerhub-username>/arcade-leaderboard:v1
```

**Checkpoint**

- `docker ps` shows `leaderboard-c1`

Cleanup:

```bash
docker stop leaderboard-c1
docker rm leaderboard-c1
```

## Package your Cyber Chat App

Create a docker image for your Cyber Chat App. You can alternatively use the following starter project:

```bash
npx ghcd@latest wd-bootcamp/asd-challenges/tree/main/challenges/devops-docker-basics/cyber-chat cyber-chat
```

Can you figure out how to move the environment variables out of the .env file and add them when starting the container? Also, how can you make sure that the API is accessible from ouside of the container?
