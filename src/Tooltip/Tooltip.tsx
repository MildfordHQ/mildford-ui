import type { ReactElement, ReactNode } from 'react';
import { Tooltip as RACTooltip, TooltipTrigger, type TooltipProps as RACTooltipProps } from 'react-aria-components';
import { cx } from '../internal/cx';
import styles from './Tooltip.module.css';

export type TooltipPlacement = NonNullable<RACTooltipProps['placement']>;

export interface TooltipProps {
  /**
   * The focusable element the tooltip describes: a Mildford `Button`, `IconButton`, `ToggleButton`
   * or another React Aria pressable. It must still carry its own `aria-label`.
   */
  trigger: ReactElement;
  /** Tooltip content: a label, optionally followed by a `<Kbd>`. */
  children: ReactNode;
  /** @default "top" */
  placement?: TooltipPlacement;
  /** Hover delay in ms. A tooltip opened within the cooldown of another opens at once. @default 500 */
  delay?: number;
  /** @default 8 */
  offset?: number;
  isDisabled?: boolean;
  className?: string;
}

/**
 * M3 plain tooltip on RAC `TooltipTrigger`: shows on hover and keyboard focus, hides on
 * Escape, never on touch.
 */
export function Tooltip({ trigger, children, placement = 'top', delay = 500, offset = 8, isDisabled, className }: TooltipProps) {
  return (
    <TooltipTrigger delay={delay} isDisabled={isDisabled}>
      {trigger}
      <RACTooltip placement={placement} offset={offset} className={cx(styles.tooltip, className)}>
        {children}
      </RACTooltip>
    </TooltipTrigger>
  );
}
