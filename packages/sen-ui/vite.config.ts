import { defineConfig } from "vite";

export default defineConfig({
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
      external: [/^react(-dom)?($|\/)/],
      output: {
        // One output file per source module, so consumers' bundlers can drop unused components.
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
  },
});
