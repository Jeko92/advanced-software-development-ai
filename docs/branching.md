# Git Workflow

# Branching Strategy

main (protected, PR-only, from develop)
develop (protected, PR-only, from feature/_)
feature/_ (one per course module, not per lesson)

feature/ts-basics, feature/ts-client, feature/backend-intro, feature/software-design,
feature/nestjs, feature/devops, feature/nextjs, feature/realtime, feature/ai

Workflow: cut feature/<module> from develop → many small conventional commits → PR into
develop (squash merge) → periodically PR develop into main (merge commit) → tag `v0.<n>.0`.

Branch protection on main + develop: require PR, require CI status checks, no force pushes.

```
main
└── develop
    └── feature/*
```

- `main` contains stable milestones.
- `develop` is the integration branch.
- Every bootcamp module is developed in its own feature branch.

Typical workflow

```bash
git checkout develop
git pull
git checkout -b feature/ts-basics
```
