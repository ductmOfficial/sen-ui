import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { DataTable, type DataTableColumn, type DataTableProps } from "./DataTable.js";

interface Order {
  id: string;
  site: string;
  lines: number;
}

const sites = ["Fürth", "Hamburg", "Singapore", "Mexico City"];
const makeOrders = (count: number): Order[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `O-${String(i + 1).padStart(4, "0")}`,
    site: sites[i % sites.length] ?? "",
    lines: (i * 7) % 50,
  }));

const columns: DataTableColumn<Order>[] = [
  {
    id: "id",
    header: "Order",
    cell: (o) => o.id,
    sortValue: (o) => o.id,
    searchValue: (o) => o.id,
  },
  {
    id: "site",
    header: "Site",
    cell: (o) => o.site,
    sortValue: (o) => o.site,
    searchValue: (o) => o.site,
    filter: (o, value) => o.site === value,
  },
  { id: "lines", header: "Lines", cell: (o) => o.lines, sortValue: (o) => o.lines, align: "end" },
];

function Orders(props: Partial<DataTableProps<Order>> & { count?: number }) {
  const { count = 8, ...rest } = props;
  return (
    <DataTable
      aria-label="Orders"
      columns={columns}
      rows={makeOrders(count)}
      getRowId={(o) => o.id}
      {...rest}
    />
  );
}

const bodyRows = () => screen.getAllByRole("row").slice(1);
const bodyRow = (index: number) => {
  const row = bodyRows()[index];
  if (!row) throw new Error(`No body row ${String(index)}`);
  return row;
};
const firstCells = () =>
  bodyRows().map((row) => within(row).getAllByRole("gridcell")[0]?.textContent);

// jsdom has no layout: give the scrolling body its CSS height so the virtualizer renders rows.
const clientHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "clientHeight");
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, "clientHeight", {
    configurable: true,
    get(this: HTMLElement) {
      return Number.parseFloat(this.style.height) || 0;
    },
  });
});
afterAll(() => {
  if (clientHeight) Object.defineProperty(HTMLElement.prototype, "clientHeight", clientHeight);
});

describe("DataTable", () => {
  it("renders an ARIA grid with headers and rows", () => {
    render(<Orders />);
    const grid = screen.getByRole("grid", { name: "Orders" });
    expect(grid).toHaveAttribute("aria-rowcount", "9");
    expect(grid).toHaveAttribute("aria-colcount", "3");
    expect(screen.getAllByRole("columnheader").map((h) => h.textContent)).toEqual([
      "Order",
      "Site",
      "Lines",
    ]);
    expect(screen.getByRole("columnheader", { name: "Order" })).toHaveAttribute(
      "aria-sort",
      "none",
    );
    expect(bodyRows()[0]).toHaveAttribute("aria-rowindex", "2");
  });

  it("renders only the visible rows of a long list", () => {
    render(<Orders count={1000} height={400} rowHeight={40} />);
    expect(screen.getByRole("grid")).toHaveAttribute("aria-rowcount", "1001");
    const rendered = bodyRows().length;
    expect(rendered).toBeGreaterThan(5);
    expect(rendered).toBeLessThan(40);
  });

  it("sorts ascending, descending, then unsorted when a header is clicked", async () => {
    render(<Orders count={4} />);
    const header = screen.getByRole("columnheader", { name: "Site" });
    await userEvent.click(header);
    expect(header).toHaveAttribute("aria-sort", "ascending");
    expect(bodyRows().map((r) => within(r).getAllByRole("gridcell")[1]?.textContent)).toEqual([
      "Fürth",
      "Hamburg",
      "Mexico City",
      "Singapore",
    ]);
    await userEvent.click(header);
    expect(header).toHaveAttribute("aria-sort", "descending");
    expect(firstCells()[0]).toBe("O-0003");
    await userEvent.click(header);
    expect(header).toHaveAttribute("aria-sort", "none");
    expect(firstCells()[0]).toBe("O-0001");
  });

  it("has a single tab stop and moves with the arrow keys", async () => {
    render(<Orders />);
    await userEvent.tab();
    expect(screen.getByRole("columnheader", { name: "Order" })).toHaveFocus();
    await userEvent.tab();
    expect(document.body).toHaveFocus();
    await userEvent.tab({ shift: true });
    await userEvent.keyboard("{ArrowDown}{ArrowRight}");
    expect(within(bodyRow(0)).getByRole("gridcell", { name: "Fürth" })).toHaveFocus();
    await userEvent.keyboard("{End}");
    expect(within(bodyRow(0)).getAllByRole("gridcell")[2]).toHaveFocus();
    await userEvent.keyboard("{Home}{ArrowUp}");
    expect(screen.getByRole("columnheader", { name: "Order" })).toHaveFocus();
  });

  it("reaches the last row of a long list with Ctrl+End and keeps it rendered", async () => {
    render(<Orders count={1000} />);
    await userEvent.tab();
    await userEvent.keyboard("{Control>}{End}{/Control}");
    await waitFor(() => {
      expect(document.activeElement?.closest("[role='row']")).toHaveAttribute(
        "aria-rowindex",
        "1001",
      );
    });
    // Last order O-1000: lines = (999 * 7) % 50.
    expect(document.activeElement).toHaveTextContent("43");
    await userEvent.keyboard("{Control>}{Home}{/Control}");
    expect(screen.getByRole("columnheader", { name: "Order" })).toHaveFocus();
  });

  it("sorts with Enter on a focused header", async () => {
    render(<Orders count={4} />);
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}{Enter}");
    expect(screen.getByRole("columnheader", { name: "Lines" })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
  });

  it("applies the global filter and column filters", () => {
    const { rerender } = render(<Orders globalFilter="furth" />);
    expect(firstCells()).toEqual(["O-0001", "O-0005"]);
    rerender(<Orders columnFilters={{ site: "Hamburg" }} />);
    expect(firstCells()).toEqual(["O-0002", "O-0006"]);
    expect(screen.getByRole("grid")).toHaveAttribute("aria-rowcount", "3");
  });

  it("shows the empty state when nothing matches", () => {
    render(<Orders globalFilter="nothing" emptyState="No orders match." />);
    expect(screen.getByRole("gridcell", { name: "No orders match." })).toBeInTheDocument();
  });

  it("only reports sort changes in manual mode", async () => {
    const onSortChange = vi.fn();
    render(<Orders count={4} manual sort={null} onSortChange={onSortChange} />);
    await userEvent.click(screen.getByRole("columnheader", { name: "Lines" }));
    expect(onSortChange).toHaveBeenCalledWith({ column: "lines", direction: "ascending" });
    expect(firstCells()[0]).toBe("O-0001");
  });

  describe("selection", () => {
    it("selects rows with their checkboxes and reports the ids", async () => {
      const onSelectionChange = vi.fn();
      render(<Orders count={4} selectionMode="multiple" onSelectionChange={onSelectionChange} />);
      expect(screen.getByRole("grid")).toHaveAttribute("aria-multiselectable", "true");

      await userEvent.click(screen.getByRole("checkbox", { name: "Select O-0002" }));
      expect(onSelectionChange).toHaveBeenLastCalledWith(new Set(["O-0002"]));
      expect(bodyRows()[1]).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("checkbox", { name: "Select all rows" })).toHaveProperty(
        "indeterminate",
        true,
      );
    });

    it("selects the focused row with Space and every row with Ctrl+A", async () => {
      render(<Orders count={4} selectionMode="multiple" getRowLabel={(o) => `order ${o.id}`} />);
      await userEvent.tab();
      await userEvent.keyboard("{ArrowDown}{ArrowRight} ");
      expect(screen.getByRole("checkbox", { name: "Select order O-0001" })).toBeChecked();

      await userEvent.keyboard("{Control>}a{/Control}");
      expect(screen.getByRole("checkbox", { name: "Select all rows" })).toBeChecked();
      expect(bodyRows().every((row) => row.getAttribute("aria-selected") === "true")).toBe(true);
    });

    it("selects and clears every visible row from the header checkbox", async () => {
      render(<Orders count={6} selectionMode="multiple" columnFilters={{ site: "Fürth" }} />);
      const all = screen.getByRole("checkbox", { name: "Select all rows" });
      await userEvent.click(all);
      expect(screen.getAllByRole("checkbox", { checked: true })).toHaveLength(3);
      await userEvent.click(all);
      expect(screen.queryAllByRole("checkbox", { checked: true })).toHaveLength(0);
    });

    it("can be controlled", async () => {
      const onSelectionChange = vi.fn();
      render(
        <Orders
          count={3}
          selectionMode="multiple"
          selectedIds={new Set(["O-0001"])}
          onSelectionChange={onSelectionChange}
        />,
      );
      expect(screen.getByRole("checkbox", { name: "Select O-0001" })).toBeChecked();
      await userEvent.click(screen.getByRole("checkbox", { name: "Select O-0003" }));
      expect(onSelectionChange).toHaveBeenCalledWith(new Set(["O-0001", "O-0003"]));
      expect(screen.getByRole("checkbox", { name: "Select O-0003" })).not.toBeChecked();
    });
  });
});
