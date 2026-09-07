# DevOps CI/CD - Intro

## Learning Objectives

- Trace what happens between `git push` and "the new version is live", at the level of detail required to debug it when it breaks.
- Configure GitHub Actions workflows: triggers, jobs, steps, and reusable actions, with dependency caching and parallel jobs to keep runs fast.
- Build a CI pipeline that lints, tests, and builds every push with `npm ci`, and explain why a clean runner needs a lockfile-exact install.
- Automate deployment: build a Docker image in the pipeline, push it to Docker Hub with a token stored as a repository secret, and trigger a Render redeploy through a deploy hook.
- Swap a file-backed SQLite database for a managed Postgres instance and pass its connection string to the application through environment variables.

## Overview

On August 1st, 2012, Knight Capital Group lost $440 million in 45 minutes. The trading firm was about to launch new software for the New York Stock Exchange's retail liquidity program. Eight production servers needed the new code. A technician deployed it to seven. The eighth server kept running the previous version, which contained a piece of dormant test code from years earlier that, under the new flag settings, began firing erratic buy and sell orders at maximum speed.

By the time anyone identified which server was misbehaving, the firm had bought and sold roughly $7 billion worth of stocks at random prices. The loss exceeded Knight Capital's available capital. Within six months the company was acquired. One server, running the wrong version of one program, ended a 17-year-old firm.

The incident became famous because of its cause. There was no clever exploit, and the new code itself worked fine. The deployment was incomplete, and nobody noticed. No automated process answered "did all eight servers get the new version?" because no automated process was watching.

This chapter covers the discipline that grew out of incidents like Knight Capital's. With Continuous Integration, an automated system checks every commit and reports whether the change is safe to merge. Continuous Deployment extends that automation to the release itself, so the same pipeline that verified the code also builds it, ships it, and starts the new version. Given enough deployments, every human eventually skips a verification step or loses track of what is currently running where; the machines don't.

## Resources

- [Softwarefehler kostet Knight Capital 440 Millionen Dollar, Spiegel 2012](https://www.spiegel.de/wirtschaft/unternehmen/software-problem-an-der-nyse-kostet-knight-capital-440-millionen-a-847969.html)
- [Continuous Integration - Martin Fowler's reference essay](https://martinfowler.com/articles/continuousIntegration.html)
