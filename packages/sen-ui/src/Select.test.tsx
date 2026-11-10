import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Select, SelectItem, type SelectProps } from "./Select.js";

function Warehouse(props: Partial<SelectProps<object>>) {
  return (
    <Select label="Warehouse" placeholder="Choose a warehouse" {...props}>
      <SelectItem id="fue">Fürth</SelectItem>
      <SelectItem id="ham">Hamburg</SelectItem>
      <SelectItem id="sgn" isDisabled>
        Singapore
      </SelectItem>
      <SelectItem id="mex">Mexico City</SelectItem>
    </Select>
  );
}

describe("Select", () => {
  it("shows the placeholder and names the button by the label", () => {
    render(<Warehouse />);
    const button = screen.getByRole("button", { name: /Warehouse/ });
    expect(button).toHaveTextContent("Choose a warehouse");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("opens on click and selects an option", async () => {
    const onChange = vi.fn();
    render(<Warehouse onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: /Warehouse/ }));

    const listbox = screen.getByRole("listbox");
    expect(within(listbox).getAllByRole("option")).toHaveLength(4);
    await userEvent.click(within(listbox).getByRole("option", { name: "Hamburg" }));

    expect(onChange).toHaveBeenCalledWith("ham");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Warehouse/ })).toHaveTextContent("Hamburg");
  });

  it("works with the keyboard and skips disabled options", async () => {
    render(<Warehouse />);
    await userEvent.tab();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await userEvent.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    expect(screen.getByRole("button", { name: /Warehouse/ })).toHaveTextContent("Mexico City");
  });

  it("closes on Escape without changing the value", async () => {
    render(<Warehouse defaultValue="fue" />);
    await userEvent.click(screen.getByRole("button", { name: /Warehouse/ }));
    await userEvent.keyboard("{ArrowDown}{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Warehouse/ })).toHaveTextContent("Fürth");
  });

  it("renders options from items", async () => {
    const items = [
      { id: "a", name: "Inbound" },
      { id: "b", name: "Outbound" },
    ];
    render(
      <Select label="Flow" items={items}>
        {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
      </Select>,
    );
    await userEvent.click(screen.getByRole("button", { name: /Flow/ }));
    expect(screen.getByRole("option", { name: "Outbound" })).toBeInTheDocument();
  });

  it("links the description and shows an error", () => {
    render(<Warehouse description="Where the stock is counted." error="Choose a warehouse." />);
    expect(screen.getByText("Where the stock is counted.")).toBeInTheDocument();
    expect(screen.getByText("Choose a warehouse.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Warehouse/ })).toHaveAccessibleDescription(
      /Where the stock is counted\./,
    );
  });

  it("keeps a hidden native select for forms", () => {
    const { container } = render(<Warehouse name="warehouse" defaultValue="ham" />);
    const native = container.querySelector<HTMLSelectElement>("select[name='warehouse']");
    expect(native?.value).toBe("ham");
  });
});
