import { Select, SelectItem } from "@ductmofficial/sen-ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, userEvent, within } from "storybook/test";

const meta = {
  title: "Components/Select",
  component: Select,
  args: {
    label: "Warehouse",
    placeholder: "Choose a warehouse",
    isDisabled: false,
    onChange: fn(),
    children: null,
  },
  argTypes: {
    // Stories import the built package, whose props Storybook cannot infer, so controls are declared.
    label: { control: "text" },
    placeholder: { control: "text" },
    description: { control: "text" },
    error: { control: "text" },
    isDisabled: { control: "boolean" },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxInlineSize: "20rem", minBlockSize: "16rem" }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Select {...args}>
      <SelectItem id="fue">Fürth</SelectItem>
      <SelectItem id="ham">Hamburg</SelectItem>
      <SelectItem id="sgn" isDisabled>
        Singapore
      </SelectItem>
      <SelectItem id="mex">Mexico City</SelectItem>
    </Select>
  ),
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: { description: "Where the stock is counted." },
};

export const WithError: Story = {
  args: { error: "Choose a warehouse to continue." },
};

/** Keyboard: open with ArrowDown, move, choose with Enter. */
export const KeyboardSelection: Story = {
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: /Warehouse/ });
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(await screen.findByRole("listbox")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect(button).toHaveTextContent("Hamburg");
  },
};

// Runs the axe checks against the dark theme too, with the list open.
export const OpenDark: Story = {
  globals: { theme: "dark" },
  args: { defaultValue: "ham" },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /Warehouse/ }));
    await expect(await screen.findByRole("listbox")).toBeInTheDocument();
  },
};
