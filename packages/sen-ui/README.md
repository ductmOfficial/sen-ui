# @ductmofficial/sen-ui

Accessible React components for React 19.

> Early development: the API is not stable yet.

## Install

```bash
npm install @ductmofficial/sen-ui
```

`react` and `react-dom` 19 are peer dependencies.

## Usage

Import the stylesheet once, at the root of your app, then use the components:

```tsx
import "@ductmofficial/sen-ui/styles.css";
import { Button, TextField } from "@ductmofficial/sen-ui";

export function SignupForm() {
  return (
    <form>
      <TextField label="Email" type="email" description="We never share your email." required />
      <Button type="submit">Sign up</Button>
    </form>
  );
}
```

## Components

Live examples for every component are in [Storybook](https://ductmofficial.github.io/sen-ui/).

| Component   | What it is                                                                                                                                                                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Button`    | Native `<button>` with `primary` and `secondary` variants. Defaults to `type="button"`, so it never submits a form by accident.                                                                                                            |
| `TextField` | Text input with a required visible `label`, plus optional `description` and `error`, linked through `aria-describedby`. An `error` sets `aria-invalid`. `className` styles the wrapper; other props, including `ref`, go to the `<input>`. |

Show errors after the user submits, and move focus to the first invalid field: `TextField` does not announce an error the moment it appears.

## Styling

- All component CSS lives in the `sen` [cascade layer](https://developer.mozilla.org/docs/Web/CSS/@layer). Unlayered CSS in your app always wins over it, without specificity tricks.
- Component state is exposed as `data-*` attributes (for example `data-variant="secondary"`), so you can target it from your own CSS.
- Colors and sizes read CSS custom properties (`--sen-*`) with built-in fallbacks.

## Entry points

| Import                                  | Contents                                     | Status  |
| --------------------------------------- | -------------------------------------------- | ------- |
| `@ductmofficial/sen-ui`                 | Components (ESM, with TypeScript types)      | Ready   |
| `@ductmofficial/sen-ui/styles.css`      | Styles for every component, in `@layer sen`  | Ready   |
| `@ductmofficial/sen-ui/tokens.css`      | Design tokens as CSS custom properties       | Planned |
| `@ductmofficial/sen-ui/tailwind-preset` | Tailwind preset that maps to the same tokens | Planned |

The package is ESM-only and marks only `*.css` as having side effects, so bundlers keep the stylesheet import but can tree-shake unused components.

## License

[MIT](LICENSE) © 2026 Duc Tran
