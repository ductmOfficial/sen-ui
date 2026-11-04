import react from "@repo/eslint-config/react";
import storybook from "eslint-plugin-storybook";
import { defineConfig } from "eslint/config";

export default defineConfig(react, storybook.configs["flat/recommended"]);
