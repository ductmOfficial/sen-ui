import { useVirtualizer, defaultRangeExtractor } from "@tanstack/react-virtual";
import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { Checkbox } from "./Checkbox.js";
import { cx } from "./cx.js";
import styles from "./DataTable.module.css";
import {
  nextSort,
  processRows,
  type RowModelColumn,
  type SortDescriptor,
} from "./dataTableModel.js";

export type { SortDescriptor, SortDirection, SortValue } from "./dataTableModel.js";

export interface DataTableColumn<T> extends RowModelColumn<T> {
  /** Unique column id, used by sorting and `columnFilters`. */
  id: string;
  /** Header text. It also labels the column for assistive technology. */
  header: string;
  /** Renders the cell for a row. */
  cell: (row: T) => ReactNode;
  /** A CSS grid track size. @default "minmax(8rem, 1fr)" */
  width?: string;
  /** Align numbers to the end. @default "start" */
  align?: "start" | "end";
}

export interface DataTableProps<T> {
  /** Names the table. Pass this or `aria-labelledby`. */
  "aria-label"?: string;
  "aria-labelledby"?: string;
  columns: readonly DataTableColumn<T>[];
  rows: readonly T[];
  /** A stable id per row, used for selection and React keys. */
  getRowId: (row: T) => string;
  /** Height of the scrolling body in pixels. @default 400 */
  height?: number;
  /** Height of every row in pixels. @default 40 */
  rowHeight?: number;

  /** Controlled sort. `null` means unsorted. */
  sort?: SortDescriptor | null;
  defaultSort?: SortDescriptor | null;
  onSortChange?: (sort: SortDescriptor | null) => void;
  /** Text searched in every column with a `searchValue`, ignoring case and accents. */
  globalFilter?: string;
  /** Filter values by column id, applied with each column's `filter`. */
  columnFilters?: Readonly<Record<string, string>>;
  /**
   * The app sorts and filters: rows are shown as given, and sort changes are only reported. Use
   * it for data sorted or filtered on a server.
   */
  manual?: boolean;

  /** `"multiple"` adds a checkbox column and row selection. @default "none" */
  selectionMode?: "none" | "multiple";
  /** Controlled selection, as row ids. */
  selectedIds?: ReadonlySet<string>;
  defaultSelectedIds?: ReadonlySet<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
  /** Text that names a row in its checkbox label, e.g. the order number. @default getRowId */
  getRowLabel?: (row: T) => string;

  /** Shown when there are no rows to display. @default "No results" */
  emptyState?: ReactNode;
  className?: string;
}

interface Position {
  row: number;
  col: number;
}

const SORT_ICON: Record<"ascending" | "descending" | "none", string> = {
  ascending: "M4 10l4-4 4 4",
  descending: "M4 6l4 4 4-4",
  none: "M5 6.5l3-3 3 3M5 9.5l3 3 3-3",
};

function useControllableState<V>(
  value: V | undefined,
  defaultValue: V,
  onChange?: (value: V) => void,
) {
  const [inner, setInner] = useState(defaultValue);
  // `null` is a controlled value (for sort, "unsorted"), so `??` would be wrong here.
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const current = value === undefined ? inner : value;
  const set = useCallback(
    (next: V) => {
      if (value === undefined) setInner(next);
      onChange?.(next);
    },
    [value, onChange],
  );
  return [current, set] as const;
}

/**
 * A virtualized data grid that follows the ARIA grid pattern: one tab stop, arrow keys move
 * between cells, Home and End go to the ends of a row, Ctrl+Home and Ctrl+End to the first and
 * last cell, and PageUp and PageDown move by a screen. Only the visible rows are rendered, while
 * `aria-rowcount` and `aria-rowindex` tell assistive technology the full size and each row's place.
 *
 * Enter or Space on a sortable header sorts by it. With `selectionMode="multiple"`, Space
 * selects the focused row and Ctrl+A (Cmd+A) selects every row.
 */
export function DataTable<T>({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  columns,
  rows,
  getRowId,
  height = 400,
  rowHeight = 40,
  sort: sortProp,
  defaultSort = null,
  onSortChange,
  globalFilter,
  columnFilters,
  manual = false,
  selectionMode = "none",
  selectedIds: selectedProp,
  defaultSelectedIds,
  onSelectionChange,
  getRowLabel = getRowId,
  emptyState = "No results",
  className,
}: DataTableProps<T>) {
  const [sort, setSort] = useControllableState(sortProp, defaultSort, onSortChange);
  const [selected, setSelected] = useControllableState<ReadonlySet<string>>(
    selectedProp,
    defaultSelectedIds ?? new Set<string>(),
    onSelectionChange as ((ids: ReadonlySet<string>) => void) | undefined,
  );

  const visibleRows = useMemo(
    () => (manual ? rows : processRows(rows, columns, { sort, globalFilter, columnFilters })),
    [manual, rows, columns, sort, globalFilter, columnFilters],
  );

  const selectable = selectionMode === "multiple";
  const offset = selectable ? 1 : 0;
  const colCount = columns.length + offset;
  const rowCount = visibleRows.length;
  const visibleIds = useMemo(() => visibleRows.map(getRowId), [visibleRows, getRowId]);
  const selectedVisible = visibleIds.filter((id) => selected.has(id)).length;
  const allSelected = rowCount > 0 && selectedVisible === rowCount;

  const gridRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Position>({ row: 0, col: 0 });
  const focusRequestRef = useRef(false);

  // Keep the active position inside the grid when rows are filtered away.
  const activeRow = Math.min(active.row, rowCount);
  const activeCol = Math.min(active.col, colCount - 1);

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan: 6,
    initialRect: { width: 0, height },
    // Keep the focused row mounted while it scrolls out of view, so focus is never lost.
    rangeExtractor: (range) => {
      const indexes = defaultRangeExtractor(range);
      const focused = activeRow - 1;
      return focused >= 0 && !indexes.includes(focused)
        ? [...indexes, focused].sort((a, b) => a - b)
        : indexes;
    },
  });

  useLayoutEffect(() => {
    if (!focusRequestRef.current) return;
    const cell = gridRef.current?.querySelector<HTMLElement>(
      `[data-cell="${String(activeRow)}:${String(activeCol)}"]`,
    );
    if (cell) {
      cell.focus({ preventScroll: activeRow > 0 });
      focusRequestRef.current = false;
    }
  });

  const moveTo = (row: number, col: number) => {
    const nextRow = Math.max(0, Math.min(row, rowCount));
    const nextCol = Math.max(0, Math.min(col, colCount - 1));
    setActive({ row: nextRow, col: nextCol });
    focusRequestRef.current = true;
    if (nextRow > 0) virtualizer.scrollToIndex(nextRow - 1, { align: "auto" });
  };

  const toggleRow = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    const next = new Set(selected);
    if (allSelected) for (const id of visibleIds) next.delete(id);
    else for (const id of visibleIds) next.add(id);
    setSelected(next);
  };

  const sortBy = (column: DataTableColumn<T>) => {
    if (column.sortValue) setSort(nextSort(sort, column.id));
  };

  const pageSize = Math.max(1, Math.floor(height / rowHeight) - 1);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const ctrl = event.ctrlKey || event.metaKey;
    const fromWidget = event.target instanceof HTMLInputElement;
    const moves: Record<string, () => void> = {
      ArrowRight: () => {
        moveTo(activeRow, activeCol + 1);
      },
      ArrowLeft: () => {
        moveTo(activeRow, activeCol - 1);
      },
      ArrowDown: () => {
        moveTo(activeRow + 1, activeCol);
      },
      ArrowUp: () => {
        moveTo(activeRow - 1, activeCol);
      },
      Home: () => {
        moveTo(ctrl ? 0 : activeRow, 0);
      },
      End: () => {
        moveTo(ctrl ? rowCount : activeRow, colCount - 1);
      },
      PageDown: () => {
        moveTo(activeRow + pageSize, activeCol);
      },
      PageUp: () => {
        moveTo(activeRow - pageSize, activeCol);
      },
    };
    const move = moves[event.key];
    if (move) {
      event.preventDefault();
      move();
      return;
    }
    if (selectable && ctrl && event.key.toLowerCase() === "a") {
      event.preventDefault();
      if (!allSelected) toggleAll();
      return;
    }
    // A checkbox handles Space itself; the grid only handles keys on its cells.
    if (fromWidget || (event.key !== " " && event.key !== "Enter")) return;
    const column = columns[activeCol - offset];
    if (activeRow === 0) {
      event.preventDefault();
      if (column) sortBy(column);
      else if (selectable) toggleAll();
    } else if (selectable && event.key === " ") {
      event.preventDefault();
      const id = visibleIds[activeRow - 1];
      if (id !== undefined) toggleRow(id);
    }
  };

  const cellProps = (row: number, col: number) => ({
    "data-cell": `${String(row)}:${String(col)}`,
    "aria-colindex": col + 1,
    tabIndex: row === activeRow && col === activeCol ? 0 : -1,
    onFocus: () => {
      if (row !== activeRow || col !== activeCol) setActive({ row, col });
    },
  });

  const template = [
    selectable ? "3rem" : null,
    ...columns.map((c) => c.width ?? "minmax(8rem, 1fr)"),
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={gridRef}
      role="grid"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-rowcount={rowCount + 1}
      aria-colcount={colCount}
      aria-multiselectable={selectable || undefined}
      className={cx(styles.grid, className)}
      style={{ "--_columns": template } as CSSProperties}
      onKeyDown={onKeyDown}
    >
      <div role="rowgroup" className={styles.head}>
        <div role="row" aria-rowindex={1} className={styles.row} style={{ blockSize: rowHeight }}>
          {selectable && (
            <div
              role="columnheader"
              className={cx(styles.cell, styles.selectCell)}
              {...cellProps(0, 0)}
            >
              <Checkbox
                aria-label="Select all rows"
                isSelected={allSelected}
                isIndeterminate={selectedVisible > 0 && !allSelected}
                isDisabled={rowCount === 0}
                excludeFromTabOrder
                onChange={toggleAll}
              />
            </div>
          )}
          {columns.map((column, index) => {
            const direction = sort?.column === column.id ? sort.direction : undefined;
            return (
              <div
                key={column.id}
                role="columnheader"
                aria-sort={column.sortValue ? (direction ?? "none") : undefined}
                className={cx(styles.cell, styles.header, column.sortValue && styles.sortable)}
                data-align={column.align}
                onClick={() => {
                  sortBy(column);
                }}
                {...cellProps(0, index + offset)}
              >
                <span>{column.header}</span>
                {column.sortValue && (
                  <svg
                    viewBox="0 0 16 16"
                    className={styles.sortIcon}
                    data-active={direction ? "" : undefined}
                    aria-hidden="true"
                  >
                    <path d={SORT_ICON[direction ?? "none"]} />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div
        ref={scrollRef}
        role="rowgroup"
        className={styles.body}
        style={{ height: `${String(height)}px` }}
      >
        {rowCount === 0 ? (
          <div role="row" aria-rowindex={2} className={styles.emptyRow}>
            <div role="gridcell" aria-colindex={1} aria-colspan={colCount} className={styles.empty}>
              {emptyState}
            </div>
          </div>
        ) : (
          <div className={styles.sizer} style={{ blockSize: virtualizer.getTotalSize() }}>
            {virtualizer.getVirtualItems().map((item) => {
              const row = visibleRows[item.index];
              if (row === undefined) return null;
              const id = getRowId(row);
              const isSelected = selected.has(id);
              const rowIndex = item.index + 1;
              return (
                <div
                  key={id}
                  role="row"
                  aria-rowindex={rowIndex + 1}
                  aria-selected={selectable ? isSelected : undefined}
                  className={styles.row}
                  data-selected={isSelected || undefined}
                  style={{ blockSize: rowHeight, transform: `translateY(${String(item.start)}px)` }}
                >
                  {selectable && (
                    <div
                      role="gridcell"
                      className={cx(styles.cell, styles.selectCell)}
                      {...cellProps(rowIndex, 0)}
                    >
                      <Checkbox
                        aria-label={`Select ${getRowLabel(row)}`}
                        isSelected={isSelected}
                        excludeFromTabOrder
                        onChange={() => {
                          toggleRow(id);
                        }}
                      />
                    </div>
                  )}
                  {columns.map((column, index) => (
                    <div
                      key={column.id}
                      role="gridcell"
                      className={styles.cell}
                      data-align={column.align}
                      {...cellProps(rowIndex, index + offset)}
                    >
                      {column.cell(row)}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
