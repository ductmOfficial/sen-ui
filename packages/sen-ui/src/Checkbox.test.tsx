import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Checkbox } from "./Checkbox.js";

describe("Checkbox", () => {
  it("renders a checkbox named by its label", () => {
    render(<Checkbox>Accept the terms</Checkbox>);
    expect(screen.getByRole("checkbox", { name: "Accept the terms" })).not.toBeChecked();
  });

  it("toggles on click and reports the new state", async () => {
    const onChange = vi.fn();
    render(<Checkbox onChange={onChange}>Subscribe</Checkbox>);
    const checkbox = screen.getByRole("checkbox", { name: "Subscribe" });

    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith(true);

    await userEvent.click(screen.getByText("Subscribe"));
    expect(checkbox).not.toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it("toggles with the Space key", async () => {
    render(<Checkbox>Subscribe</Checkbox>);
    await userEvent.tab();
    expect(screen.getByRole("checkbox")).toHaveFocus();
    await userEvent.keyboard(" ");
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("exposes the indeterminate state", () => {
    render(<Checkbox isIndeterminate>Select all</Checkbox>);
    expect(screen.getByRole("checkbox")).toHaveProperty("indeterminate", true);
    expect(screen.getByText("Select all").closest("label")).toHaveAttribute(
      "data-indeterminate",
      "true",
    );
  });

  it("can be controlled", async () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Checkbox isSelected={false} onChange={onChange}>
        Remember me
      </Checkbox>,
    );
    await userEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("checkbox")).not.toBeChecked();

    rerender(
      <Checkbox isSelected onChange={onChange}>
        Remember me
      </Checkbox>,
    );
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("marks an invalid checkbox", () => {
    render(<Checkbox isInvalid>Accept the terms</Checkbox>);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("does not toggle when disabled", async () => {
    render(<Checkbox isDisabled>Subscribe</Checkbox>);
    await userEvent.click(screen.getByText("Subscribe"));
    expect(screen.getByRole("checkbox")).toBeDisabled();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("links the description to the checkbox", () => {
    render(<Checkbox description="One email a month.">Subscribe</Checkbox>);
    expect(screen.getByRole("checkbox", { name: "Subscribe" })).toHaveAccessibleDescription(
      "One email a month.",
    );
  });

  it("puts the custom class on the wrapper", () => {
    const { container } = render(<Checkbox className="wide">Subscribe</Checkbox>);
    expect(container.firstElementChild).toHaveClass("wide");
  });
});
