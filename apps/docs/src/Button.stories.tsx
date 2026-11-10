import { Button } from "@ductmofficial/sen-ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

const meta = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "Save",
    variant: "primary",
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    // Stories import the built package, whose props Storybook cannot infer, so controls are declared.
    variant: { control: "inline-radio", options: ["primary", "secondary"] },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Cancel" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

// Runs the axe checks against the dark theme too.
export const PrimaryDark: Story = {
  globals: { theme: "dark" },
  play: async () => {
    await expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  },
};

export const SecondaryDark: Story = {
  ...Secondary,
  globals: { theme: "dark" },
};
