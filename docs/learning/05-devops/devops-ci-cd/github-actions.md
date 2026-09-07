{% raw %}

# DevOps CI/CD - GitHub Actions

Right now we are running tests manually. If someone commits and pushes a change, we need to trust them that they ran the tests beforehand. With Github Actions, we can automatically trigger workloads just like running the tests directly on the github servers. There are many other CI/CD tools that can be used for this job (Jenkins, CircleCI, and Travis CI). We want to focus on fundamentals of how a continuous integration pipeline looks like. With GitHub Actions, the entire workflow is contained right within the repository:

- **Define**: Write a YAML file describing the pipeline.
- **Trigger**: Commit the file to a specific folder in the repository.
- **Execute**: The platform automatically provisions a fresh virtual machine to run the instructions.

This minimalist approach allows us to focus entirely on learning how to design and write CI/CD workflows.

## Workflow file

Each Github Action is defined by a workflow file. This yaml file defines what steps to run and which events trigger the action. A workflow file contains three top-level keys: `name`, `on`, and `jobs`:

```yaml
name: CI
on:
  push:
    branches: [main, dev]
    paths-ignore: ["**.md", "docs/**"]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: 26

      - name: Install and Test
        run: npm ci && npm test
```

The `name` sets how the workflow appears in the GitHub UI. The `on` block defines the triggers that launch the pipeline. The `jobs` map outlines the actual work, assigning each job to a specific virtual machine on the Github servers.

GitHub discovers automation pipelines by looking in exactly one location: the `../../../../.github/workflows` directory at the root of your repository. Any file ending in `.yml` or `.yaml` inside this folder becomes an active workflow. You will typically split distinct processes into separate files, such as `ci.yml` for testing and `cd.yml` for deployment, so a failing test suite does not visually obscure a successful deployment run in the Actions dashboard.

## Triggers

The `on` key tells GitHub when to start the workflow. In practice, there are four main types of triggers:

- `push` fires when commits land on any branch the workflow is configured to listen to. CI workflows usually want this on every branch; CD workflows usually narrow it to `main`. With `paths-ignore`, you can filter which files trigger the workflow.
- `pull_request` fires when a PR is opened, reopened, or updated. The workflow runs against the simulated merge result, not against the PR branch as-is. A passing `pull_request` run therefore answers the question "would merging this still be green?", which a `push` run on the source branch cannot answer on its own.
- `schedule` accepts a cron expression. Useful for nightly builds or scheduled cleanups. Scheduled runs do not block any PR or push, so they are a poor fit for gating workflows.
- `workflow_dispatch` adds a "Run workflow" button to the Actions UI for manual triggering. Useful for one-off deploys or backfills that should not happen automatically.

## Runners and Execution State

A job is the primary unit of a workflow in GitHub Actions. The `runs-on` directive tells GitHub which operating system image to provision. The `ubuntu-latest` image is the standard choice for Node.js backends.

Developers frequently misunderstand the initial state of these runners. When a job starts, the filesystem is completely empty. The repository code does not exist on the machine until a step explicitly clones it down. Jobs also share no state with each other. If you define a `build` job and a `deploy` job in the same file, they execute on two distinct virtual machines. Any compiled code generated in the first job vanishes when that runner spins down unless you deliberately upload it as an artifact and download it into the second job.

## Steps and Actions

Inside a job, the `steps` array defines what is actually done and in what order. A step either executes a raw shell command via `run` or invokes a reusable action via `uses`. Each step can have an optional name, which is visible in the Actions UI.

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v6

  - name: Setup Node
    uses: actions/setup-node@v6
    with:
      node-version: 26
      cache: "npm"

  - name: Install
  - run: npm ci

  - name: Test
    run: npm test
```

- `uses: <repo>@<ref>` references an action by repository and version. `@v6` is a moving tag that the maintainer updates as new v6.x patches ship. Using a version tag like this is the standard approach and is perfectly fine for most common use cases. The `actions` repo is the official source of GitHub-published actions.
- `with:` passes inputs to the action. Each action documents its own input shape.
- `run:` is a shell command on the runner. The default shell is bash on Ubuntu runners.

Actions are themselves repositories. `actions/checkout` lives at `github.com/actions/checkout`; you can read its source the same way you read any dependency. Look at what it does, and prefer the small set of GitHub-published actions (`actions/*`) when one fits your needs.

## Secrets Management

Registry tokens, deploy hooks, API keys, and anything else that should not appear in the repository go in repository secrets. The path is **Settings → Secrets and variables → Actions → New repository secret**. The name is uppercase by convention; the value is write-only after creation.

Inside a workflow, secrets are referenced with the `${{ secrets.NAME }}` syntax:

```yaml
- uses: docker/login-action@v4
  with:
    username: ${{ secrets.DOCKERHUB_USERNAME }}
    password: ${{ secrets.DOCKERHUB_TOKEN }}
```

GitHub masks any secret value that appears in step output, so an accidental `echo ${{ secrets.DOCKERHUB_TOKEN }}` shows up in the log as `***`. Anyone with write access to the repository can write a workflow that exfiltrates secrets in less obvious ways; the list of people with write access is effectively the list of people who know every secret.

> :warn: Never put an account password in a workflow. Use a Personal Access Token (or platform equivalent) instead. Tokens can be revoked individually, scoped to specific permissions, and do not require MFA prompts that the CI runner cannot answer.

## Resources

- [GitHub Actions documentation](https://docs.github.com/en/actions)
- [Workflow syntax reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Security hardening for GitHub Actions](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

{% endraw %}
