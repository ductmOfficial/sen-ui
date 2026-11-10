import {
  DataTable,
  Select,
  SelectItem,
  TextField,
  type DataTableColumn,
  type DataTableProps,
} from "@ductmofficial/sen-ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

interface Order {
  id: string;
  site: string;
  status: "Open" | "Picking" | "Shipped";
  lines: number;
  due: Date;
}

const sites = ["Fürth", "Hamburg", "Singapore", "Mexico City", "São Paulo"];
const statuses: Order["status"][] = ["Open", "Picking", "Shipped"];
const start = Date.UTC(2026, 10, 1);

// Deterministic data, so story tests and screenshots do not change between runs.
const orders: Order[] = Array.from({ length: 1000 }, (_, i) => ({
  id: `SO-${String(i + 1).padStart(5, "0")}`,
  site: sites[(i * 7) % sites.length] ?? "",
  status: statuses[(i * 5) % statuses.length] ?? "Open",
  lines: ((i * 37) % 60) + 1,
  due: new Date(start + ((i * 13) % 30) * 86_400_000),
}));

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  timeZone: "UTC",
});

const columns: DataTableColumn<Order>[] = [
  {
    id: "id",
    header: "Order",
    cell: (o) => o.id,
    sortValue: (o) => o.id,
    searchValue: (o) => o.id,
    width: "9rem",
  },
  {
    id: "site",
    header: "Site",
    cell: (o) => o.site,
    sortValue: (o) => o.site,
    searchValue: (o) => o.site,
    filter: (o, value) => o.site === value,
  },
  {
    id: "status",
    header: "Status",
    cell: (o) => o.status,
    sortValue: (o) => o.status,
    filter: (o, value) => o.status === value,
    width: "8rem",
  },
  {
    id: "lines",
    header: "Lines",
    cell: (o) => o.lines,
    sortValue: (o) => o.lines,
    align: "end",
    width: "6rem",
  },
  {
    id: "due",
    header: "Due",
    cell: (o) => dateFormat.format(o.due),
    sortValue: (o) => o.due,
    width: "7rem",
  },
];

function FilteredOrders(args: DataTableProps<Order>) {
  const [query, setQuery] = useState("");
  const [site, setSite] = useState<string>("all");
  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "end" }}>
        <TextField
          label="Search orders"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
        <Select
          label="Site"
          value={site}
          onChange={(key) => {
            setSite(String(key));
          }}
        >
          <SelectItem id="all">All sites</SelectItem>
          {sites.map((name) => (
            <SelectItem key={name} id={name}>
              {name}
            </SelectItem>
          ))}
        </Select>
      </div>
      <DataTable<Order>
        {...args}
        globalFilter={query}
        columnFilters={site === "all" ? {} : { site }}
        emptyState="No orders match these filters."
      />
    </div>
  );
}

function SelectableOrders(args: DataTableProps<Order>) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  return (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      <p style={{ margin: 0 }} aria-live="polite">
        {selected.size} selected
      </p>
      <DataTable<Order>
        {...args}
        selectionMode="multiple"
        selectedIds={selected}
        onSelectionChange={setSelected}
      />
    </div>
  );
}

const meta = {
  title: "Components/DataTable",
  component: DataTable<Order>,
  args: {
    "aria-label": "Sales orders",
    columns,
    rows: orders,
    getRowId: (o: Order) => o.id,
    height: 400,
    rowHeight: 40,
    onSortChange: fn(),
  },
  argTypes: {
    // Stories import the built package, whose props Storybook cannot infer, so controls are declared.
    height: { control: { type: "number", min: 160, step: 40 } },
    rowHeight: { control: { type: "number", min: 32, step: 4 } },
    selectionMode: { control: "inline-radio", options: ["none", "multiple"] },
    columns: { control: false },
    rows: { control: false },
    getRowId: { control: false },
  },
} satisfies Meta<typeof DataTable<Order>>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 1,000 orders; only the visible rows are rendered. Click a header to sort. */
export const Default: Story = {};

/** Filters live in the app: a search field for the global filter and a select for the site column. */
export const WithFilters: Story = {
  render: (args) => <FilteredOrders {...args} />,
};

/** Checkbox column: click, Space on a row, or Ctrl+A (Cmd+A) for every row. */
export const Selection: Story = {
  render: (args) => <SelectableOrders {...args} />,
};

export const Empty: Story = {
  args: { rows: [], emptyState: "No orders yet." },
};

/** Keyboard: one tab stop, arrow keys, Ctrl+End to the last of 1,000 rows, Enter to sort. */
export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole("columnheader", { name: "Order" })).toHaveFocus();
    await userEvent.keyboard("{Control>}{End}{/Control}");
    await waitFor(() =>
      expect(document.activeElement?.closest("[role='row']")).toHaveAttribute(
        "aria-rowindex",
        "1001",
      ),
    );
    await userEvent.keyboard(
      "{Control>}{Home}{/Control}{ArrowRight}{ArrowRight}{ArrowRight}{Enter}",
    );
    await expect(canvas.getByRole("columnheader", { name: "Lines" })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
  },
};

// Runs the axe checks against the dark theme too, with a selected row.
export const Dark: Story = {
  globals: { theme: "dark" },
  args: {
    selectionMode: "multiple",
    defaultSelectedIds: new Set(["SO-00002"]),
    defaultSort: { column: "lines", direction: "descending" },
  },
};
