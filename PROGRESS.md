# Progress — Phase 0: Repo template

> Last updated: 2026-10-27
>
> Legend: ✅ done · 🔄 in progress · ⏳ awaiting review · ⬜ not started

## Why this project

This is **phase 0** of a GitHub portfolio roadmap. It builds a **repo template** so every later project starts from the same foundation instead of being configured from scratch.

- **No repeated setup:** TypeScript, linting, formatting, testing, CI and a local database are configured once. A new project copies the template and has all of it.
- **Show engineering skills, not only UI:** the repo shows a monorepo structure, tests, green CI and a clean commit history, which sets it apart from repos that only contain interfaces.
- **Learning by building:** testing, Turborepo, GitHub Actions and Docker are learned by configuring them by hand and understanding every line, rather than relying on a generator.
- **Ready for later phases:** from phase 2a onward the projects need PostgreSQL, so a local database environment is prepared in advance.

## What each step is for

| #   | Step                             | Purpose                                                                                                                                                                     |
| --- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0   | Environment check                | Make sure the right tools and versions are installed, so later failures come from the code, not the machine.                                                                |
| 1   | Monorepo + shared tsconfig       | Several apps and packages live in one repo and share code and config. Turborepo runs tasks in dependency order and caches results so finished work is skipped.              |
| 2   | ESLint + Prettier                | ESLint catches logic errors before the code runs, and Prettier makes formatting uniform, so reviews focus on substance rather than style.                                   |
| 3   | Vitest + Testing Library         | Tests make changes and refactors safe. Testing Library tests the UI the way users interact with it, not its implementation details.                                         |
| 4   | GitHub Actions (CI)              | Every pull request is linted, type-checked, tested and built automatically. Broken code is stopped before it reaches `main`, and a green check is visible proof of quality. |
| 5   | Docker Compose + PostgreSQL      | The database starts with one command and runs the same version on every machine, without installing PostgreSQL on the host.                                                 |
| 6   | Commit, PR and issue conventions | A readable commit history that can generate changelogs, and consistent PRs and issues, as in a professional team.                                                           |
| 7   | README                           | The entry point: anyone (including future me) understands the structure and gets the project running in minutes.                                                            |

## Overview

| #   | Step                                                    | Branch                    | Status            |
| --- | ------------------------------------------------------- | ------------------------- | ----------------- |
| 0   | Environment check (Node, pnpm, Git, Docker)             | —                         | ✅                |
| 1   | Turborepo + pnpm workspace + shared tsconfig            | `chore/setup-monorepo`    | ✅ merged to main |
| 2   | Shared ESLint + Prettier                                | `chore/setup-lint-format` | ✅ merged to main |
| 3   | Vitest + Testing Library, sample component and test     | `feat/ui-testing`         | ✅ merged to main |
| 4   | GitHub Actions: lint, typecheck, test, build on each PR | `ci/github-actions`       | ✅ merged to main |
| 5   | Docker Compose for local PostgreSQL                     | `chore/local-postgres`    | ✅ merged to main |
| 6   | Conventional Commits (commitlint), PR & issue templates | `chore/conventions`       | ✅ merged to main |
| 7   | README: structure and how to run                        | `docs/readme`             | ✅ merged to main |

## Details

### Step 0 — Environment ✅

- [x] Node.js v24.21.0 (LTS "Krypton")
- [x] pnpm 12.14.0 (installed via `npm i -g`, not Corepack)
- [x] Git 2.44.0, identity `Duc Tran <ductm.official@gmail.com>` (repo-local config)
- [x] Docker Desktop: Engine 29.9.1, Compose v5.6.0
- [x] Default branch renamed to `main`

### Step 1 — Monorepo ✅

- [x] Root `package.json`: `packageManager`, `engines`, scripts that call `turbo`
- [x] `pnpm-workspace.yaml`: `apps/*`, `packages/*`, `engineStrict`
- [x] `turbo.json`: build / typecheck / lint / test / dev tasks
- [x] `@repo/typescript-config`: `base.json`, `node.json`, `react-library.json`
- [x] `.nvmrc`, `.gitignore`, `.editorconfig`
- [x] Commit `08e3661`, merged into `main`

### Step 2 — ESLint + Prettier ✅

- [x] `@repo/eslint-config`: `base` (strict, type-aware typescript-eslint) and `react` (@eslint-react)
- [x] `@repo/prettier-config` + `.prettierignore`
- [x] Root scripts `format`, `format:check`
- [x] `turbo.json`: `lint` depends on `^build`
- [x] Smoke-tested lint rules in a throwaway package (removed)
- [x] Reviewed and tried locally
- [x] Commit `chore: add shared ESLint and Prettier configs`
- [x] Merged into `main`

### Step 3 — Testing ✅

- [x] Branch `feat/ui-testing` created from `main`
- [x] Implementation plan drafted
- [x] 3.1 Scaffold `packages/ui` (package.json, tsconfig, build with `tsc`)
- [x] 3.2 Sample `Button` component + ESLint config for `ui`
- [x] 3.3 Vitest + jsdom, first plain test
- [x] 3.4 Testing Library + jest-dom + user-event, `Button` tests
- [x] 3.5 Coverage with `@vitest/coverage-v8`
- [x] 3.6 Run the full pipeline through Turbo (clean run 1.8s, cached 6ms), commit `feat(ui): add UI package with Vitest and Testing Library` and merge

### Step 4 — CI ✅

- [x] GitHub repo created: `ductmOfficial/ductran-starter` (public, empty)
- [x] Implementation plan drafted
- [x] 4.1 Add the remote (SSH alias `github-ductmofficial`) and push `main`
- [x] 4.2 Workflow `.github/workflows/ci.yml`: install, `format:check`, lint, typecheck, test, build
- [x] 4.3 Cache the pnpm store and the Turbo cache; ESLint `--max-warnings=0`
- [x] 4.4 PR #1 opened; CI green → red (deliberate `cx` bug, 4 tests failed) → green after revert
- [x] 4.5 Ruleset `Protect main` (stored in `.github/rulesets/protect-main.json`): PR required, `Verify` must pass, linear history, no force push or deletion, no bypass. A direct push of a commit outside any PR is rejected (GH013)
- [x] 4.6 PR #1 merged (fast-forward, all 7 commits kept, including the deliberate break/revert pair)

### Step 5 — Local PostgreSQL ✅

- [x] Branch `chore/local-postgres` created from `main`
- [x] Implementation plan drafted
- [x] 5.1 `.env.example` and `compose.yaml` with a PostgreSQL 18 service, named volume and healthcheck
- [x] 5.2 Root scripts `db:up`, `db:down`, `db:reset`, `db:logs`, `db:psql`
- [x] 5.3 Verify: connect with `psql`, data survives a restart, `db:reset` wipes it
- [x] 5.4 Commit, open a PR, CI green, merge (rebase)

### Step 6 — Conventions ✅

- [x] commitlint 21 + `@commitlint/config-conventional` (`commitlint.config.mjs`); existing history passes
- [x] husky 9 `commit-msg` hook (installed by the root `prepare` script); a bad message is rejected locally
- [x] CI lints every commit of a pull request and the PR title (title passed via env var to avoid script injection)
- [x] `.github/pull_request_template.md`
- [x] Issue forms: bug report, feature request; blank issues disabled
- [x] Commit, PR, CI green, merge (rebase)

### Step 7 — README ✅

- [x] Introduction, tool overview, requirements
- [x] Getting started, every script, project structure, how the pipeline works
- [x] Contributing workflow and how to start a new project from this template
- [x] Verified on a fresh clone from GitHub: install, hooks, build, test, lint, typecheck, format
- [x] Repository marked as a GitHub template, description added
- [x] Commit, PR, CI green, merge (rebase)

**Phase 0 complete.**

## Decisions

| Decision                                                            | Reason                                                                                                                                |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Node 24 LTS                                                         | Node 26 is not LTS yet (expected late Oct 2026). Upgrading later only touches `.nvmrc` and `engines`                                  |
| TypeScript 6.0.x instead of 7.0                                     | typescript-eslint only supports `<6.1.0`, and TS 7 has no stable programmatic API yet                                                 |
| No Corepack                                                         | Node 25+ no longer bundles Corepack                                                                                                   |
| Internal package scope `@repo/*`                                    | Turborepo convention; keeps the repo usable as a template                                                                             |
| `@eslint-react` instead of `eslint-plugin-react`                    | `eslint-plugin-react` does not support ESLint 10 yet                                                                                  |
| React ESLint preset `strict-type-checked`                           | Matches the strict TypeScript preset; `recommended` misses rules such as `dom-no-missing-button-type`                                 |
| No `eslint-plugin-react-hooks`                                      | `@eslint-react` already ships the hooks rules; using both reports every issue twice                                                   |
| Prettier `printWidth: 100`, other options default                   | The default of 80 wraps JSX too aggressively                                                                                          |
| Conventions enforced twice: husky hook locally and commitlint in CI | Hooks can be skipped (`--no-verify`) or missing on a fresh clone; CI cannot                                                           |
| PostgreSQL `postgres:18` (Debian), port bound to `127.0.0.1`        | Latest stable major (19 is still RC); Debian matches typical glibc production hosts; the database is not exposed to the local network |
| GitHub Actions pinned to commit SHAs (with a `# vX.Y.Z` comment)    | A tag can be moved to point at different code; a SHA cannot. Protects CI from a compromised action release                            |
| MIT license (`LICENSE`, `"license": "MIT"`)                         | A public repo without a license is all rights reserved; MIT lets others reuse the template with attribution                           |
| No Co-Authored-By trailer in commits                                | Maintainer's preference                                                                                                               |

## Follow-ups

- [ ] Upgrade to **Node 26** once it becomes LTS
- [ ] Upgrade to **TypeScript 7** once typescript-eslint supports it
- [ ] The PR title check runs on open/push only; editing the title alone does not re-run CI (would need the `edited` event)
- [ ] Add Dependabot for GitHub Actions so the pinned SHAs get update PRs
- [ ] `tsc` does not delete stale files in `dist/`; consider a clean step before `build` if a source file is renamed or removed
- [ ] (Optional) Update local Node from 24.21.0 to 24.22.0

## Issue log

- **2026-10-20:** installing Docker via Homebrew needs `sudo`, so it was installed manually in a terminal.
- **2026-10-20:** Compose was missing until Docker Desktop was opened for the first time.
- **2026-10-21:** `git switch main` failed because `main` had no commits yet, so it did not really exist. Fixed with `git switch -c main chore/setup-monorepo`.
- **2026-10-22:** the two React plugins reported every hooks rule twice. Fixed by dropping `eslint-plugin-react-hooks`.
- **2026-10-22:** the `recommended-type-checked` React preset did not flag a `<button>` without `type`. Switched to `strict-type-checked`.
- **2026-10-22:** Turbo warned that `test` produced no files for `outputs: ["coverage/**"]`. Set `test` outputs to `[]`; coverage gets its own task in 3.5.
- **2026-10-23:** `git@github.com` authenticates as `ductmbbx` (default key), not the repo owner `ductmOfficial`. The machine already has an SSH alias `github-ductmofficial` for that account, so the remote uses `git@github-ductmofficial:ductmOfficial/ductran-starter.git`.
- **2026-10-23:** after reverting the deliberate bug, CI got `FULL TURBO` (5/5 tasks cached): the reverted files hash exactly like the first green run, so Turbo reused its outputs.
- **2026-10-23:** pushing the head of PR #1 straight to `main` was accepted and merged the PR: GitHub treats a push of an open PR's head as a command-line merge when the PR already meets every rule. The real test, an empty commit outside any PR, was rejected with `Changes must be made through a pull request` and `Required status check "Verify" is expected`.
