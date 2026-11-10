// Types for CSS Module imports. Narrower than `vite/client`, which would also declare Vite-only
// globals such as `import.meta.env` that the published library must not depend on.
declare module "*.module.css" {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

// Plain stylesheets imported for their side effect (e.g. tokens.css); Vite bundles them into styles.css.
declare module "*.css";
