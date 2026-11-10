import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button.js";
import { Dialog, DialogActions, DialogTrigger, type DialogProps } from "./Dialog.js";

function DeleteDialog(props: Partial<DialogProps>) {
  return (
    <DialogTrigger>
      <Button>Delete project</Button>
      <Dialog title="Delete project?" {...props}>
        {({ close }) => (
          <>
            <p>This cannot be undone.</p>
            <DialogActions>
              <Button variant="secondary" onClick={close}>
                Cancel
              </Button>
              <Button onClick={close}>Delete</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </DialogTrigger>
  );
}

describe("Dialog", () => {
  it("opens from its trigger, named by its title", async () => {
    render(<DeleteDialog />);
    const trigger = screen.getByRole("button", { name: "Delete project" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);
    expect(screen.getByRole("dialog", { name: "Delete project?" })).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("moves focus into the dialog and keeps it there", async () => {
    render(<DeleteDialog />);
    await userEvent.click(screen.getByRole("button", { name: "Delete project" }));
    const dialog = screen.getByRole("dialog");
    await waitFor(() => {
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    });

    for (let i = 0; i < 4; i += 1) {
      await userEvent.tab();
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    render(<DeleteDialog />);
    const trigger = screen.getByRole("button", { name: "Delete project" });
    await userEvent.click(trigger);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    // Focus is restored asynchronously (jsdom 31 moves focus the way browsers do).
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it("closes from a button that calls close", async () => {
    render(<DeleteDialog />);
    await userEvent.click(screen.getByRole("button", { name: "Delete project" }));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("stays open on Escape when keyboard dismissal is disabled", async () => {
    render(<DeleteDialog isKeyboardDismissDisabled />);
    await userEvent.click(screen.getByRole("button", { name: "Delete project" }));
    await userEvent.keyboard("{Escape}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("supports the alertdialog role", async () => {
    render(<DeleteDialog role="alertdialog" />);
    await userEvent.click(screen.getByRole("button", { name: "Delete project" }));
    expect(screen.getByRole("alertdialog", { name: "Delete project?" })).toBeInTheDocument();
  });

  it("can be controlled without a trigger", async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog title="Session expired" isOpen onOpenChange={onOpenChange}>
        Sign in again to continue.
      </Dialog>,
    );
    expect(screen.getByRole("dialog", { name: "Session expired" })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
