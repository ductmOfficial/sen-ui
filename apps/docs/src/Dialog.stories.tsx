import { Button, Dialog, DialogActions, DialogTrigger, TextField } from "@ductmofficial/sen-ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  args: {
    title: "Rename project",
    isDismissable: true,
    isKeyboardDismissDisabled: false,
    children: null,
  },
  argTypes: {
    // Stories import the built package, whose props Storybook cannot infer, so controls are declared.
    title: { control: "text" },
    isDismissable: { control: "boolean" },
    isKeyboardDismissDisabled: { control: "boolean" },
    role: { control: "inline-radio", options: ["dialog", "alertdialog"] },
    children: { control: false },
  },
  render: (args) => (
    <DialogTrigger>
      <Button>Rename project</Button>
      <Dialog {...args}>
        {({ close }) => (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              close();
            }}
          >
            <TextField label="Project name" defaultValue="Warehouse dashboard" autoFocus />
            <DialogActions>
              <Button variant="secondary" onClick={close}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogActions>
          </form>
        )}
      </Dialog>
    </DialogTrigger>
  ),
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Opening moves focus inside; Escape closes and returns focus to the trigger. */
export const OpenAndClose: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "Rename project" });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole("dialog", { name: "Rename project" });
    await waitFor(() =>
      expect(within(dialog).getByRole("textbox", { name: "Project name" })).toHaveFocus(),
    );
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const AlertDialog: Story = {
  args: { title: "Delete project?", role: "alertdialog", isDismissable: false },
  render: (args) => (
    <DialogTrigger>
      <Button>Delete project</Button>
      <Dialog {...args}>
        {({ close }) => (
          <>
            <p style={{ margin: 0 }}>
              The project and its dashboards will be deleted. This cannot be undone.
            </p>
            <DialogActions>
              <Button variant="secondary" onClick={close} autoFocus>
                Cancel
              </Button>
              <Button onClick={close}>Delete</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </DialogTrigger>
  ),
};

// Runs the axe checks against the dark theme too, with the dialog open.
export const OpenDark: Story = {
  globals: { theme: "dark" },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Rename project" }));
    await expect(await screen.findByRole("dialog")).toBeInTheDocument();
  },
};
