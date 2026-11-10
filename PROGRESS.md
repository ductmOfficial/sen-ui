# Progress

> Last updated: 2026-11-10
>
> Legend: ✅ done · 🔄 in progress · ⬜ not started

Sen UI is an accessible React component library published to npm as `@ductmofficial/sen-ui`, with a public Storybook and an automated release flow. This log records each phase, the decisions behind it and the issues met along the way.

## Phases

| #   | Phase              | Scope                                                                                             | Release          | Status |
| --- | ------------------ | ------------------------------------------------------------------------------------------------- | ---------------- | ------ |
| 0   | Foundation         | Library build, Storybook, a11y story tests, Pages, Changesets, npm release, `Button`, `TextField` | `0.1.0`          | ✅     |
| 1   | Tokens and theming | `tokens.css`, dark mode, Tailwind preset; `Button` and `TextField` on tokens                      | `0.2.0`          | ⬜     |
| 2   | Simple components  | React Aria Components; `Checkbox`, `Tooltip`, `Tabs`                                              | `0.3.0`          | ⬜     |
| 3   | Overlay components | `Dialog`, `Select`/`Combobox`, `Toast`                                                            | `0.4.0`          | ⬜     |
| 4   | DataTable          | Typed columns, sort, filter, virtualization, ARIA grid keyboard navigation                        | `0.5.0`          | ⬜     |
| 5   | Polish             | Screen reader pass, design decisions in the README, dark mode stories, bundle size                | next minor/major | ⬜     |

## Phase 0 — Foundation

| #   | Step                                                              | Branch                |
| --- | ----------------------------------------------------------------- | --------------------- |
| 1   | Repository from the `ductran-starter` template                    | `main`                |
| 2   | Rename to `sen-ui`, drop the database and app presets             | `chore/setup`         |
| 3   | Turn `packages/ui` into the publishable `@ductmofficial/sen-ui`   | `feat/sen-ui-package` |
| 4   | Storybook docs app that renders the built package                 | `feat/storybook`      |
| 5   | `publint` in CI                                                   | `ci/publint`          |
| 6   | Stories as browser tests with blocking a11y checks                | `test/story-a11y`     |
| 7   | Deploy Storybook to GitHub Pages                                  | `ci/storybook-pages`  |
| 8   | Changesets for versions and changelogs                            | `chore/changesets`    |
| 9   | Release workflow: version pull request and npm trusted publishing | `ci/release`          |
| 10  | `TextField` component                                             | `feat/text-field`     |
| 11  | README and this progress log                                      | `docs/readme`         |

Each step is a pull request with a green `Verify` check, merged with rebase. The release workflow then opens `chore: version packages`, which sets the version to `0.1.0` and writes `CHANGELOG.md`.

## Decisions

| Decision                                                         | Reason                                                                                                                        |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| React 19 only (`peerDependencies`)                               | Lets components use `ref` as a prop and the current React APIs without compatibility layers                                   |
| CSS Modules in `@layer sen`, state as `data-*` attributes        | Unlayered app CSS always wins without specificity tricks; state is easy to target from outside                                |
| Readable class names (`sen-[local]-[hash]`)                      | Stable, debuggable class names in the shipped CSS                                                                             |
| Vite library mode, one module per source file, `tsc` for `.d.ts` | Consumers' bundlers can drop unused components; Vite empties `dist/` so stale files never ship                                |
| Unminified output with source maps                               | Apps minify their own bundles; readable code keeps stack traces clear                                                         |
| Storybook renders the built package, not `src/`                  | Exercises `exports`, CSS and bundling the way a consumer does; costs hand-written story controls                              |
| Story tests in a real browser with `a11y.test: "error"`          | axe needs a real DOM and layout; blocking on violations keeps accessibility from regressing silently                          |
| vitest and storybook package families kept on one version each   | Their peer dependencies require matching versions                                                                             |
| Playwright browsers not cached in CI                             | Restoring the cache takes about as long as downloading, and system deps must be installed anyway                              |
| npm trusted publishing (OIDC) instead of an `NPM_TOKEN` secret   | No long-lived token to leak or rotate, and provenance comes for free                                                          |
| Version pull request re-triggered by closing and reopening it    | A pull request opened with `GITHUB_TOKEN` does not start CI; a PAT or GitHub App is not worth it for occasional solo releases |
| First release is `0.1.0`                                         | Signals a usable but unstable API, matching "early development" in the package README                                         |
| Tooling inherited from `ductran-starter`                         | Strict TypeScript, ESLint, Prettier, commitlint, protected `main` and Dependabot are shared with every other project          |
| No Co-Authored-By trailer in commits                             | Maintainer's preference                                                                                                       |

## Follow-ups

- [ ] Confirm the trusted publisher with `npm trust list @ductmofficial/sen-ui` (needs 2FA)
- [ ] Deprecate the `0.0.0-stage` placeholder that staged publishing left on npm
- [ ] GitHub-aware changelog entries (`@changesets/changelog-github`: PR links and authors)
- [ ] Revisit hand-written story controls once there are more components

## Issue log

- **2026-11-04:** `vite build --watch` deleted the `.d.ts` files from `tsc` on every rebuild; `emptyOutDir: false` only held for the first build. Fixed with a plugin that re-runs `tsc` after each watch rebuild.
- **2026-11-04:** adding `@storybook/addon-vitest` resolved mismatched versions (addon 10.6.5 with storybook 10.6.4, `@vitest/browser-playwright` 5.1.0 with vitest 5.0.5). `pnpm update` of both families fixed it.
- **2026-11-04:** `changeset init` in Changesets 3 asks an interactive question and stopped in a non-interactive shell, so the config was written by hand.
- **2026-11-04:** `changesets/action` v2 renamed its inputs (`publish-script`, `commit-message`, `pr-title`), and its default "Version Packages" title would fail commitlint.
- **2026-11-04:** `npm trust` failed with 403 while the npm account had no 2FA, then with 404 because npm only trusts packages that already exist. `0.1.0` was published by hand from an interactive shell (`ERR_PNPM_OTP_NON_INTERACTIVE` otherwise).
- **2026-11-04:** right after publishing, the registry briefly showed only `0.0.0-stage` with `latest` pointing at it; staged publishing creates that placeholder, and `latest` moved to `0.1.0` once the publish completed.
