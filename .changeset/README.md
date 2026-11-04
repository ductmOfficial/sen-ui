# Changesets

Each Markdown file in this folder describes one change to a published package: which package, the semver bump, and a line for its changelog.

When a pull request changes `@ductmofficial/sen-ui` in a way users will notice, add one:

```sh
pnpm changeset
```

Pick the package and bump (`patch` for fixes, `minor` for new features, `major` for breaking changes), then write the summary as a changelog entry for users. Commit the generated file with the pull request.

Private workspace packages (`docs`, `@repo/*`) are never versioned or published, so they need no changeset.

`pnpm changeset version` consumes these files, bumps versions and writes `CHANGELOG.md`. `pnpm changeset publish` publishes to npm.
