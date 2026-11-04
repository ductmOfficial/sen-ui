import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TextField } from "./TextField.js";

describe("TextField", () => {
  it("uses the label as the input's accessible name", () => {
    render(<TextField label="Email" />);

    expect(screen.getByRole("textbox", { name: "Email" })).toHaveAttribute("type", "text");
  });

  it("keeps a caller-provided id wired to the label", () => {
    render(<TextField label="Email" id="email" />);

    expect(screen.getByRole("textbox", { name: "Email" })).toHaveAttribute("id", "email");
  });

  it("announces the description", () => {
    render(<TextField label="Email" description="We never share it." />);

    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toHaveAccessibleDescription("We never share it.");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("marks the input invalid and announces the error after the description", () => {
    render(<TextField label="Email" description="We never share it." error="Enter an email." />);

    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription("We never share it. Enter an email.");
  });

  it("keeps ids passed in aria-describedby", () => {
    render(
      <>
        <TextField label="Email" error="Enter an email." aria-describedby="email-help" />
        <p id="email-help">Use your work address.</p>
      </>,
    );

    expect(screen.getByRole("textbox", { name: "Email" })).toHaveAccessibleDescription(
      "Enter an email. Use your work address.",
    );
  });

  it("puts className on the wrapper and other props on the input", () => {
    const { container } = render(
      <TextField label="Email" className="wide" type="email" placeholder="you@example.com" />,
    );

    const input = screen.getByRole("textbox", { name: "Email" });
    expect(container.firstElementChild).toHaveClass("wide");
    expect(input).not.toHaveClass("wide");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("placeholder", "you@example.com");
  });

  it("calls onChange as the user types", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextField label="Email" onChange={onChange} />);

    const input = screen.getByRole("textbox", { name: "Email" });
    await user.type(input, "hi");

    expect(input).toHaveValue("hi");
    expect(onChange).toHaveBeenCalledTimes(2);
  });
});
