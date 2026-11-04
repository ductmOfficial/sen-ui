import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

// Runs every story as a test in headless Chromium, including its a11y checks (see .storybook/preview.ts).
// storybookTest() reads .storybook/ relative to the working directory, which is apps/docs under pnpm and turbo.
export default defineConfig({
  plugins: [storybookTest()],
  test: {
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
  },
});
