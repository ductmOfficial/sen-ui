/** Pure row logic for DataTable: filtering, sorting and the sort cycle. No React here. */

export type SortDirection = "ascending" | "descending";

export interface SortDescriptor {
  /** The `id` of the sorted column. */
  column: string;
  direction: SortDirection;
}

/** A value a column sorts by. `null` and `undefined` always sort last. */
export type SortValue = string | number | bigint | boolean | Date | null | undefined;

/** The parts of a column that the row logic reads. */
export interface RowModelColumn<T> {
  id: string;
  /** Makes the column sortable. */
  sortValue?: (row: T) => SortValue;
  /** Text the global filter searches. Columns without it are not searched. */
  searchValue?: (row: T) => string;
  /** Predicate for this column's filter value. */
  filter?: (row: T, value: string) => boolean;
}

export interface RowModelState {
  sort?: SortDescriptor | null;
  /** Text matched against every column's `searchValue`, ignoring case and accents. */
  globalFilter?: string;
  /** Filter values by column `id`; empty values are ignored. */
  columnFilters?: Readonly<Record<string, string>>;
}

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

/** Lowercase, without accents, for "Fürth" to match "furth". */
export function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function isEmpty(value: SortValue): value is null | undefined {
  return value === null || value === undefined;
}

function rank(value: Exclude<SortValue, null | undefined>): number | bigint | string {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "boolean") return value ? 1 : 0;
  return value;
}

/**
 * Compares two sort values in ascending order: numbers and dates numerically, booleans false
 * first, strings with a locale-aware, number-aware collator. Empty values come last.
 */
export function compareValues(a: SortValue, b: SortValue): number {
  if (isEmpty(a) || isEmpty(b)) {
    if (isEmpty(a) && isEmpty(b)) return 0;
    return isEmpty(a) ? 1 : -1;
  }
  const left = rank(a);
  const right = rank(b);
  if (typeof left === "string" && typeof right === "string") return collator.compare(left, right);
  if (typeof left === "string" || typeof right === "string") {
    return collator.compare(String(left), String(right));
  }
  return left < right ? -1 : left > right ? 1 : 0;
}

/** Keeps the rows that match the global filter and every non-empty column filter. */
export function filterRows<T>(
  rows: readonly T[],
  columns: readonly RowModelColumn<T>[],
  { globalFilter = "", columnFilters = {} }: RowModelState,
): readonly T[] {
  const query = normalizeText(globalFilter.trim());
  const searchable = columns.filter((column) => column.searchValue);
  const active = columns.flatMap((column) => {
    const value = columnFilters[column.id]?.trim();
    return column.filter && value ? [{ filter: column.filter, value }] : [];
  });
  if ((!query || searchable.length === 0) && active.length === 0) return rows;

  return rows.filter((row) => {
    if (query && searchable.length > 0) {
      const matches = searchable.some((column) =>
        normalizeText(column.searchValue?.(row) ?? "").includes(query),
      );
      if (!matches) return false;
    }
    return active.every(({ filter, value }) => filter(row, value));
  });
}

/** Sorts a copy of the rows; equal rows keep their order. Empty values stay last in both directions. */
export function sortRows<T>(
  rows: readonly T[],
  columns: readonly RowModelColumn<T>[],
  sort: SortDescriptor | null | undefined,
): readonly T[] {
  const sortValue = sort
    ? columns.find((column) => column.id === sort.column)?.sortValue
    : undefined;
  if (!sort || !sortValue) return rows;
  const sign = sort.direction === "ascending" ? 1 : -1;
  return rows
    .map((row) => ({ row, value: sortValue(row) }))
    .sort((a, b) => {
      if (isEmpty(a.value) || isEmpty(b.value)) return compareValues(a.value, b.value);
      return sign * compareValues(a.value, b.value);
    })
    .map(({ row }) => row);
}

/** Filters, then sorts. */
export function processRows<T>(
  rows: readonly T[],
  columns: readonly RowModelColumn<T>[],
  state: RowModelState,
): readonly T[] {
  return sortRows(filterRows(rows, columns, state), columns, state.sort);
}

/** The sort after activating a column header: ascending, then descending, then unsorted. */
export function nextSort(
  current: SortDescriptor | null | undefined,
  column: string,
): SortDescriptor | null {
  if (current?.column !== column) return { column, direction: "ascending" };
  return current.direction === "ascending" ? { column, direction: "descending" } : null;
}
