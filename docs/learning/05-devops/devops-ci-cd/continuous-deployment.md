{% raw %}

# DevOps CI/CD - Continuous Deployment

Continuous Deployment automates the release process. Once Continuous Integration verifies a branch is safe to merge, the CD pipeline takes over to put that code in front of users. Instead of a developer manually pulling code onto a live server, the pipeline orchestrates the release deterministically: it builds a Docker image, pushes it to a central registry, and commands the hosting provider to deploy it.

A typical CD workflow for a containerized Node.js application executes the following sequence inside a GitHub Actions file (`cd.yml`):

0. Trigger automatically when code merges into `main`.
1. Check out the code and set up the Docker build environment.
2. Authenticate with the image registry.
3. Build the image and push it to the registry.
4. Send a network request to the hosting provider to trigger a restart.

## The External Actors: Docker Hub and Render

Your GitHub Actions workflow coordinates two external platforms (which are replaceable) to make the deployment happen.

**The Image Registry (Docker Hub)**
Docker Hub stores your built images. The CI runner builds the image and pushes it here; the host pulls it from here. To authorize the push from an automated runner, you must generate a Personal Access Token (PAT) with Read & Write permissions in your Docker Hub account. You save this token as a GitHub Repository Secret (e.g., `DOCKERHUB_TOKEN`). Relying on a standard account password in CI is a security risk and will fail if your account uses multi-factor authentication.

**The Hosting Provider**
The Hosting Provider runs your container and exposes it to the public internet. For this bootcamp we will choose [Render](https://render.com) as our provider. Configuring a Render Web Service to use an "Existing image from a registry" deliberately separates your build pipeline from your runtime. GitHub Actions handles the compute-intensive work of installing dependencies and compiling TypeScript. Render pulls the finished, lightweight Docker image and executes the Node process.

## Prepare the Image Registry

Before you can deploy to Render, you need to create a Docker Hub account (if you don't already have one) and generate a Private Access Token (PAT). You can then save the secret in your GitHub repository as `DOCKERHUB_TOKEN`. We will use this access token to autmotically push new images from GitHub Actions to Docker Hub.

## Prepare the Hosting Provider

We need an existing project on our hosting provider that your CD pipeline can target. For that we need an account on Render as well as setting up a Web Service of type "Existing image from a registry". We can then find the deploy hook URL in the Web Service settings and save it as a GitHub secret called `RENDER_DEPLOY_HOOK_URL`. Sending a POST request to this URL instructs Render to pull the latest image and restart the container.

The hosting provider will also run the docker container for us. We need to provide it with the correct environment variables. Store them in the project under the "Environment Variables" tab, they will be added to the container at runtime with the --env flag.

## Constructing the CD Workflow

The `cd.yml` file lives in `../../../../.github/workflows` alongside your CI pipeline. Because deploying untested code defeats the purpose of automation, you restrict the CD trigger strictly to the main branch:

```yaml
on:
  push:
    branches: [main]
```

Inside the deployment job, a specific sequence of actions handles the compilation and authentication process:

```yaml
steps:
  - uses: actions/checkout@v6
  - uses: docker/setup-buildx-action@v4
  - uses: docker/login-action@v4
    with:
      username: ${{ secrets.DOCKERHUB_USERNAME }}
      password: ${{ secrets.DOCKERHUB_TOKEN }}
  - uses: docker/build-push-action@v7
    with:
      context: .
      push: true
      platforms: linux/amd64
      tags: <username>/myapp:latest
```

The order of these steps are important. The runner checks out the repository to get the `Dockerfile`. Next, `setup-buildx-action` installs the modern Docker build engine required for the subsequent steps. The `login-action` authenticates the runner with Docker Hub using your stored secrets. Finally, `build-push-action` uses the current directory as the build context, builds the image for Render's architecture (`linux/amd64`), applies the `latest` tag, and pushes it to the registry.

## Triggering a Redeployment on the Hosting Provider

At this point in the workflow, Docker Hub has the new image, but Render is unaware of it. We need to use the deploy hook URL to tell Render to pull the new image and restart the container.

Because possession of the URL grants anyone the ability to trigger a redeployment, you store it as a GitHub Secret (`RENDER_DEPLOY_HOOK_URL`) and trigger it using `curl` as the final step in your pipeline:

```yaml
- run: curl -fsSL -X POST "${{ secrets.RENDER_DEPLOY_HOOK_URL }}"
```

The exact flags attached to `curl` control how the runner handles the network request:

- `-f` forces the script to exit with an error code if Render returns a failed HTTP status. Without it, the workflow falsely reports success even if the deploy hook is broken.
- `-s` silences the progress bar and other output, keeping the workflow logs clean.
- `-S` explicitly re-enables error messages when the request fails, giving you actionable feedback if Render rejects the POST request.
- `-L` follows HTTP redirects, ensuring the trigger survives if Render updates their routing infrastructure.

Once this step executes successfully, your CD pipeline has done its job. Render takes over to spin up the new container.

## Resources

- [Render web services from existing images](https://render.com/docs/deploy-an-image)
- [docker/build-push-action documentation](https://github.com/docker/build-push-action)
- [Docker Hub access tokens](https://docs.docker.com/security/for-developers/access-tokens/)

{% endraw %}
