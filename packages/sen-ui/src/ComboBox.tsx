import type { ReactNode } from "react";
import {
  Button as AriaButton,
  ComboBox as AriaComboBox,
  FieldError,
  Group,
  Input,
  Label,
  ListBox,
  Popover,
  Text,
  type ComboBoxProps as AriaComboBoxProps,
} from "react-aria-components";

import styles from "./ComboBox.module.css";
import { cx } from "./cx.js";
import fieldStyles from "./Field.module.css";
import listStyles from "./ListBox.module.css";
import { Chevron, ListBoxItem, type ListBoxItemProps } from "./ListBoxItem.js";

export interface ComboBoxProps<T extends object> extends Omit<
  AriaComboBoxProps<T>,
  "children" | "className"
> {
  /** Visible label, required so the combo box always has an accessible name. */
  label: ReactNode;
  /** Hint under the field, announced as part of its description. */
  description?: ReactNode;
  /** Error message. When set, the field is marked invalid and the message joins its description. */
  error?: ReactNode;
  /** Placeholder text in the input. */
  placeholder?: string;
  /** Shown in the list when no option matches what was typed. @default "No results" */
  emptyText?: ReactNode;
  /** `ComboBoxItem` elements, or a function that renders one per item. */
  children: ReactNode | ((item: T) => ReactNode);
  /** Class for the wrapper. */
  className?: string;
}

/**
 * A text input that filters a list of options as the user types, built on React Aria. The list
 * opens on typing, ArrowDown or the button; arrow keys move through matches, Enter selects and
 * Escape closes (a second Escape clears the input). Use `items` with `inputValue` /
 * `onInputChange` to load options from a server.
 */
export function ComboBox<T extends object>({
  label,
  description,
  error,
  placeholder,
  emptyText = "No results",
  children,
  className,
  isInvalid,
  ...props
}: ComboBoxProps<T>) {
  const hasError = error != null && error !== false;
  return (
    <AriaComboBox
      {...props}
      isInvalid={isInvalid ?? hasError}
      className={cx(fieldStyles.field, className)}
    >
      <Label className={fieldStyles.label}>{label}</Label>
      <Group className={cx(fieldStyles.control, styles.group)}>
        <Input placeholder={placeholder} className={styles.input} />
        <AriaButton className={styles.button}>
          <Chevron className={fieldStyles.chevron} />
        </AriaButton>
      </Group>
      {description != null && description !== false && (
        <Text slot="description" className={fieldStyles.description}>
          {description}
        </Text>
      )}
      <FieldError className={fieldStyles.error}>{error}</FieldError>
      <Popover className={listStyles.popover} offset={4}>
        <ListBox
          className={listStyles.listbox}
          renderEmptyState={() => <div className={listStyles.empty}>{emptyText}</div>}
        >
          {children}
        </ListBox>
      </Popover>
    </AriaComboBox>
  );
}

export type ComboBoxItemProps<T extends object = object> = ListBoxItemProps<T>;

/** One option in a `ComboBox`. */
export const ComboBoxItem = ListBoxItem;
