# @ductmofficial/sen-ui

## 0.3.0

### Minor Changes

- d352809: Add `Checkbox`, built on React Aria Components: a visible label, an optional `description` linked through `aria-describedby`, the indeterminate state (`isIndeterminate`), validation (`isInvalid`), and selection through `isSelected` / `defaultSelected` with `onChange(isSelected)`. `react-aria-components` is now a dependency.
- dced969: Add `Tabs`, `TabList`, `Tab` and `TabPanel`, built on React Aria Components. Arrow keys move between tabs (Home and End jump to the ends, disabled tabs are skipped), only the selected tab is in the tab order, and each tab controls its panel. Selection follows focus unless `keyboardActivation="manual"`; use `selectedKey` / `defaultSelectedKey` with `onSelectionChange`, and `orientation="vertical"` for a side list.
- fe609bc: Add `Tooltip`, built on React Aria Components. Wrap one focusable trigger, such as `Button`: `<Tooltip content="Delete the file"><Button aria-label="Delete">×</Button></Tooltip>`. It opens on hover after `delay` (700 ms by default) and at once on keyboard focus, closes on Escape, on press and when focus or the pointer leaves, and describes the trigger through `aria-describedby`.

## 0.2.0

### Minor Changes

- be68f07: `Button` and `TextField` now read the design tokens, so they follow the light and dark themes. The `--sen-button-*` and `--sen-text-field-*` properties still override single values. Visible change: the secondary `Button` now has the `surface` background instead of white.
- 3fa0300: Add design tokens: `--sen-*` custom properties for color, typography, spacing, radius, focus ring and motion, with a light theme and a dark theme. Dark follows `prefers-color-scheme` unless the page sets `data-theme="light"`; `data-theme="dark"` or `"light"` on any element forces a theme for its subtree. Tokens are included in `styles.css` and also shipped alone as `@ductmofficial/sen-ui/tokens.css`. They live in the `sen` layer, so an unlayered `:root { --sen-…: … }` in your app overrides them.
- 7b1de39: Add `@ductmofficial/sen-ui/tailwind.css`, a Tailwind CSS v4 theme that maps the design tokens to utilities such as `bg-sen-bg`, `text-sen-fg`, `border-sen-border`, `rounded-sen-md` and `font-sen`. Import it after `tailwindcss` and the tokens. The utilities reference the tokens directly, so they follow the light and dark themes.

## 0.1.0

### Minor Changes

- 0fc800a: First release. Adds `Button`, a native `<button>` with `primary` and `secondary` variants that defaults to `type="button"`, so it never submits a form by accident. Import the styles once with `import "@ductmofficial/sen-ui/styles.css"`.
- 9848cca: Add `TextField`, a text input with a required visible `label` and an optional `description` and `error`. The description and error are linked to the input through `aria-describedby`, and an error also sets `aria-invalid`. `className` styles the wrapper; every other prop, including `ref`, goes to the `<input>`.
