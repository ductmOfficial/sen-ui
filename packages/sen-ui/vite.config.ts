// The package tsconfig sets `types: []` because src/ targets the browser, but this file runs in Node.
// Trade-off: the reference applies to the whole tsconfig program, so src/ can also see Node globals.
/// <reference types="node" />

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { defineConfig, type Plugin } from "vite";

// In watch mode (`pnpm dev`) Vite empties dist/ on every rebuild, deleting the .d.ts files
// that `tsc` adds after `vite build`. Re-emit them after each rebuild so consumers keep their types.
function emitTypesInWatchMode(): Plugin {
  return {
    name: "sen-ui:emit-types-in-watch-mode",
    apply: "build",
    writeBundle() {
      if (!this.meta.watchMode) return;
      try {
        execFileSync("tsc", ["-p", "tsconfig.build.json"], { stdio: "inherit" });
      } catch {
        // tsc has already printed the type errors; keep watching instead of exiting.
      }
    },
  };
}

// Ships stylesheets that are not part of styles.css as standalone files, e.g. dist/tokens.css.
function copyStylesheets(files: string[]): Plugin {
  return {
    name: "sen-ui:copy-stylesheets",
    apply: "build",
    generateBundle() {
      for (const file of files) {
        this.emitFile({
          type: "asset",
          fileName: file,
          source: readFileSync(`src/${file}`, "utf8"),
        });
      }
    },
  };
}

export default defineConfig({
  plugins: [emitTypesInWatchMode(), copyStylesheets(["tokens.css", "tailwind.css"])],
  css: {
    modules: {
      // Readable, stable class names in the shipped CSS, e.g. `sen-button-a1b2c`.
      generateScopedName: "sen-[local]-[hash:base64:5]",
    },
  },
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      cssFileName: "styles",
    },
    // One styles.css for the whole library, exported as `@ductmofficial/sen-ui/styles.css`.
    cssCodeSplit: false,
    // Apps minify their own bundles; shipping readable code keeps stack traces and debugging clear.
    minify: false,
    sourcemap: true,
    rolldownOptions: {
      // React and the runtime dependencies stay external; the app installs and dedupes them.
      external: [/^react(-dom)?($|\/)/, /^react-aria-components($|\/)/],
      output: {
        // One output file per source module, so consumers' bundlers can drop unused components.
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
  },
});
