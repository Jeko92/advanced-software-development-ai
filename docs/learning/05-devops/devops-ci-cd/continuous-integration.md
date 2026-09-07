# DevOps CI/CD - Continuous Integration

A Continuous Integration pipeline executes tests automatically when code changes are introduced. Instead of running the tests locally, the tests are executed on a clean, isolated virtual machine on the CI platform, in our case GitHub.

By moving the verification step to a clean, isolated virtual machine on every push, Continuous Integration guarantees a neutral environment as well as that the tests have been executed. The CI pipeline answers a single, definitive question: _Is this specific code change safe to merge?_ The result is a public pass or fail attached directly to the pull request, making broken code impossible for the team to ignore.

## The Verification Stages

A typical Node.js pipeline executes three distinct checks against the codebase:

- **Linting**: Static analysis tools like ESLint parse the code without executing it. They catch syntax errors, unused variables, forbidden coding patterns, and formatting drift that a human reviewer might eventually spot but shouldn't have to.

- **Testing**: The automated test suite (using tools like Vitest) runs your unit and integration tests. The goal here is reproducible verification against a clean checkout, ensuring new logic functions correctly and old logic hasn't regressed.

- **Building**: The production compilation step (`npm run build`). In TypeScript projects, the compiler verifies type safety independently of test execution. A build can easily fail due to a type mismatch even if all runtime tests pass.

Passing these checks does not guarantee the application will perform flawlessly in production under heavy load. Instead, they act as a filter that catches the most common breakages and syntax errors before they waste a human reviewer's time.

We can implement these stages with github actions as follows:

```yaml
name: CI Pipeline
on:
  push:
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: 26
          cache: "npm"

      - name: Install
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm run test

      - name: Build
        run: npm run build
```

This pipeline runs the install, linting, testing and building sequentially in one unified job.

## The Strictness of npm ci

A common trap for beginners is using `npm install` inside a workflow file. The CI environment needs a fully predictable install, which `npm install` is not designed to provide.

- `npm install` is optimized for local development. It reads `../../../../package.json`, resolves the dependency tree dynamically, updates `node_modules` incrementally, and silently rewrites `package-lock.json` if it decides a different dependency version fits the requested ranges better.

- `npm ci` (Clean Install) is strictly for automated environments. It ignores `../../../../package.json` entirely and reads directly from `package-lock.json`. It deletes any existing `node_modules` folder, installs the exact tree specified in the lockfile from scratch, and fails immediately if the lockfile and `../../../../package.json` are out of sync. It never mutates your files.

A CI runner must always build the exact dependency tree the developer tested against locally. Using `npm ci` enforces that constraint.

## Caching Dependencies

Downloading and installing Node modules on every single push consumes significant time. You can avoid this penalty by using the caching mechanisms built into standard setup actions.

When you configure the Node setup step with `cache: 'npm'`, the runner generates a unique hash based on the contents of your `package-lock.json` file. On the first run, the pipeline executes the full installation process and saves the resulting `~/.npm` folder to the cache under that specific hash.

On subsequent runs, if the `package-lock.json` has not changed, the hash remains identical. The runner downloads the cached folder almost instantly, reducing the `npm ci` step from a minute-long download to a split-second local copy/paste. The moment a developer installs a new package and updates the lockfile, the hash changes, the cache misses, and the system automatically generates a fresh cache.

## Running Jobs in Parallel

You can execute linting, testing, and building sequentially within a single job. However, if linting takes one minute and testing takes two minutes, your total wait time is three minutes. Splitting them into parallel jobs cuts that waiting time down to the slowest individual task.

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 26
          cache: "npm"
      - run: npm ci
      - run: npm run lint
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 26
          cache: "npm"
      - run: npm ci
      - run: npm run test
```

This configuration intentionally duplicates the checkout, setup, and installation steps. While repeating setup across two different virtual machines might appear inefficient, but a existing `npm ci` cache makes those steps fast. Two parallel runners executing 15 seconds of setup each will finish their respective tasks far sooner than a single runner working through everything serially.

## Resources

- [npm ci reference](https://docs.npmjs.com/cli/v10/commands/npm-ci)
- [Caching dependencies in GitHub Actions](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)
- [ESLint documentation](https://eslint.org/docs/latest/)
