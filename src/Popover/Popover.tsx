import type { ReactElement, ReactNode, RefObject } from 'react';
import {
  Dialog,
  DialogTrigger,
  OverlayArrow,
  Popover as RACPopover,
  type PopoverProps as RACPopoverProps,
} from 'react-aria-components';
import { cx } from '../internal/cx';
import styles from './Popover.module.css';

export type PopoverPlacement = NonNullable<RACPopoverProps['placement']>;

export interface PopoverProps {
  /** The pressable that opens the popover. Omit it and pass `triggerRef` + `isOpen` to anchor elsewhere. */
  trigger?: ReactElement;
  /** Anchor element when it is not the trigger (e.g. a selection box). */
  triggerRef?: RefObject<Element | null>;
  /** Popover content. A function receives `close`. */
  children: ReactNode | ((close: () => void) => ReactNode);
  /** @default "bottom" */
  placement?: PopoverPlacement;
  /** Gap between anchor and popover in px. @default 8 */
  offset?: number;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /** Labels the popover's dialog when it has no visible heading. */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  showArrow?: boolean;
  className?: string;
}

/**
 * An anchored surface (M3 `surface-container`, `corner.medium`, elevation 2) on RAC `Popover` +
 * `Dialog`: focus moves in on open and returns on close; Escape and outside press close it.
 */
export function Popover({
  trigger,
  triggerRef,
  children,
  placement = 'bottom',
  offset = 8,
  isOpen,
  defaultOpen,
  onOpenChange,
  showArrow = false,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
}: PopoverProps) {
  const surface = (
    <RACPopover
      placement={placement}
      offset={offset}
      className={cx(styles.popover, className)}
      {...(triggerRef ? { triggerRef, isOpen, onOpenChange } : {})}
    >
      {showArrow && (
        <OverlayArrow className={styles.arrow}>
          <svg width={12} height={12} viewBox="0 0 12 12" aria-hidden="true"><path d="M0 0 L6 6 L12 0" /></svg>
        </OverlayArrow>
      )}
      <Dialog className={styles.dialog} aria-label={ariaLabel} aria-labelledby={ariaLabelledby}>
        {({ close }) => {
          // Anchored without a DialogTrigger there is no shared overlay state; close through the owner.
          const dismiss = triggerRef ? () => onOpenChange?.(false) : close;
          return typeof children === 'function' ? children(dismiss) : children;
        }}
      </Dialog>
    </RACPopover>
  );

  if (!trigger) return surface;
  return (
    <DialogTrigger isOpen={isOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger}
      {surface}
    </DialogTrigger>
  );
}
