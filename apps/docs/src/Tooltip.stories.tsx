import { Button, Tooltip } from "@ductmofficial/sen-ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  args: {
    content: "Delete the file",
    placement: "top",
    delay: 700,
    closeDelay: 300,
    children: (
      <Button variant="secondary" aria-label="Delete">
        ×
      </Button>
    ),
  },
  argTypes: {
    // Stories import the built package, whose props Storybook cannot infer, so controls are declared.
    content: { control: "text" },
    placement: { control: "select", options: ["top", "bottom", "start", "end"] },
    delay: { control: { type: "number", min: 0, step: 100 } },
    closeDelay: { control: { type: "number", min: 0, step: 100 } },
    isDisabled: { control: "boolean" },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "3rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Hovering opens the tooltip after the delay; it describes the trigger. */
export const OnHover: Story = {
  args: { delay: 0 },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "Delete" });
    // React Aria opens tooltips on hover only after a pointer interaction (not after keyboard use).
    await userEvent.click(canvasElement);
    await userEvent.hover(trigger);
    await expect(await screen.findByText("Delete the file")).toBeInTheDocument();
    await expect(trigger).toHaveAccessibleDescription("Delete the file");
  },
};

/** Keyboard focus opens the tooltip at once; Escape closes it. */
export const OnFocus: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "Delete" });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await expect(await screen.findByText("Delete the file")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByText("Delete the file")).not.toBeInTheDocument());
  },
};

// Runs the axe checks against the dark theme too, with the tooltip open.
export const OpenDark: Story = {
  globals: { theme: "dark" },
  play: async () => {
    await userEvent.tab();
    await expect(await screen.findByText("Delete the file")).toBeInTheDocument();
  },
};
