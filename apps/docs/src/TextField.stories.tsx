import { TextField } from "@ductmofficial/sen-ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

const meta = {
  title: "Components/TextField",
  component: TextField,
  args: {
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    // Stories import the built package, whose props Storybook cannot infer, so controls are declared.
    label: { control: "text" },
    description: { control: "text" },
    error: { control: "text" },
    placeholder: { control: "text" },
    type: { control: "select", options: ["text", "email", "password", "search", "tel", "url"] },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: { description: "We never share your email." },
};

export const WithError: Story = {
  args: {
    description: "We never share your email.",
    error: "Enter an email address, like you@example.com.",
    defaultValue: "you@",
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "you@example.com" },
};
