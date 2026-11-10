import type { ReactNode } from "react";
import {
  CheckboxButton,
  CheckboxField,
  type CheckboxFieldProps,
  Text,
} from "react-aria-components";

import styles from "./Checkbox.module.css";
import { cx } from "./cx.js";

export interface CheckboxProps extends Omit<CheckboxFieldProps, "children" | "className"> {
  /** Visible label. Without one, pass `aria-label`. */
  children?: ReactNode;
  /** Hint under the label, announced as part of the checkbox's description. */
  description?: ReactNode;
  /** Class for the wrapper. */
  className?: string;
}

/**
 * A checkbox with a visible label and an optional description, built on React Aria. Supports the
 * indeterminate state (`isIndeterminate`), validation (`isInvalid`), and selection through
 * `isSelected` / `defaultSelected` with `onChange(isSelected)`.
 */
export function Checkbox({ children, description, className, ...props }: CheckboxProps) {
  return (
    <CheckboxField {...props} className={cx(styles.field, className)}>
      <CheckboxButton className={styles.checkbox}>
        {({ isSelected, isIndeterminate }) => (
          <>
            <span className={styles.box} aria-hidden="true">
              <svg viewBox="0 0 18 18" className={styles.mark}>
                {isIndeterminate ? (
                  <rect x="4" y="8" width="10" height="2" rx="1" />
                ) : isSelected ? (
                  <polyline points="3.5 9.5 7.5 13 14.5 5" />
                ) : null}
              </svg>
            </span>
            {children}
          </>
        )}
      </CheckboxButton>
      {description != null && description !== false && (
        <Text slot="description" className={styles.description}>
          {description}
        </Text>
      )}
    </CheckboxField>
  );
}
