import { Tab, TabList, TabPanel, Tabs } from "@ductmofficial/sen-ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  args: {
    orientation: "horizontal",
    keyboardActivation: "automatic",
  },
  argTypes: {
    // Stories import the built package, whose props Storybook cannot infer, so controls are declared.
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    keyboardActivation: { control: "inline-radio", options: ["automatic", "manual"] },
    isDisabled: { control: "boolean" },
  },
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Account settings">
        <Tab id="profile">Profile</Tab>
        <Tab id="security">Security</Tab>
        <Tab id="billing" isDisabled>
          Billing
        </Tab>
        <Tab id="notifications">Notifications</Tab>
      </TabList>
      <TabPanel id="profile">Name, photo and contact details.</TabPanel>
      <TabPanel id="security">Password, passkeys and active sessions.</TabPanel>
      <TabPanel id="billing">Plan and invoices.</TabPanel>
      <TabPanel id="notifications">Email and push notifications.</TabPanel>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Vertical: Story = {
  args: { orientation: "vertical" },
};

/** Arrow keys move selection and skip the disabled tab. */
export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole("tab", { name: "Profile" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    await expect(canvas.getByRole("tab", { name: "Notifications" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent("Email and push notifications.");
  },
};

// Runs the axe checks against the dark theme too.
export const Dark: Story = {
  globals: { theme: "dark" },
  args: { defaultSelectedKey: "security" },
};
