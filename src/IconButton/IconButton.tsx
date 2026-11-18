import { forwardRef, type ReactNode } from 'react';
import { Button as RACButton, type ButtonProps as RACButtonProps } from 'react-aria-components';
import { cx } from '../internal/cx';
import { Kbd } from '../Kbd';
import { Tooltip, type TooltipPlacement } from '../Tooltip';
import styles from './IconButton.module.css';

export type IconButtonVariant = 'standard' | 'filled' | 'tonal' | 'outlined';

export interface IconButtonProps extends Omit<RACButtonProps, 'children' | 'className' | 'style'> {
  /** M3 icon button variant. @default "standard" */
  variant?: IconButtonVariant;
  /** `md` = 40px, `sm` = 32px visual; both have a 44px touch target. @default "md" */
  size?: 'sm' | 'md';
  /** Required: icon-only controls need an accessible name. */
  'aria-label': string;
  /** Usually an `<Icon>`. */
  children: ReactNode;
  /** Wraps the button in a `Tooltip` with this content. */
  tooltip?: ReactNode;
  /** Appended to the tooltip as `<Kbd>`. */
  shortcut?: string | string[];
  /** @default "bottom" */
  tooltipPlacement?: TooltipPlacement;
  className?: string;
}

/** M3 icon button on RAC `Button`. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = 'standard', size = 'md', children, tooltip, shortcut, tooltipPlacement = 'bottom', className, ...props },
  ref,
) {
  const button = (
    <RACButton {...props} ref={ref} className={cx(styles.button, styles[variant], styles[size], className)}>
      {children}
    </RACButton>
  );
  if (!tooltip && !shortcut) return button;
  return (
    <Tooltip trigger={button} placement={tooltipPlacement}>
      {tooltip ?? props['aria-label']}
      {shortcut && <Kbd keys={shortcut} />}
    </Tooltip>
  );
});
