import type { ReactElement, ReactNode } from "react";
import {
  Focusable,
  Tooltip as AriaTooltip,
  TooltipTrigger,
  type TooltipProps as AriaTooltipProps,
} from "react-aria-components";

import styles from "./Tooltip.module.css";

export interface TooltipProps {
  /** Text shown in the tooltip and announced as the trigger's description. Keep it short and non-interactive. */
  content: ReactNode;
  /**
   * The trigger: one focusable element that accepts `ref` and DOM props, such as `Button`.
   * An icon-only trigger still needs its own `aria-label`; the tooltip only describes it.
   */
  children: ReactElement;
  /** Where the tooltip appears relative to the trigger. @default "top" */
  placement?: AriaTooltipProps["placement"];
  /** Delay in milliseconds before the tooltip opens on hover. Keyboard focus opens it at once. @default 700 */
  delay?: number;
  /** Delay in milliseconds before the tooltip closes after the pointer leaves. @default 300 */
  closeDelay?: number;
  /** Open on hover and focus (default) or on focus only. */
  trigger?: "hover" | "focus";
  /** Turns the tooltip off without changing the trigger. */
  isDisabled?: boolean;
}

/**
 * Shows a short description when its trigger is hovered or focused, built on React Aria. It closes
 * on Escape, on press, and when focus or the pointer leaves, and never takes focus itself.
 */
export function Tooltip({
  content,
  children,
  placement = "top",
  delay = 700,
  closeDelay = 300,
  trigger,
  isDisabled,
}: TooltipProps) {
  return (
    <TooltipTrigger delay={delay} closeDelay={closeDelay} trigger={trigger} isDisabled={isDisabled}>
      {/* Focusable wires focus, hover and aria-describedby onto the trigger element. Its type only
          accepts host elements, but any component that forwards ref and DOM props works. */}
      <Focusable>{children as ReactElement<React.DOMAttributes<Element>, string>}</Focusable>
      <AriaTooltip placement={placement} offset={6} className={styles.tooltip}>
        {content}
      </AriaTooltip>
    </TooltipTrigger>
  );
}
