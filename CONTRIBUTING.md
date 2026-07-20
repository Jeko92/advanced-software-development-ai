# Contributing & Code Architecture Agreement

Though this is a personal training repository, it is held to team production engineering standards to reinforce enterprise development behavior.

## Branch Management

- Branch directly out of `develop` using standard naming paths: `feature/<module-name>`.
- Isolate branches by course module rather than individual daily lessons.
- Pull Requests integrate back into `develop` using **Squash and Merge** rules.
- Production promotions flow periodically via `develop → main` using standard Merge Commits accompanied by semver tags (`v0.<n>.0`).

## Conventional Commit Standards

Commit messages follow the format `<type>(<scope>): <summary>`.

- Complete type, scope, and footer definitions live in [`.conventionalcommit.json`](.conventionalcommit.json). WebStorm's Conventional Commit plugin reads this file automatically and offers autocomplete for types and scopes in the commit dialog.
- This is IDE tooling only — no local git hook validates commit messages, so nothing blocks a commit for not matching the format.
- The one place this format is actually checked is GitHub Actions, which lints PR titles against the convention (`.github/workflows/pr-title-lint.yml`).
- Allowed scopes:
  - `repo`: Global repository changes or workspace configuration
  - `ci`: GitHub Actions configuration
  - `tooling`: Shared tsconfig, eslint configs, or scripts
  - `apps`: Core application development (e.g., capstone, next-dashboard)
  - `packages`: Topic-focused workspaces (e.g., nestjs, ts-advanced)
  - `challenges`: Algorithmic exercises and weekly challenges

### Collaboration & Pair Programming

When collaborating with cohort colleagues or bootcamp mentors, append co-author trailers to the base of commit messages matching the entries in [`.conventionalcommit.coauthors`](.conventionalcommit.coauthors).

## Scaling Architecture Packages

To generate a compliant application, course block library, or code challenge workspace following structural defaults, leverage the internal scaffolding script:

```bash
pnpm new:package apps/<name>   # Or packages/<name>, challenges/<name>
```
