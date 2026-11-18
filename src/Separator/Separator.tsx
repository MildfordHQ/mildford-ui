import type { HTMLAttributes } from 'react';
import { Separator as RACSeparator } from 'react-aria-components';
import { cx } from '../internal/cx';
import styles from './Separator.module.css';

export interface SeparatorProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** @default "horizontal", or perpendicular to the enclosing `Toolbar` */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * A 1px `outline-variant` divider. Inside a `Toolbar` it takes the perpendicular orientation
 * automatically; vertical separators are 24px tall with 8px margins.
 */
export function Separator({ orientation, className, ...props }: SeparatorProps) {
  return <RACSeparator {...props} orientation={orientation} className={cx(styles.separator, className)} />;
}
