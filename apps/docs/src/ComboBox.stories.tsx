import { ComboBox, ComboBoxItem } from "@ductmofficial/sen-ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, userEvent, within } from "storybook/test";

const carriers = [
  { id: "dhl", name: "DHL" },
  { id: "dpd", name: "DPD" },
  { id: "fedex", name: "FedEx" },
  { id: "gls", name: "GLS" },
  { id: "hermes", name: "Hermes" },
  { id: "ups", name: "UPS" },
];

const meta = {
  title: "Components/ComboBox",
  component: ComboBox,
  args: {
    label: "Carrier",
    placeholder: "Search carriers",
    defaultItems: carriers,
    isDisabled: false,
    allowsEmptyCollection: true,
    onChange: fn(),
    children: (item: object) => {
      const carrier = item as (typeof carriers)[number];
      return <ComboBoxItem id={carrier.id}>{carrier.name}</ComboBoxItem>;
    },
  },
  argTypes: {
    // Stories import the built package, whose props Storybook cannot infer, so controls are declared.
    label: { control: "text" },
    placeholder: { control: "text" },
    description: { control: "text" },
    error: { control: "text" },
    emptyText: { control: "text" },
    isDisabled: { control: "boolean" },
    children: { control: false },
    defaultItems: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxInlineSize: "20rem", minBlockSize: "18rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ComboBox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: { description: "Used for new shipments.", error: "Choose a carrier." },
};

/** Typing filters the list; ArrowDown and Enter pick a match. */
export const TypeToFilter: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("combobox", { name: "Carrier" });
    await userEvent.type(input, "he");
    const listbox = await screen.findByRole("listbox");
    await expect(within(listbox).getAllByRole("option")).toHaveLength(1);
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect(input).toHaveValue("Hermes");
  },
};

// Runs the axe checks against the dark theme too, with the list open.
export const OpenDark: Story = {
  globals: { theme: "dark" },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button"));
    await expect(await screen.findByRole("listbox")).toBeInTheDocument();
  },
};
