import type { ReactNode } from "react";
import {
  Button as AriaButton,
  FieldError,
  Label,
  ListBox,
  Popover,
  Select as AriaSelect,
  SelectValue,
  Text,
  type SelectProps as AriaSelectProps,
} from "react-aria-components";

import { cx } from "./cx.js";
import fieldStyles from "./Field.module.css";
import listStyles from "./ListBox.module.css";
import { Chevron, ListBoxItem, type ListBoxItemProps } from "./ListBoxItem.js";
import styles from "./Select.module.css";

export interface SelectProps<T extends object> extends Omit<
  AriaSelectProps<T>,
  "children" | "className"
> {
  /** Visible label, required so the select always has an accessible name. */
  label: ReactNode;
  /** Hint under the field, announced as part of its description. */
  description?: ReactNode;
  /** Error message. When set, the field is marked invalid and the message joins its description. */
  error?: ReactNode;
  /** Options as data, rendered by a `children` function. */
  items?: Iterable<T>;
  /** `SelectItem` elements, or a function that renders one per item. */
  children: ReactNode | ((item: T) => ReactNode);
  /** Class for the wrapper. */
  className?: string;
}

/**
 * Picks one option from a list in a popover, built on React Aria. The button opens the list with
 * a click, Enter, Space or the arrow keys; type-ahead jumps to an option; Escape closes. A hidden
 * native select keeps form submission and autofill working (`name`).
 */
export function Select<T extends object>({
  label,
  description,
  error,
  items,
  children,
  className,
  isInvalid,
  ...props
}: SelectProps<T>) {
  const hasError = error != null && error !== false;
  return (
    <AriaSelect
      {...props}
      isInvalid={isInvalid ?? hasError}
      className={cx(fieldStyles.field, className)}
    >
      <Label className={fieldStyles.label}>{label}</Label>
      <AriaButton className={cx(fieldStyles.control, styles.button)}>
        <SelectValue className={styles.value} />
        <Chevron className={fieldStyles.chevron} />
      </AriaButton>
      {description != null && description !== false && (
        <Text slot="description" className={fieldStyles.description}>
          {description}
        </Text>
      )}
      <FieldError className={fieldStyles.error}>{error}</FieldError>
      <Popover className={listStyles.popover} offset={4}>
        <ListBox items={items} className={listStyles.listbox}>
          {children}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}

export type SelectItemProps<T extends object = object> = ListBoxItemProps<T>;

/** One option in a `Select`. */
export const SelectItem = ListBoxItem;
