import react from "@repo/eslint-config/react";
import { defineConfig } from "eslint/config";
import globals from "globals";

// Scripts run in Node, not in the browser.
export default defineConfig(react, {
  files: ["scripts/**/*.mjs"],
  languageOptions: { globals: globals.node },
});
