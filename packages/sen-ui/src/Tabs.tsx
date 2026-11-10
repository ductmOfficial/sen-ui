import {
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
  type TabListProps as AriaTabListProps,
  type TabPanelProps as AriaTabPanelProps,
  type TabProps as AriaTabProps,
  type TabsProps as AriaTabsProps,
} from "react-aria-components";

import { cx } from "./cx.js";
import styles from "./Tabs.module.css";

export interface TabsProps extends Omit<AriaTabsProps, "className"> {
  className?: string;
}

/**
 * Tabs built on React Aria: arrow keys move between tabs (Home and End jump to the ends), the
 * selected tab controls its panel, and only the selected tab is in the tab order. Selection follows
 * focus unless `keyboardActivation="manual"`. Use `selectedKey` / `defaultSelectedKey` with
 * `onSelectionChange`, and `orientation="vertical"` for a side list.
 */
export function Tabs({ className, ...props }: TabsProps) {
  return <AriaTabs {...props} className={cx(styles.tabs, className)} />;
}

export interface TabListProps<T extends object> extends Omit<AriaTabListProps<T>, "className"> {
  className?: string;
}

/** The row (or column) of tabs. Give it an `aria-label` that names the set. */
export function TabList<T extends object>({ className, ...props }: TabListProps<T>) {
  return <AriaTabList {...props} className={cx(styles.list, className)} />;
}

export interface TabProps extends Omit<AriaTabProps, "className"> {
  className?: string;
}

/** One tab. Its `id` matches the `id` of its `TabPanel`. */
export function Tab({ className, ...props }: TabProps) {
  return <AriaTab {...props} className={cx(styles.tab, className)} />;
}

export interface TabPanelProps extends Omit<AriaTabPanelProps, "className"> {
  className?: string;
}

/** The content for the tab with the same `id`. */
export function TabPanel({ className, ...props }: TabPanelProps) {
  return <AriaTabPanel {...props} className={cx(styles.panel, className)} />;
}
