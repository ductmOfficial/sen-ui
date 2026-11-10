import { describe, expect, it } from "vitest";

import {
  compareValues,
  filterRows,
  nextSort,
  normalizeText,
  processRows,
  sortRows,
  type RowModelColumn,
} from "./dataTableModel.js";

interface Order {
  id: string;
  site: string;
  lines: number | null;
  shipped: Date | null;
  express: boolean;
}

const orders: Order[] = [
  { id: "A-10", site: "Fürth", lines: 12, shipped: new Date("2026-11-02"), express: false },
  { id: "A-2", site: "Hamburg", lines: 3, shipped: null, express: true },
  { id: "B-1", site: "Singapore", lines: null, shipped: new Date("2026-10-30"), express: false },
  { id: "B-7", site: "Mexico City", lines: 3, shipped: new Date("2026-11-05"), express: true },
];

const columns: RowModelColumn<Order>[] = [
  { id: "id", sortValue: (o) => o.id, searchValue: (o) => o.id },
  {
    id: "site",
    sortValue: (o) => o.site,
    searchValue: (o) => o.site,
    filter: (o, value) => normalizeText(o.site).startsWith(normalizeText(value)),
  },
  { id: "lines", sortValue: (o) => o.lines, filter: (o, value) => (o.lines ?? 0) >= Number(value) },
  { id: "shipped", sortValue: (o) => o.shipped },
  { id: "express", sortValue: (o) => o.express },
  { id: "notes" },
];

const ids = (rows: readonly Order[]) => rows.map((row) => row.id);

describe("compareValues", () => {
  it("orders strings with numbers inside naturally", () => {
    expect(["A-10", "A-2", "a-1"].sort(compareValues)).toEqual(["a-1", "A-2", "A-10"]);
  });

  it("orders numbers, dates and booleans by value", () => {
    expect([10, 2, 33].sort(compareValues)).toEqual([2, 10, 33]);
    expect(compareValues(new Date("2026-01-01"), new Date("2025-01-01"))).toBeGreaterThan(0);
    expect([true, false].sort(compareValues)).toEqual([false, true]);
  });

  it("compares mixed types as text", () => {
    expect(compareValues("10", 9)).toBeGreaterThan(0);
    expect(compareValues(3, "3")).toBe(0);
  });

  it("puts empty values last", () => {
    expect([null, 1, undefined, 0].sort(compareValues)).toEqual([0, 1, null, undefined]);
  });
});

describe("normalizeText", () => {
  it("ignores case and accents", () => {
    expect(normalizeText("Fürth")).toBe("furth");
    expect(normalizeText("Hà Nội")).toBe("ha noi");
  });
});

describe("sortRows", () => {
  it("returns the rows unchanged without a sort or for an unsortable column", () => {
    expect(sortRows(orders, columns, null)).toBe(orders);
    expect(sortRows(orders, columns, { column: "notes", direction: "ascending" })).toBe(orders);
  });

  it("sorts ascending and descending without mutating the input", () => {
    const copy = [...orders];
    expect(ids(sortRows(orders, columns, { column: "id", direction: "ascending" }))).toEqual([
      "A-2",
      "A-10",
      "B-1",
      "B-7",
    ]);
    expect(ids(sortRows(orders, columns, { column: "site", direction: "descending" }))).toEqual([
      "B-1",
      "B-7",
      "A-2",
      "A-10",
    ]);
    expect(orders).toEqual(copy);
  });

  it("keeps empty values last in both directions", () => {
    expect(ids(sortRows(orders, columns, { column: "lines", direction: "ascending" })).at(-1)).toBe(
      "B-1",
    );
    expect(
      ids(sortRows(orders, columns, { column: "lines", direction: "descending" })).at(-1),
    ).toBe("B-1");
    expect(ids(sortRows(orders, columns, { column: "shipped", direction: "descending" }))).toEqual([
      "B-7",
      "A-10",
      "B-1",
      "A-2",
    ]);
  });

  it("is stable for equal values", () => {
    expect(ids(sortRows(orders, columns, { column: "lines", direction: "ascending" }))).toEqual([
      "A-2",
      "B-7",
      "A-10",
      "B-1",
    ]);
    expect(ids(sortRows(orders, columns, { column: "express", direction: "descending" }))).toEqual([
      "A-2",
      "B-7",
      "A-10",
      "B-1",
    ]);
  });
});

describe("filterRows", () => {
  it("returns the rows unchanged without filters", () => {
    expect(filterRows(orders, columns, {})).toBe(orders);
    expect(filterRows(orders, columns, { globalFilter: "  ", columnFilters: { site: "" } })).toBe(
      orders,
    );
  });

  it("searches every searchable column, ignoring case and accents", () => {
    expect(ids(filterRows(orders, columns, { globalFilter: "furth" }))).toEqual(["A-10"]);
    expect(ids(filterRows(orders, columns, { globalFilter: "b-" }))).toEqual(["B-1", "B-7"]);
    expect(ids(filterRows(orders, columns, { globalFilter: "3" }))).toEqual([]);
  });

  it("applies every column filter that has a value", () => {
    expect(ids(filterRows(orders, columns, { columnFilters: { lines: "3" } }))).toEqual([
      "A-10",
      "A-2",
      "B-7",
    ]);
    expect(ids(filterRows(orders, columns, { columnFilters: { lines: "3", site: "m" } }))).toEqual([
      "B-7",
    ]);
  });

  it("ignores filters for columns without a predicate", () => {
    expect(filterRows(orders, columns, { columnFilters: { notes: "x" } })).toBe(orders);
  });

  it("combines the global filter and column filters", () => {
    expect(
      ids(filterRows(orders, columns, { globalFilter: "a-", columnFilters: { lines: "5" } })),
    ).toEqual(["A-10"]);
  });
});

describe("processRows", () => {
  it("filters, then sorts", () => {
    const rows = processRows(orders, columns, {
      globalFilter: "a",
      sort: { column: "lines", direction: "descending" },
    });
    // "Mexico City" and "B-7" contain no "a".
    expect(ids(rows)).toEqual(["A-10", "A-2", "B-1"]);
  });
});

describe("nextSort", () => {
  it("cycles ascending, descending, unsorted", () => {
    expect(nextSort(null, "site")).toEqual({ column: "site", direction: "ascending" });
    expect(nextSort({ column: "site", direction: "ascending" }, "site")).toEqual({
      column: "site",
      direction: "descending",
    });
    expect(nextSort({ column: "site", direction: "descending" }, "site")).toBeNull();
  });

  it("starts ascending on a different column", () => {
    expect(nextSort({ column: "site", direction: "descending" }, "id")).toEqual({
      column: "id",
      direction: "ascending",
    });
  });
});
