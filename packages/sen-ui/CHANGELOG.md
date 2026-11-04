# @ductmofficial/sen-ui

## 0.1.0

### Minor Changes

- 73d4f0a: First release. Adds `Button`, a native `<button>` with `primary` and `secondary` variants that defaults to `type="button"`, so it never submits a form by accident. Import the styles once with `import "@ductmofficial/sen-ui/styles.css"`.
- 72a55ea: Add `TextField`, a text input with a required visible `label` and an optional `description` and `error`. The description and error are linked to the input through `aria-describedby`, and an error also sets `aria-invalid`. `className` styles the wrapper; every other prop, including `ref`, goes to the `<input>`.
