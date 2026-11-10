---
"@ductmofficial/sen-ui": minor
---

Add `DataTable`, a virtualized data grid that follows the ARIA grid pattern. Only the visible rows are rendered (TanStack Virtual), while `aria-rowcount` and `aria-rowindex` describe the full table. It has one tab stop; arrow keys, Home, End, Ctrl+Home, Ctrl+End, PageUp and PageDown move between cells, and Enter or Space on a header sorts by that column (ascending, descending, unsorted). Columns define `cell`, and optionally `sortValue`, `searchValue` for the `globalFilter` (case- and accent-insensitive), `filter` for `columnFilters`, `width` and `align`. Sorting is controlled or uncontrolled; with `manual`, the app sorts and filters (for server data) and the table only reports changes. `selectionMode="multiple"` adds a checkbox column with select-all, Space to select the focused row, and Ctrl+A (Cmd+A). `@tanstack/react-virtual` is now a dependency.
