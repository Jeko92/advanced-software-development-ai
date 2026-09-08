# DevOps CI/CD — Code-Along

A minimal "Hello World" NestJS app used to practice the fundamentals of the
DevOps CI/CD handout: a GitHub Actions workflow that lints, tests, and
builds every push, and a second workflow that builds a Docker image,
pushes it to Docker Hub, and tells Render to redeploy on every push to
`main`.

## Setup

```bash
pnpm install
```

## Commands

```bash
pnpm dev               # boot the app on http://localhost:3000
pnpm build              # compile to dist/
pnpm start:prod         # run the compiled app (node dist/main.js)
pnpm test               # unit specs under src/
pnpm test:e2e           # end-to-end spec under test/
pnpm typecheck
pnpm lint
```

## Where this deviates from the handout

The handout (`docs/learning/05-devops/devops-ci-cd`) is written against a
plain npm project: `npm ci`, caching keyed on `package-lock.json`, and a
`docker build .` with no build step beforehand. This repo is a pnpm
workspace end to end, so the workflows adapt the same lessons to that:

- **`npm ci` → `pnpm install --frozen-lockfile`**, cache keyed on the
  repo-root `pnpm-lock.yaml` instead of a per-package `package-lock.json`
  (this package doesn't have one - the workspace has a single lockfile at
  the repo root).
- **`npm run <script>` → `turbo run <task> --filter=@bootcamp/devops-ci-cd-code-along`**,
  so CI only touches this package's slice of the monorepo, the same way
  `docker-advanced/scoreboard-service` scopes its own build.
- **The `Dockerfile` builds everything inside the image** (`pnpm install`,
  `pnpm run build`, `pnpm deploy`), rather than requiring a local
  `pnpm build && pnpm deploy` step before `docker build` the way
  `docker-basics/code-along` does. A CI runner can't run an interactive
  local pre-build step before handing off to
  [`docker/build-push-action`](https://github.com/docker/build-push-action) -
  the Dockerfile has to be self-sufficient. See its comments for the
  build-context detail (repo root, not this folder).

Everything else - the workflow anatomy, triggers, caching mechanics,
secrets handling, and the CD sequence (buildx → login → build-and-push →
deploy hook) - follows the handout as written.

## The workflows

Both live at the repo root - GitHub only discovers workflows in
`.github/workflows/`, never in a subfolder - but each is scoped to this
package via path filters and `turbo --filter`, so neither one touches any
other bootcamp module:

- [`devops-ci-cd-code-along-ci.yml`](../../../../.github/workflows/devops-ci-cd-code-along-ci.yml) -
  lints, tests, and builds on every push and PR.
- [`devops-ci-cd-code-along-cd.yml`](../../../../.github/workflows/devops-ci-cd-code-along-cd.yml) -
  builds and pushes a Docker image, then triggers a Render redeploy.
  Deliberately **manual only** (`workflow_dispatch`, not `push`) - a
  deploy on every commit to `main` isn't wanted here, so this is run by
  hand from the Actions tab ("Run workflow", branch `main`) or via
  `gh workflow run devops-ci-cd-code-along-cd.yml --ref main`.

The CD workflow needs three repository secrets under
**Settings → Secrets and variables → Actions**:

| Secret                    | Value                                                          |
| ------------------------- | --------------------------------------------------------------- |
| `DOCKERHUB_USERNAME`      | Your Docker Hub username                                        |
| `DOCKERHUB_TOKEN`         | A Docker Hub Personal Access Token with Read & Write scope      |
| `RENDER_DEPLOY_HOOK_URL`  | The deploy hook URL from the Render Web Service's settings page |

Render also needs `PORT` set as an environment variable on the Web
Service (Render assigns its own external port and expects the container
to read it from the environment - see `.env.example`).
