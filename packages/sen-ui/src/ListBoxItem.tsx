import type { ReactNode } from "react";
import {
  ListBoxItem as AriaListBoxItem,
  type ListBoxItemProps as AriaListBoxItemProps,
} from "react-aria-components";

import { cx } from "./cx.js";
import styles from "./ListBox.module.css";

export interface ListBoxItemProps<T extends object = object> extends Omit<
  AriaListBoxItemProps<T>,
  "children" | "className"
> {
  children: ReactNode;
  className?: string;
}

/** One option in a `Select` or `ComboBox`. Pass `textValue` when the content is not plain text. */
export function ListBoxItem<T extends object = object>({
  children,
  className,
  textValue,
  ...props
}: ListBoxItemProps<T>) {
  return (
    <AriaListBoxItem
      {...props}
      textValue={textValue ?? (typeof children === "string" ? children : undefined)}
      className={cx(styles.item, className)}
    >
      {({ isSelected }) => (
        <>
          <span>{children}</span>
          {isSelected && (
            <svg viewBox="0 0 16 16" className={styles.check} aria-hidden="true">
              <polyline points="3 8.5 6.5 12 13 4.5" />
            </svg>
          )}
        </>
      )}
    </AriaListBoxItem>
  );
}

/** The chevron shown in Select and ComboBox buttons. */
export function Chevron({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <polyline points="4 6 8 10 12 6" />
    </svg>
  );
}
