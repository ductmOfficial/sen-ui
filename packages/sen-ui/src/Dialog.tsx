import type { ReactElement, ReactNode } from "react";
import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  type DialogProps as AriaDialogProps,
  type DialogRenderProps,
  type DialogTriggerProps as AriaDialogTriggerProps,
  Heading,
  Modal,
  ModalOverlay,
  Pressable,
} from "react-aria-components";

import { cx } from "./cx.js";
import styles from "./Dialog.module.css";

export interface DialogTriggerProps extends Omit<AriaDialogTriggerProps, "children"> {
  /**
   * Two children: the trigger first (one element that accepts `ref` and DOM props, such as
   * `Button`), then the `Dialog` it opens.
   */
  children: [ReactElement, ReactElement];
}

/**
 * Opens a `Dialog` when its trigger is pressed and returns focus to the trigger when the dialog
 * closes. Use `isOpen` / `defaultOpen` with `onOpenChange` to control it.
 */
export function DialogTrigger({ children, ...props }: DialogTriggerProps) {
  const [trigger, dialog] = children;
  return (
    <AriaDialogTrigger {...props}>
      {/* Pressable wires press handling, aria-expanded and aria-haspopup onto the trigger. Its type
          only accepts host elements, but any component that forwards ref and DOM props works. */}
      <Pressable>{trigger as ReactElement<React.DOMAttributes<Element>, string>}</Pressable>
      {dialog}
    </AriaDialogTrigger>
  );
}

export interface DialogProps extends Omit<AriaDialogProps, "children" | "className" | "style"> {
  /** Visible heading; it also names the dialog. */
  title: ReactNode;
  /** Content, or a function that receives `{ close }` for buttons that close the dialog. */
  children: ReactNode | ((renderProps: DialogRenderProps) => ReactNode);
  /** Close when the user clicks outside the dialog. @default true */
  isDismissable?: boolean;
  /** Keep the dialog open on Escape, for flows that must be completed or cancelled explicitly. */
  isKeyboardDismissDisabled?: boolean;
  /** Controlled open state, when the dialog is used without a `DialogTrigger`. */
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /** Class for the dialog panel. */
  className?: string;
}

/**
 * A modal dialog built on React Aria. It traps focus while open, moves focus inside when it opens,
 * returns it when it closes, closes on Escape, hides the rest of the page from assistive
 * technology, and blocks page scrolling. Pass `role="alertdialog"` for a confirmation that needs
 * an answer.
 */
export function Dialog({
  title,
  children,
  isDismissable = true,
  isKeyboardDismissDisabled,
  isOpen,
  defaultOpen,
  onOpenChange,
  className,
  ...props
}: DialogProps) {
  return (
    <ModalOverlay
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      isOpen={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      className={styles.overlay}
    >
      <Modal className={styles.modal}>
        <AriaDialog {...props} className={cx(styles.dialog, className)}>
          {(renderProps) => (
            <>
              <Heading slot="title" className={styles.title}>
                {title}
              </Heading>
              {typeof children === "function" ? children(renderProps) : children}
            </>
          )}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );
}

export interface DialogActionsProps {
  children: ReactNode;
  className?: string;
}

/** Lays out a dialog's buttons at the end of the dialog, primary action last. */
export function DialogActions({ children, className }: DialogActionsProps) {
  return <div className={cx(styles.actions, className)}>{children}</div>;
}
