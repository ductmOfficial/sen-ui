# Progress

> Last updated: 2026-11-11
>
> Legend: ✅ done · 🔄 in progress · ⬜ not started

Sen UI is an accessible React component library published to npm as `@ductmofficial/sen-ui`, with a public Storybook and an automated release flow. This log records each phase, the decisions behind it and the issues met along the way.

## Phases

| #   | Phase              | Scope                                                                                                        | Release | Status |
| --- | ------------------ | ------------------------------------------------------------------------------------------------------------ | ------- | ------ |
| 0   | Foundation         | Library build, Storybook, a11y story tests, Pages, Changesets, npm release, `Button`, `TextField`            | `0.1.0` | ✅     |
| 1   | Tokens and theming | `tokens.css`, dark mode, Tailwind theme; `Button` and `TextField` on tokens                                  | `0.2.0` | ✅     |
| 2   | Simple components  | React Aria Components; `Checkbox`, `Tooltip`, `Tabs`                                                         | `0.3.0` | ✅     |
| 3   | Overlay components | `Dialog`, `Select`, `ComboBox` (`Toast` deferred)                                                            | `0.4.0` | ✅     |
| 4   | DataTable          | Typed columns, sort, global and column filters, virtualization, ARIA grid keyboard navigation, row selection | `0.5.0` | ✅     |
| 5   | Polish             | Screen reader pass, design decisions in the README, bundle size                                              | `0.5.0` | ✅     |

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

## Phase 1 — Tokens and theming

| #   | Step                                                                        | Branch                          |
| --- | --------------------------------------------------------------------------- | ------------------------------- |
| 1   | Design tokens with light and dark themes, shipped in `styles.css` and alone | `feat/tokens`                   |
| 2   | `Button` and `TextField` styled with the tokens                             | `refactor/components-on-tokens` |
| 3   | Tailwind CSS v4 theme for the tokens                                        | `feat/tailwind-theme`           |
| 4   | Storybook theme toolbar, token stories and dark-mode story tests            | `feat/storybook-theme`          |
| 5   | README and progress log                                                     | `docs/phase-1`                  |

Released as `0.2.0` through the version pull request, the first publish through npm trusted publishing.

## Phase 2 — Simple components

| #   | Step                                 | Branch          |
| --- | ------------------------------------ | --------------- |
| 1   | `Checkbox` on React Aria Components  | `feat/checkbox` |
| 2   | `Tooltip`                            | `feat/tooltip`  |
| 3   | `Tabs`, `TabList`, `Tab`, `TabPanel` | `feat/tabs`     |
| 4   | README and progress log              | `docs/phase-2`  |

Released as `0.3.0`.

## Phase 3 — Overlay components

| #   | Step                                                 | Branch          |
| --- | ---------------------------------------------------- | --------------- |
| 1   | `Dialog`, `DialogTrigger`, `DialogActions`           | `feat/dialog`   |
| 2   | `Select`, `SelectItem`, shared field and list styles | `feat/select`   |
| 3   | `ComboBox`, `ComboBoxItem`                           | `feat/combobox` |
| 4   | README and progress log                              | `docs/phase-3`  |

`Toast` is deferred: React Aria Components 1.22 still ships it as `UNSTABLE_Toast`, and a public API should not wrap an unstable one. Released as `0.4.0`.

## Phase 4 — DataTable

| #   | Step                                                              | Branch                  |
| --- | ----------------------------------------------------------------- | ----------------------- |
| 1   | Row model: filtering, sorting and the sort cycle, unit tested     | `feat/data-table-model` |
| 2   | `DataTable`: ARIA grid, virtualization, keyboard, sort, selection | `feat/data-table`       |
| 3   | README and progress log                                           | `docs/phase-4`          |

Released as `0.5.0`.

## Phase 5 — Polish

| #   | Step                                                                                          | Status |
| --- | --------------------------------------------------------------------------------------------- | ------ |
| 1   | Bundle size per component (`pnpm --filter @ductmofficial/sen-ui size`), in the package README | ✅     |
| 2   | Screen reader pass with VoiceOver on every component                                          | ✅     |
| 3   | Design decisions explained in the README                                                      | ✅     |

The package itself does not change in this phase, so there is no release; `0.5.0` stays the current version.

## Decisions

| Decision                                                              | Reason                                                                                                                        |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| React 19 only (`peerDependencies`)                                    | Lets components use `ref` as a prop and the current React APIs without compatibility layers                                   |
| CSS Modules in `@layer sen`, state as `data-*` attributes             | Unlayered app CSS always wins without specificity tricks; state is easy to target from outside                                |
| Readable class names (`sen-[local]-[hash]`)                           | Stable, debuggable class names in the shipped CSS                                                                             |
| Vite library mode, one module per source file, `tsc` for `.d.ts`      | Consumers' bundlers can drop unused components; Vite empties `dist/` so stale files never ship                                |
| Unminified output with source maps                                    | Apps minify their own bundles; readable code keeps stack traces clear                                                         |
| Storybook renders the built package, not `src/`                       | Exercises `exports`, CSS and bundling the way a consumer does; costs hand-written story controls                              |
| Story tests in a real browser with `a11y.test: "error"`               | axe needs a real DOM and layout; blocking on violations keeps accessibility from regressing silently                          |
| vitest and storybook package families kept on one version each        | Their peer dependencies require matching versions                                                                             |
| Playwright browsers not cached in CI                                  | Restoring the cache takes about as long as downloading, and system deps must be installed anyway                              |
| npm trusted publishing (OIDC) instead of an `NPM_TOKEN` secret        | No long-lived token to leak or rotate, and provenance comes for free                                                          |
| Version pull request re-triggered by closing and reopening it         | A pull request opened with `GITHUB_TOKEN` does not start CI; a PAT or GitHub App is not worth it for occasional solo releases |
| First release is `0.1.0`                                              | Signals a usable but unstable API, matching "early development" in the package README                                         |
| Tooling inherited from `ductran-starter`                              | Strict TypeScript, ESLint, Prettier, commitlint, protected `main` and Dependabot are shared with every other project          |
| Neutral default theme                                                 | A public library should not impose a brand; apps restyle it through the `--sen-*` tokens, and the portfolio shows how         |
| Stay on `0.x` after phase 5                                           | Move to `1.0.0` only after real apps (portfolio, Notch) have used the API for a while                                         |
| Semantic tokens only, no primitive palette                            | Fewer names to learn and override; components and apps both read the same semantic layer                                      |
| Tokens in `@layer sen`, bundled into `styles.css`, also shipped alone | One import for most apps; unlayered app CSS overrides any token without specificity tricks                                    |
| Dark theme from `prefers-color-scheme`, forced with `data-theme`      | Follows the system by default; `data-theme` on any element pins a theme for a page or a subtree                               |
| Contrast checked twice: unit test on the tokens, axe on dark stories  | The unit test catches a bad token value; axe catches a bad pairing in a real component                                        |
| Tailwind integration as a v4 `@theme inline` file, not a JS preset    | Tailwind v4 is configured in CSS; `inline` keeps utilities pointing at the tokens, so they follow the active theme            |
| Component override properties fall back to a token                    | Keeps the `--sen-button-*` and `--sen-text-field-*` hooks while the tokens drive the defaults                                 |
| Interactive components wrap React Aria Components                     | Keyboard interaction, focus management and ARIA come from a well-tested library; Sen UI owns the styles and the API           |
| `react-aria-components` is a dependency, external in the build        | Apps install one copy and dedupe it with their own React Aria use; the library bundle stays small                             |
| `Checkbox` uses `CheckboxField` and `CheckboxButton`                  | React Aria 1.22 deprecates `Checkbox` in favor of the pair, which also gives the description its slot                         |
| `Tooltip` takes one trigger and wraps it in React Aria's `Focusable`  | Works with Sen UI's native `Button` and any component that forwards `ref` and DOM props                                       |
| Tooltip hover tested in the browser, not in jsdom                     | React Aria only opens on hover after a pointer interaction; jsdom cannot reproduce that reliably                              |
| `DialogTrigger` wraps its trigger in React Aria's `Pressable`         | Sen UI's native `Button` opens a dialog without becoming a React Aria button                                                  |
| Fields take `error`, not `errorMessage` and `isInvalid`               | Same API as `TextField`: one prop shows the message and marks the field invalid                                               |
| `Toast` deferred until React Aria marks it stable                     | Wrapping an `UNSTABLE_` API would pass its breaking changes on to Sen UI users                                                |
| DataTable rows virtualized with TanStack Virtual                      | A small, headless, widely used engine for which rows are visible; the grid, ARIA and keyboard model stay Sen UI's own         |
| DataTable written from scratch, not React Aria's `Table`              | The grid pattern, keyboard model and virtualization are the point of the component                                            |
| Fixed row height                                                      | Predictable scrolling and PageUp/PageDown; variable heights can come later through the virtualizer's measuring                |
| Row logic in a pure module (`dataTableModel.ts`)                      | Sorting and filtering are tested without rendering, and the same rules apply in every table                                   |
| Filters as props, inputs owned by the app                             | Search fields and selects come from Sen UI or the app; the table only applies the values                                      |
| `manual` mode for server data                                         | The same component serves local lists and server-paginated data like warehouse dashboards                                     |
| Sort cycle: ascending, descending, unsorted                           | A third press returns to the source order, which is often meaningful (for example, newest first from the server)              |
| The header cell is the sort control                                   | Keeps one focus target per cell; `aria-sort` announces the state                                                              |
| Selection checkboxes are Sen UI `Checkbox` with `excludeFromTabOrder` | The grid keeps a single tab stop; the checkbox still works with the mouse, and Space on the cell toggles the row              |
| Bundle size measured from `dist/`, without React                      | Shows what Sen UI itself adds to an app; React is there anyway                                                                |
| A locales column in the size report                                   | React Aria ships strings for 34 locales; the column shows what an app saves with `@react-aria/optimize-locales-plugin`        |
| No Co-Authored-By trailer in commits                                  | Maintainer's preference                                                                                                       |

## Follow-ups

- [ ] Fail CI when a component grows past a size budget
- [ ] DataTable: variable row heights, column resizing, and a server-data story with `manual`
- [ ] Add `Toast` once React Aria Components ships it without the `UNSTABLE_` prefix
- [x] Confirm the trusted publisher with `npm trust list @ductmofficial/sen-ui`: GitHub, `ductmOfficial/sen-ui`, `release.yml`
- [x] Deprecate the `0.0.0-stage` placeholder that staged publishing left on npm
- [ ] GitHub-aware changelog entries (`@changesets/changelog-github`: PR links and authors)
- [ ] Revisit hand-written story controls once there are more components

## Issue log

- **2026-11-04:** `vite build --watch` deleted the `.d.ts` files from `tsc` on every rebuild; `emptyOutDir: false` only held for the first build. Fixed with a plugin that re-runs `tsc` after each watch rebuild.
- **2026-11-04:** adding `@storybook/addon-vitest` resolved mismatched versions (addon 10.6.5 with storybook 10.6.4, `@vitest/browser-playwright` 5.1.0 with vitest 5.0.5). `pnpm update` of both families fixed it.
- **2026-11-04:** `changeset init` in Changesets 3 asks an interactive question and stopped in a non-interactive shell, so the config was written by hand.
- **2026-11-04:** `changesets/action` v2 renamed its inputs (`publish-script`, `commit-message`, `pr-title`), and its default "Version Packages" title would fail commitlint.
- **2026-11-04:** `npm trust` failed with 403 while the npm account had no 2FA, then with 404 because npm only trusts packages that already exist. `0.1.0` was published by hand from an interactive shell (`ERR_PNPM_OTP_NON_INTERACTIVE` otherwise).
- **2026-11-04:** right after publishing, the registry briefly showed only `0.0.0-stage` with `latest` pointing at it; staged publishing creates that placeholder, and `latest` moved to `0.1.0` once the publish completed.
- **2026-11-10:** the first `0.2.0` publish failed with `404 Not Found`. The npm trusted publisher had been set up for an earlier repository with the same name; npm rejected the OIDC token exchange (`package not found`) until the trusted publisher was removed and added again. The Release job now runs the exchange itself before publishing and prints the result.
- **2026-11-10:** the npm token exchange answers `201 Created` on success; the pre-publish check first accepted only `200`.
- **2026-11-10:** the version pull request was updated by the Release workflow while its CI was running. Merge it last, after every pull request of the release is in.
- **2026-11-10:** React Aria Components 1.22 marks `Checkbox` as deprecated (`@typescript-eslint/no-deprecated` failed lint); `Checkbox` is built on `CheckboxField` and `CheckboxButton` instead.
- **2026-11-10:** stories of generic components (`Select`, `ComboBox`) failed typecheck with TS2883 because the docs app inherited `declaration: true`. The docs app now turns declarations off.
- **2026-11-10:** with jsdom 31, focus moves back to a dialog's trigger asynchronously, so the unit test waits for it.
- **2026-11-10:** in jsdom every element has `clientHeight` 0, so the virtualizer rendered no rows. The DataTable tests give the scrolling body its CSS height through a `clientHeight` getter.
- **2026-11-10:** `@typescript-eslint/prefer-nullish-coalescing` flagged `value === undefined ? inner : value` in the controlled-state helper, but `??` would treat a controlled `null` sort as uncontrolled; the line keeps the ternary with a reasoned disable comment.
