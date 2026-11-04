import "@ductmofficial/sen-ui/styles.css";

import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    // Fail the story's test on any axe violation, so `pnpm test` and CI block a11y regressions.
    a11y: { test: "error" },
  },
};

export default preview;
