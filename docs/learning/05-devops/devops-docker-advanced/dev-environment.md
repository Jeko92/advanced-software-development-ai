# Docker Advanced - Dev Environment

So far we created a container composition aimed at being used in production. But you also want your development environment to be identical for everyone on the team. For that, we need a second setup: a docker compose file that defines a unified development environment.

What you want during development is a split between the place where the code is written and the place where it runs. The editor, the files, and version control stay on your machine, where they are fast and familiar. The runtime lives in the container, where it is identical for everyone on the team. Nobody installs the right Node version or a local Postgres by hand; they all share the ones defined in the docker setup. A new teammate clones the repository, starts the stack, and has a working environment in minutes instead of a day of setup.

## Overriding the service for development

For changing our compose file for development, we only need to change a couple of entries. Douplicating the componse file is not a good idea. Instead we can reference two files when starting the stack, where the entries of the second file override the ones of the first. This lets you keep the production-shaped stack in `compose.yaml` and put the development changes in a separate file `compose.dev.yaml`.
A development override for the scoreboard looks like this:

```yaml
# compose.dev.yaml
services:
  scoreboard:
    build:
      context: .
      target: builder
    command: npm run dev
    volumes:
      - .:/app
      - /app/node_modules
```

- `build.target: builder` stops the build at the `builder` stage from the multi-stage Dockerfile. That stage still has the dev dependencies and the TypeScript source, which is exactly what development needs and what the production runtime stage deliberately threw away.
- `command: npm run dev` replaces the image's production `CMD` with a watch command. A watch command (for example `tsx watch` or `nodemon` behind the `dev` script) recompiles and restarts the app whenever a source file changes.
- `volumes: - .:/app` bind-mounts your project directory into the container, the same bind-mount mechanism from the volumes chapter. Now the container reads the files you are editing, so a save on your machine is visible inside the container immediately and the watch command reacts to it.

You would start the dev stack with the following command specifying both the base compose file as well as the dev override:

```
docker compose -f compose.yaml -f compose.dev.yaml up
```

Because the base file already defines the ports, environment, and `depends_on`, the override does not repeat them. It still publishes port 3000, sets `DATABASE_URL`, and starts the database first.

## Keeping the container's node_modules

The second volume line, `- /app/node_modules`, looks odd because it has no host path. It is there to solve a problem the first bind mount creates.

When you bind-mount your whole project directory over `/app`, the container's `/app` becomes your host folder, including your host's `node_modules` (or no `node_modules` at all, if you never ran `npm install` locally). That hides the `node_modules` the image installed during the build. Dependencies that were compiled for the container's Linux environment vanish, replaced by your host's, which may be missing or built for a different platform.

The line `- /app/node_modules` is an anonymous volume mounted at exactly that path. Because it is more specific than the `/app` bind mount, Compose layers it on top, so `/app/node_modules` keeps the container's own installed modules while everything else in `/app` comes from your machine. The result: your source is live-mounted, but the dependencies stay the ones the container was built with.
Keep in mind if you now install a dependency on your machine it will not be available during the build or runtime.

## Using a dev database

In production you want a named volume that persists data reliably across restarts and is managed explicitly. In development you usually want the opposite: a database that starts clean, is easy to reset, and doesn't accumulate state between sessions. You also often want different credentials so there's no risk of accidentally pointing a dev tool at production data.

The database service override looks like this:

```yaml
# compose.override.yaml
services:
  scoreboard:
    build:
      context: .
      target: builder
    command: npm run dev
    volumes:
      - .:/app
      - /app/node_modules

  db:
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: devpassword
      POSTGRES_USER: devuser
      POSTGRES_DB: scoreboard_dev

volumes:
  postgres_dev_data:
```

A few things worth noting here:

- **The named volume swap.** The base `compose.yaml` declares a volume like `postgres_data:/var/lib/postgresql/data`. The override replaces that with `postgres_dev_data`, a completely separate named volume. The two environments never share database state, even if you switch between them on the same machine.

- **Declaring the volume at the top level.** Just like in the base file, any named volume referenced under a service must also be declared in the top-level `volumes:` block. Without that declaration, Compose will refuse to start.

- **Overriding environment variables.** The `environment` block in an override merges key by key with the base, rather than replacing the whole block. So you only need to list the keys you want to change. The base file might set `POSTGRES_USER: postgres` and the override changes it to `devuser`; any keys the override doesn't mention stay as defined in the base.

- **Resetting the database.** To reset the database, we can simply remove the dev volume with: `docker volume rm postgres_dev_data`

## Adding the compose commands to `package.json`

Writing the compose commands manually everytime you want to start your dev environment is a bit of a chore. Instead we can add them to the `scripts` section of `package.json`:

```json
"scripts": {
  "docker:dev": "docker compose -f compose.yaml -f compose.dev.yaml up",
  "docker:dev:down": "docker compose -f compose.yaml -f compose.dev.yaml down",
  "docker:dev:reset": "docker volume rm postgres_dev_data",
  "docker:prod": "docker compose up",
  "docker:prod:down": "docker compose down",
}
```

Now the entire team can just run `npm run docker:dev` to start the dev environment without having to remember all the docker commands.

}

## Resources

- [Merge Compose files - Docker Docs](https://docs.docker.com/compose/multiple-compose-files/merge/)
- [Development Containers specification](https://containers.dev/)
- [Dev Containers in VS Code](https://code.visualstudio.com/docs/devcontainers/containers)
