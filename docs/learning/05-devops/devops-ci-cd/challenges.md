{% raw %}

# DevOps CI/CD - Challenges

## CyberChat Goes Live

CyberChat has grown into a real application with a typed API, a tested service layer, and a TypeORM-backed data model that now talks to Postgres, but it still only runs on your laptop. By the end of these challenges it will live at a public URL, redeploy itself on every push to `main`, and persist data to a managed Postgres instance that survives container restarts.

Work in the same CyberChat repository you have been using.

## 1 A First CI Workflow

- Create the workflow file at the only location GitHub will look for it.
- **Design question:** which two trigger events together cover both "a branch under active development" and "a feature branch about to merge"? Configure the workflow to listen to both.
- Define a single job on `ubuntu-latest`, on Node 26, with the npm download directory cached and keyed on `package-lock.json`. Inside the job, run the test script and the production build in order.
- Push the workflow. Watch the run in the Actions tab and note how long the full job takes end to end. That number is your baseline for the next task.

_Resource:_ [Workflow syntax for GitHub Actions](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

## 2 Refactoring CI for Parallelism

The single-job CI works, but the 2 stages waste each other's time. Replace the two stages with two jobs running in parallel on `ubuntu-latest`.

- Replace the one job from Task 1 with two independent jobs running in parallel on `ubuntu-latest`.
- Each job still needs its own checkout, its own Node setup with the npm cache, and its own `npm ci` before the actual script runs.

_Resource:_ [Using jobs in a workflow](https://docs.github.com/en/actions/using-jobs/using-jobs-in-a-workflow)

## 3 Manual first Deploy on Render

If not done already, [create a Render account](https://render.com) and log in to the dashboard. Also, create a [Dockerhub account](https://hub.docker.com/) if you don't already have one.

- Confirm the Dockerfile still builds the application image locally.
- Tag the image for your Docker Hub account and push it.
- On Render, create a new Web Service of type "Existing image from a registry" and point it at the image you just pushed. Pick the free instance type and the Frankfurt region.
- On the Render dashboard, create a new PostgreSQL instance on the free plan, in the Frankfurt region.
- After it provisions, the database page shows two connection URLs.
- Before you let Render start the container, configure a `DATABASE_URL` environment variable on the web service. Use the Postgres URL that belongs in this context.
- Wait for Render to pull the image and start the container, then open the public URL and confirm CyberChat responds.

_Resource:_ [Render PostgreSQL documentation](https://render.com/docs/databases)  
_Resource:_ [Deploy an image from a registry on Render](https://render.com/docs/deploy-an-image)

## 5 The CD Workflow

Automate everything you just did manually. The CD workflow builds and pushes a fresh image on every push to `main`, then tells Render to redeploy.

- Trigger only on `push` to `main`. Carry over the same `concurrency` and `permissions: contents: read` blocks from the CI workflow.
- The build job needs four reusable actions, in order: a checkout, the Buildx setup, a Docker Hub login, and the build-and-push step targeting `linux/amd64`.
- **Security note:** the Docker Hub login needs a Personal Access Token, not a password. Generate the token in your Docker Hub account with Read & Write scope.
- After the image is pushed, fire a single `curl` against Render's deploy hook URL to trigger the redeploy.
- Store the three secrets (`DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `RENDER_DEPLOY_HOOK_URL`) under Settings → Secrets and variables → Actions on the repository, then reference them through the `${{ secrets.NAME }}` syntax inside the workflow.
- Push a trivial change to `main`. The CD workflow should turn green, and the Render dashboard should report a fresh deploy seconds later.

<details markdown="1">
<summary>Hint:</summary>

The deploy hook returns `200 OK` the instant Render queues the redeploy. It tells you nothing about whether the new container actually starts and serves traffic. A green CD workflow at this stage means "the deploy was triggered", not "the new code is live". If your push contained an obvious change like a new string in a response, open the public URL after the run and confirm the change is reflected before you trust the pipeline.

</details>

_Resource:_ [docker/build-push-action](https://github.com/docker/build-push-action)

## 6 (Optional) Running E2E Tests in CI

Up to this point your test job has run unit and integration tests only. The e2e suite was left out because it boots the full NestJS application, which now demands a live Postgres at startup, and the CI runner is a clean Ubuntu VM with no database installed. Add a Postgres alongside the test job for the duration of the run, then extend the suite to include e2e.

- GitHub Actions can spin up auxiliary containers alongside a job. Add a Postgres container to the test job only; lint and build do not touch the database.
- Pin the Postgres major version so the CI image cannot drift away from production. Render's free Postgres runs Postgres 18; match it.
- Pass a `DATABASE_URL` into the job's environment that points at the auxiliary container. The hostname is not `localhost`; GitHub Actions resolves the container by the name you assign it in the workflow.
- Run the e2e suite as part of (or in addition to) the test job's script and push the change.
- **Bootstrap caveat:** your test setup is responsible for provisioning the schema on the fresh database the service container starts with. If your tests previously relied on a pre-existing schema, that assumption no longer holds; the test environment now has to create the tables before the first query runs.

<details markdown="1">
<summary>Hint:</summary>

The GitHub Actions docs on service containers walk through the pattern end-to-end. Two non-obvious points: the auxiliary container's hostname is the key you used for it under `services:`, not `localhost`, because the job itself runs in a container and reaches the service over a Docker network; and Postgres needs a second or two to accept connections after the container starts, so the test runner should either retry on first connection or wait briefly before the suite begins. The official Postgres image ships a `pg_isready` binary that you can poll if you need an explicit readiness check.

</details>

_Resource:_ [About service containers (GitHub Actions)](https://docs.github.com/en/actions/using-containerized-services/about-service-containers)

{% endraw %}
