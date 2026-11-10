import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ComboBox, ComboBoxItem, type ComboBoxProps } from "./ComboBox.js";

const carriers = [
  { id: "dhl", name: "DHL" },
  { id: "dpd", name: "DPD" },
  { id: "gls", name: "GLS" },
  { id: "ups", name: "UPS" },
];

function Carrier(props: Partial<ComboBoxProps<(typeof carriers)[number]>>) {
  return (
    <ComboBox label="Carrier" placeholder="Search carriers" defaultItems={carriers} {...props}>
      {(item) => <ComboBoxItem id={item.id}>{item.name}</ComboBoxItem>}
    </ComboBox>
  );
}

describe("ComboBox", () => {
  it("renders a combobox named by its label", () => {
    render(<Carrier />);
    expect(screen.getByRole("combobox", { name: "Carrier" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("filters the options as the user types", async () => {
    render(<Carrier />);
    await userEvent.type(screen.getByRole("combobox"), "d");
    const options = within(screen.getByRole("listbox")).getAllByRole("option");
    expect(options.map((option) => option.textContent)).toEqual(["DHL", "DPD"]);
  });

  it("selects an option with the keyboard", async () => {
    const onChange = vi.fn();
    render(<Carrier onChange={onChange} />);
    const input = screen.getByRole("combobox");
    await userEvent.type(input, "u");
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(input).toHaveValue("UPS");
    expect(onChange).toHaveBeenCalledWith("ups");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("opens the full list from the button", async () => {
    render(<Carrier />);
    await userEvent.click(screen.getByRole("button"));
    expect(within(screen.getByRole("listbox")).getAllByRole("option")).toHaveLength(4);
  });

  it("shows the empty text when nothing matches", async () => {
    render(<Carrier emptyText="No carrier found" allowsEmptyCollection />);
    await userEvent.type(screen.getByRole("combobox"), "zz");
    expect(screen.getByText("No carrier found")).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    render(<Carrier />);
    await userEvent.type(screen.getByRole("combobox"), "d");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("links the description and shows an error", () => {
    render(<Carrier description="Used for new shipments." error="Choose a carrier." />);
    const input = screen.getByRole("combobox");
    expect(input).toHaveAccessibleDescription(/Used for new shipments\./);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Choose a carrier.")).toBeInTheDocument();
  });
});
