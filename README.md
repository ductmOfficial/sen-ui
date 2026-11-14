# Sen UI

[![CI](https://github.com/ductmOfficial/sen-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/ductmOfficial/sen-ui/actions/workflows/ci.yml)

Accessible React components for React 19, published as [`@ductmofficial/sen-ui`](packages/sen-ui). Every component ships with tests, a Storybook story, and an automated accessibility check that blocks the pull request when it fails.

Storybook: <https://ductmofficial.github.io/sen-ui/>

Created from the [`ductran-starter`](https://github.com/ductmOfficial/ductran-starter) template.

## Packages and apps

| Path                         | Name                      | Published | What it is                                                     |
| ---------------------------- | ------------------------- | --------- | -------------------------------------------------------------- |
| `packages/sen-ui`            | `@ductmofficial/sen-ui`   | npm       | The component library ([README](packages/sen-ui/README.md))    |
| `apps/docs`                  | `docs`                    | Pages     | Storybook for the library, also used for a11y and render tests |
| `packages/eslint-config`     | `@repo/eslint-config`     | no        | Shared ESLint flat configs: `base` and `react`                 |
| `packages/prettier-config`   | `@repo/prettier-config`   | no        | Shared Prettier config                                         |
| `packages/typescript-config` | `@repo/typescript-config` | no        | Shared tsconfig presets: `base`, `node`, `react-library`       |

## What's inside

| Area        | Tools                                                                                                                                          |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Monorepo    | [pnpm](https://pnpm.io) workspaces, [Turborepo](https://turborepo.com)                                                                         |
| Language    | TypeScript 6 (strict), Node.js 24 LTS                                                                                                          |
| Library     | React 19, React Aria Components, TanStack Virtual, design tokens with light and dark themes, CSS Modules in `@layer sen`, Vite 8 library build |
| Docs        | Storybook 10 with the a11y and Vitest addons                                                                                                   |
| Testing     | Vitest 5: jsdom and Testing Library for components, headless Chromium for stories                                                              |
| Lint/format | ESLint 10 (flat config, type-aware `typescript-eslint`, `@eslint-react`), Prettier 3                                                           |
| Release     | Changesets, npm trusted publishing (OIDC) with provenance, `publint`                                                                           |
| CI/CD       | GitHub Actions: verify every pull request, deploy Storybook to Pages, release to npm                                                           |
| Conventions | Conventional Commits (commitlint + husky), protected `main`, PR template, issue forms                                                          |

## Structure

```
.
├── apps/
│   └── docs/                     # Storybook: stories, a11y and render tests
├── packages/
│   ├── sen-ui/                   # @ductmofficial/sen-ui: the component library
│   ├── eslint-config/            # @repo/eslint-config
│   ├── prettier-config/          # @repo/prettier-config
│   └── typescript-config/        # @repo/typescript-config
├── .changeset/                   # pending release notes, consumed by `changeset version`
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                # verify pull requests and pushes to main
│   │   ├── pr-title.yml          # re-check the PR title when only the title is edited
│   │   ├── storybook-pages.yml   # deploy Storybook to GitHub Pages
│   │   └── release.yml           # version pull request and npm publish
│   ├── dependabot.yml            # weekly grouped npm and GitHub Actions updates
│   ├── rulesets/protect-main.json
│   ├── pull_request_template.md
│   └── ISSUE_TEMPLATE/           # bug report and feature request forms
├── .husky/commit-msg             # runs commitlint on every commit
├── turbo.json                    # task pipeline
├── pnpm-workspace.yaml
└── PROGRESS.md                   # build log: steps, decisions, issues
```

## Setup

### 1. Prerequisites

| Tool                | Version                    | Needed for           | Install                                               |
| ------------------- | -------------------------- | -------------------- | ----------------------------------------------------- |
| Node.js             | 24 (`.nvmrc`)              | everything           | `nvm install && nvm use` (or `fnm use`)               |
| pnpm                | 12.14.0 (`packageManager`) | everything           | `corepack enable` (or `npm install -g pnpm@12.14.0`)  |
| Git                 | any recent                 | everything           |                                                       |
| Playwright Chromium | the version in `apps/docs` | story tests (`test`) | `pnpm --filter docs exec playwright install chromium` |

`pnpm install` refuses other Node.js majors (`engineStrict`). Corepack ships with Node.js 24: after `corepack enable`, the first `pnpm` command downloads the exact version from `packageManager` (answer `Y` if it asks).

No database and no environment variables are needed: the library and Storybook run without configuration, and releases authenticate to npm through GitHub's OIDC token, not a stored secret.

### 2. Clone and install

```bash
git clone https://github.com/ductmOfficial/sen-ui.git
cd sen-ui
nvm use
corepack enable
pnpm install                                           # also installs the commit-msg hook
pnpm --filter docs exec playwright install chromium    # browser for the story tests
```

## Running

### Storybook

```bash
pnpm dev
```

Open http://localhost:6006. `pnpm dev` builds the library first, then runs `vite build --watch` in `packages/sen-ui` next to Storybook, so a change to a component shows up in its stories after the rebuild.

### Static Storybook

```bash
pnpm build                    # the library and apps/docs/storybook-static
```

This is the same build GitHub Pages serves. Bundle sizes per component, gzipped, come from the built package: `pnpm --filter @ductmofficial/sen-ui size`.

## Testing

| Command                             | What it runs                                                                 |
| ----------------------------------- | ---------------------------------------------------------------------------- |
| `pnpm test`                         | Library tests in jsdom, and every story in headless Chromium with axe (a11y) |
| `pnpm test:coverage`                | Library tests with coverage; HTML report in `packages/sen-ui/coverage/`      |
| `pnpm lint` / `pnpm typecheck`      | ESLint (warnings fail) and `tsc --noEmit` everywhere                         |
| `pnpm lint:package`                 | `publint --strict` on the built `@ductmofficial/sen-ui`                      |
| `pnpm format:check` / `pnpm format` | Prettier check / write                                                       |
| `pnpm build`                        | Build the library and the static Storybook                                   |

The story tests start Chromium through Playwright; they need the browser from the install step, not a running Storybook.

To run what CI runs before opening a pull request:

```bash
pnpm install --frozen-lockfile
pnpm --filter docs exec playwright install chromium
pnpm format:check
pnpm turbo run lint typecheck test build lint:package
```

Run a script in one package with a filter, e.g. `pnpm --filter @ductmofficial/sen-ui test:watch`.

### All scripts

Run from the repository root.

| Script                                     | What it does                                                                   |
| ------------------------------------------ | ------------------------------------------------------------------------------ |
| `pnpm dev`                                 | Build the library, then watch it and run Storybook                             |
| `pnpm build`                               | Build every package and app (`turbo run build`)                                |
| `pnpm lint`                                | ESLint in every package; warnings fail the run                                 |
| `pnpm lint:package`                        | Check the published shape of `@ductmofficial/sen-ui` with `publint --strict`   |
| `pnpm --filter @ductmofficial/sen-ui size` | Bundle size per component, gzipped, from the built package                     |
| `pnpm typecheck`                           | `tsc --noEmit` in every package                                                |
| `pnpm test`                                | Vitest in every package, including story tests in Chromium                     |
| `pnpm test:coverage`                       | Library tests with coverage; HTML report in `packages/sen-ui/coverage/`        |
| `pnpm changeset`                           | Describe a change to the library for the next release                          |
| `pnpm release`                             | Build the library and publish it with Changesets (run by the Release workflow) |
| `pnpm format`                              | Format the whole repo with Prettier                                            |
| `pnpm format:check`                        | Check formatting without writing (used by CI)                                  |

## Deployment

Both happen on GitHub Actions after a merge to `main`; nothing is deployed from a laptop.

| What                    | Where                                                      | Workflow              | How                                                                                     |
| ----------------------- | ---------------------------------------------------------- | --------------------- | --------------------------------------------------------------------------------------- |
| Storybook               | [GitHub Pages](https://ductmofficial.github.io/sen-ui/)    | `storybook-pages.yml` | `pnpm turbo run build --filter=docs`, then uploads `apps/docs/storybook-static`         |
| `@ductmofficial/sen-ui` | [npm](https://www.npmjs.com/package/@ductmofficial/sen-ui) | `release.yml`         | Changesets version pull request, then `pnpm release` with npm trusted publishing (OIDC) |

No environment variables or repository secrets are involved. Pages must be set to "GitHub Actions" as its source, and npm must list this repository and `release.yml` as a trusted publisher of the package. The version pull request is described under _Releases_ in [How it works](#how-it-works).

## Troubleshooting

| Symptom                                                       | Fix                                                                                                                         |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install` fails with `ERR_PNPM_UNSUPPORTED_ENGINE`       | Wrong Node.js major: `nvm use` (Node.js 24), then install again                                                             |
| `pnpm: command not found`, or a different pnpm version runs   | `corepack enable`, then open a new terminal; `pnpm -v` should print `12.14.0`                                               |
| Story tests fail with "Executable doesn't exist" for Chromium | `pnpm --filter docs exec playwright install chromium` (again after Playwright is updated)                                   |
| Port 6006 is taken                                            | Stop the other Storybook, or run this one on another port: `pnpm --filter docs exec storybook dev --port 6007`              |
| Storybook or `docs` cannot resolve `@ductmofficial/sen-ui`    | The docs import the built package: run `pnpm build` (or `pnpm dev`, which builds it first)                                  |
| A machine with little memory kills the run (exit code 137)    | Run fewer tasks at once: `pnpm turbo run lint typecheck test build lint:package --concurrency=2`                            |
| The version pull request has no `Verify` check                | It is opened with the workflow's token, which starts no workflows: close and reopen it                                      |
| The commit is rejected                                        | The hook enforces [Conventional Commits](https://www.conventionalcommits.org): `feat(sen-ui): …`, `fix(docs): …`, `docs: …` |

## How it works

**Task pipeline.** Each package defines its own `build`, `lint`, `typecheck` and `test` scripts. Root scripts call `turbo run <task>`, which runs them in dependency order (`^build` means "build my dependencies first"), in parallel where possible, and caches results by content hash.

**Library build.** Interactive components wrap React Aria Components, which handle keyboard interaction, focus and ARIA; Sen UI adds the styles. Vite builds `src/` into ES modules, one file per source module so consumers can tree-shake, plus a single `styles.css`. `tsc` then adds one `.d.ts` per module. React, `react-aria-components` and `@tanstack/react-virtual` stay external. The `exports` map points at `dist/`, and `publint` checks the result in CI.

**Design tokens.** `packages/sen-ui/src/tokens.css` defines the `--sen-*` tokens for both themes. It is bundled into `styles.css` and also shipped alone, together with a Tailwind CSS v4 theme (`tailwind.css`). Unit tests check that both themes define the same colors and meet WCAG contrast, and that component CSS only falls back to tokens that exist.

**Docs use the built package.** Storybook imports `@ductmofficial/sen-ui` the way an app would, through `exports` and `dist/`, so packaging mistakes show up while developing. `pnpm dev` builds the library once, then runs `vite build --watch` next to Storybook. Vite empties `dist/` on every watch rebuild, so a small plugin in `packages/sen-ui/vite.config.ts` re-runs `tsc` after each rebuild to restore the type declarations.

**Tests.** Library tests run in jsdom with Testing Library queries by role and `user-event`. In `apps/docs`, the Storybook Vitest addon renders every story in headless Chromium and runs axe on it; dark stories pin the theme with `globals`, so contrast is checked in both themes. Any accessibility violation fails the test (`a11y.test: "error"`).

**CI.** `.github/workflows/ci.yml` installs with a frozen lockfile, installs Chromium, lints commit messages and the PR title, checks formatting, then runs `turbo run lint typecheck test build lint:package`. A new push cancels the previous run of the same pull request, and editing only the PR title re-runs a light title check. Actions are pinned to commit SHAs, Dependabot proposes updates, and the default token is read-only.

**Protected `main`.** The ruleset in `.github/rulesets/protect-main.json` requires a pull request, a passing `Verify` check, an up-to-date branch and linear history, and blocks force pushes and deletion. Merge with **rebase** or **squash**.

**Storybook deploy.** Every push to `main` builds the static Storybook and publishes it to GitHub Pages. Only the deploy job can write to Pages.

**Releases.** Pull requests that change the library add a changeset. On `main`, the Release workflow collects pending changesets into a `chore: version packages` pull request that bumps the version and writes `CHANGELOG.md`. Merging it publishes to npm through trusted publishing (OIDC, no stored token) with provenance, then tags the commit and creates a GitHub release.

> That version pull request is opened with the workflow's own token, which does not trigger other workflows, so its `Verify` check never starts. Close and reopen the pull request to run CI, then merge.

## Contributing workflow

1. Branch from `main`: `git switch -c feat/short-description`
2. Commit using [Conventional Commits](https://www.conventionalcommits.org): `type(scope): summary`, e.g. `feat(sen-ui): add Card component`. The `commit-msg` hook rejects anything else.
3. If users of the library will notice the change, run `pnpm changeset` and commit the generated file.
4. Push and open a PR: `gh pr create`
5. Wait for the `Verify` check: `gh pr checks --watch`
6. Merge: `gh pr merge --rebase --delete-branch`

## Progress

The step-by-step build log, with the reasoning behind each decision and the issues met along the way, is in [PROGRESS.md](PROGRESS.md).

## License

[MIT](LICENSE) © 2026 Duc Tran
