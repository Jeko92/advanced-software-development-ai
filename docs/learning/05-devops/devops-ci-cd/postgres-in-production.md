# DevOps CI/CD - Postgres in Production

A container's filesystem is temporary and no longer available once it restarts. In other words, every redeploy creates a fresh filesystem and wipes out any files that are saved by the previous version. Because of this, a file-backed database like SQLite is no longer suitable for the architecture and we must take care of that before we set up the CD pipeline. Let's discuss a few alternatives.

## Database Options

When migrating away from a local file-backed database, you generally face three primary operational choices:

- **Attach a persistent volume**: You could pay for a persistent disk and map it to your container, keeping SQLite. The downside of this becomes apparent when two instances of your application run simultaneously, as they cannot share the exact same file. This approach leaves you entirely responsible for all backups and recovery.

- **Run a database container**: You could spin up a second Docker container specifically for Postgres as we have done in the previous session. Now you are a database administrator. You have to patch the software, configure storage, monitor connections, and figure out how to recover from snapshots when something crashes.

- **Use a managed service**: A provider runs the database for you. They handle the patches, nightly backups, and uptime monitoring. You operate your Node application; they operate the infrastructure.

For a first-time deployment, a managed service removes most of the operational workload. Render is one of many cloud providers offering a managed Postgres service. Since we will deploy our app at Render as well, choosing the same platform to manage our Postgres database a sensible choice.

## Connecting to Render Postgres

When you provision a new PostgreSQL instance on Render, the dashboard generates credentials and gives you two distinct connection URLs. Here is the difference:

- **The External URL**: This address is publicly resolvable on the internet. You use this URL on your laptop to run database migrations or test your local development server against the live cloud database. Because it routes queries over the public internet, it is slightly slower.

- **The Internal URL**: This address is only reachable from inside Render's private network. Your deployed Web Service must use this URL. It bypasses the public internet entirely, resulting in zero egress fees, extremely low latency, and a much smaller attack surface.

Both URLs point to the exact same data. You choose the route based on where the query originates.

## The Environment Boundary

Since your application code remains completely unaware of whether it is running locally or in the cloud, you bridge the gap using environment variables.

The standard format for passing database credentials is a single string: `postgresql://username:password@host:port/database`.

Locally, you store the external URL inside your `.env` file under the key `DATABASE_URL`. In production, you paste the internal URL into Render's environment variable dashboard using the exact same `DATABASE_URL` key. Your application reads `process.env.DATABASE_URL` (or the `ConfigModule`) at startup and connects to whichever database the variable points at, without a single line of code changing.

## Resources

- [Render PostgreSQL documentation](https://render.com/docs/databases)
