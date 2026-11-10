import "@ductmofficial/sen-ui/styles.css";
import "./preview.css";

import type { Decorator, Preview } from "@storybook/react-vite";

// Sets data-theme on <html>, which the tokens read. Stories can pin a theme with `globals`.
const withTheme: Decorator = (Story, context) => {
  document.documentElement.dataset.theme = context.globals.theme === "dark" ? "dark" : "light";
  return Story();
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: "Color theme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  parameters: {
    controls: { expanded: true },
    // Fail the story's test on any axe violation, so `pnpm test` and CI block a11y regressions.
    a11y: { test: "error" },
  },
};

export default preview;
