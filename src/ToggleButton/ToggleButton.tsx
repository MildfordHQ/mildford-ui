import { forwardRef, type ReactNode } from 'react';
import {
  ToggleButton as RACToggleButton,
  ToggleButtonGroup as RACToggleButtonGroup,
  type ToggleButtonGroupProps as RACToggleButtonGroupProps,
  type ToggleButtonProps as RACToggleButtonProps,
} from 'react-aria-components';
import { cx } from '../internal/cx';
import { Kbd } from '../Kbd';
import { Tooltip, type TooltipPlacement } from '../Tooltip';
import type { IconButtonVariant } from '../IconButton/IconButton';
import base from '../IconButton/IconButton.module.css';
import styles from './ToggleButton.module.css';

export interface ToggleButtonProps extends Omit<RACToggleButtonProps, 'children' | 'className' | 'style'> {
  /** @default "standard" */
  variant?: IconButtonVariant;
  /** @default "md" */
  size?: 'sm' | 'md';
  /** Morph from pill to rounded square when selected. @default true */
  morph?: boolean;
  /** An `<Icon>` (then pass `aria-label`) or a short text label. */
  children: ReactNode;
  tooltip?: ReactNode;
  shortcut?: string | string[];
  /** @default "bottom" */
  tooltipPlacement?: TooltipPlacement;
  className?: string;
}

/** M3 toggle icon button / segment on RAC `ToggleButton` (`aria-pressed`, or a radio inside a single-select group). */
export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(function ToggleButton(
  { variant = 'standard', size = 'md', morph = true, children, tooltip, shortcut, tooltipPlacement = 'bottom', className, ...props },
  ref,
) {
  const hasText = typeof children === 'string' || typeof children === 'number';
  const button = (
    <RACToggleButton
      {...props}
      ref={ref}
      className={cx(base.button, base[variant], styles[variant], base[size], hasText && base.withText, morph && styles.morph, className)}
    >
      {children}
    </RACToggleButton>
  );
  if (!tooltip && !shortcut) return button;
  return (
    <Tooltip trigger={button} placement={tooltipPlacement}>
      {tooltip ?? props['aria-label']}
      {shortcut && <Kbd keys={shortcut} />}
    </Tooltip>
  );
});

export interface ToggleButtonGroupProps extends Omit<RACToggleButtonGroupProps, 'className' | 'style' | 'children'> {
  /** Connected segments: 2px gaps and collapsed inner corners (M3 connected button group). */
  connected?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Groups toggle buttons with arrow-key navigation. `selectionMode="single"` makes it a radio group
 * (exactly one pressed when `disallowEmptySelection`).
 */
export function ToggleButtonGroup({ connected = false, children, className, ...props }: ToggleButtonGroupProps) {
  return (
    <RACToggleButtonGroup {...props} className={cx(styles.group, connected && styles.connected, className)}>
      {children}
    </RACToggleButtonGroup>
  );
}
