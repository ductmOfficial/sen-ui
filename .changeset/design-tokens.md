---
"@ductmofficial/sen-ui": minor
---

Add design tokens: `--sen-*` custom properties for color, typography, spacing, radius, focus ring and motion, with a light theme and a dark theme. Dark follows `prefers-color-scheme` unless the page sets `data-theme="light"`; `data-theme="dark"` or `"light"` on any element forces a theme for its subtree. Tokens are included in `styles.css` and also shipped alone as `@ductmofficial/sen-ui/tokens.css`. They live in the `sen` layer, so an unlayered `:root { --sen-…: … }` in your app overrides them.
