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
- Components read the design tokens. Each component also has its own override properties, such as `--sen-button-primary-background` or `--sen-text-field-border-color`, that fall back to a token.

## Theming

`styles.css` includes the design tokens: `--sen-*` custom properties for color, typography, spacing, radius, focus ring and motion.

- **Light and dark.** The light theme is the default. The dark theme follows the operating system (`prefers-color-scheme`) unless the page sets `data-theme="light"`. Set `data-theme="dark"` or `data-theme="light"` on `<html>`, or on any element, to force a theme for that subtree.
- **Accessible by default.** In both themes, text tokens meet WCAG 2.2 AA contrast (4.5:1) on `bg` and `surface`, and borders and the focus ring meet 3:1. The library's tests check this.
- **Your brand.** The tokens live in the `sen` cascade layer, so any unlayered rule in your app wins:

```css
:root {
  --sen-color-accent: #0b6e5a;
  --sen-color-accent-hover: #095a4a;
  --sen-focus-ring-color: #0b6e5a;
  --sen-radius-md: 0.25rem;
}
```

Override the dark values in a `[data-theme="dark"]` rule and in a `@media (prefers-color-scheme: dark)` block for `:root:not([data-theme="light"])`.

### Tailwind CSS

With Tailwind CSS v4, import the theme after Tailwind and the tokens:

```css
@import "tailwindcss";
@import "@ductmofficial/sen-ui/styles.css";
@import "@ductmofficial/sen-ui/tailwind.css";
```

This adds utilities such as `bg-sen-bg`, `text-sen-fg`, `text-sen-fg-muted`, `border-sen-border`, `rounded-sen-md` and `font-sen`. They reference the tokens directly, so they follow the active theme.

## Entry points

| Import                               | Contents                                                      |
| ------------------------------------ | ------------------------------------------------------------- |
| `@ductmofficial/sen-ui`              | Components (ESM, with TypeScript types)                       |
| `@ductmofficial/sen-ui/styles.css`   | Design tokens and styles for every component, in `@layer sen` |
| `@ductmofficial/sen-ui/tokens.css`   | Design tokens only, for apps that do not use the components   |
| `@ductmofficial/sen-ui/tailwind.css` | Tailwind CSS v4 theme that maps the tokens to utilities       |

The package is ESM-only and marks only `*.css` as having side effects, so bundlers keep the stylesheet import but can tree-shake unused components.

## License

[MIT](LICENSE) © 2026 Duc Tran
