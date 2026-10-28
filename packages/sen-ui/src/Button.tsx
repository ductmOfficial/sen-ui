import type { ComponentProps } from "react";

import styles from "./Button.module.css";
import { cx } from "./cx.js";

export type ButtonVariant = "primary" | "secondary";

export interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary", type = "button", className, ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(styles.button, className)}
      {...props}
      // After the spread so the styling hook always matches `variant`.
      data-variant={variant}
    />
  );
}
