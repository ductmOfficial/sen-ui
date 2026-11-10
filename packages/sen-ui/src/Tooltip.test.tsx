import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Button } from "./Button.js";
import { Tooltip } from "./Tooltip.js";

function renderTooltip(props: Partial<Parameters<typeof Tooltip>[0]> = {}) {
  return render(
    <Tooltip content="Delete the file" delay={0} closeDelay={0} {...props}>
      <Button aria-label="Delete">×</Button>
    </Tooltip>,
  );
}

describe("Tooltip", () => {
  it("opens on keyboard focus and describes the trigger", async () => {
    renderTooltip();
    await userEvent.tab();

    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent("Delete the file");
    expect(screen.getByRole("button", { name: "Delete" })).toHaveAccessibleDescription(
      "Delete the file",
    );
  });

  it("closes on Escape and keeps focus on the trigger", async () => {
    renderTooltip();
    await userEvent.tab();
    await screen.findByRole("tooltip");

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toHaveFocus();
  });

  // Hover depends on real pointer events and interaction modality; it is covered by the
  // Storybook interaction test in a real browser (apps/docs/src/Tooltip.stories.tsx).

  it("does not open when disabled", async () => {
    renderTooltip({ isDisabled: true });
    await userEvent.tab();
    await act(() => new Promise((resolve) => setTimeout(resolve, 20)));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("keeps the trigger's own handlers", async () => {
    let clicks = 0;
    render(
      <Tooltip content="Save changes" delay={0}>
        <Button
          onClick={() => {
            clicks += 1;
          }}
        >
          Save
        </Button>
      </Tooltip>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(clicks).toBe(1);
  });
});
