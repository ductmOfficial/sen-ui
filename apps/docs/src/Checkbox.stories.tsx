import { Checkbox } from "@ductmofficial/sen-ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  args: {
    children: "Email me about new releases",
    isDisabled: false,
    isInvalid: false,
    onChange: fn(),
  },
  argTypes: {
    // Stories import the built package, whose props Storybook cannot infer, so controls are declared.
    children: { control: "text" },
    description: { control: "text" },
    isIndeterminate: { control: "boolean" },
    isDisabled: { control: "boolean" },
    isInvalid: { control: "boolean" },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultSelected: true },
};

export const Indeterminate: Story = {
  args: { children: "Select all", isIndeterminate: true },
};

export const WithDescription: Story = {
  args: { description: "At most one email a month." },
};

export const Invalid: Story = {
  args: { children: "I accept the terms", isInvalid: true },
};

export const Disabled: Story = {
  args: { isDisabled: true, defaultSelected: true },
};

// Runs the axe checks against the dark theme too.
export const StatesDark: Story = {
  globals: { theme: "dark" },
  render: (args) => (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <Checkbox {...args}>Unchecked</Checkbox>
      <Checkbox {...args} defaultSelected>
        Checked
      </Checkbox>
      <Checkbox {...args} isIndeterminate>
        Indeterminate
      </Checkbox>
      <Checkbox {...args} description="At most one email a month.">
        With description
      </Checkbox>
    </div>
  ),
};
