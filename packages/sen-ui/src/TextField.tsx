import { useId, type ComponentProps, type ReactNode } from "react";

import { cx } from "./cx.js";
import styles from "./TextField.module.css";

export interface TextFieldProps extends ComponentProps<"input"> {
  /** Visible label, required so the input always has an accessible name. */
  label: ReactNode;
  /** Hint shown under the label, announced as part of the input's description. */
  description?: ReactNode;
  /** Error message. When set, the input is marked invalid and the message joins its description. */
  error?: ReactNode;
}

/**
 * A labelled text input with optional description and error message.
 * `className` styles the wrapper; every other prop, including `ref`, goes to the `<input>`.
 */
export function TextField({
  label,
  description,
  error,
  id,
  type = "text",
  className,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;

  const hasDescription = description != null && description !== false;
  const hasError = error != null && error !== false;

  // Description first, then the error, then any ids the caller passed.
  const describedBy =
    [hasDescription && descriptionId, hasError && errorId, ariaDescribedBy]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={cx(styles.field, className)} data-invalid={hasError || undefined}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      {hasDescription && (
        <p id={descriptionId} className={styles.description}>
          {description}
        </p>
      )}
      <input
        type={type}
        className={styles.input}
        {...props}
        // After the spread so the label and messages always stay wired to this input.
        id={inputId}
        aria-describedby={describedBy}
        aria-invalid={hasError || ariaInvalid}
      />
      {hasError && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
