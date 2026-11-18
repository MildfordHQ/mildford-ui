import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../internal/cx';
import styles from './ButtonGroup.module.css';

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Connected: 2px gaps and collapsed inner corners (e.g. undo/redo). */
  connected?: boolean;
  /** @default "horizontal" */
  orientation?: 'horizontal' | 'vertical';
  children: ReactNode;
}

/**
 * Visual grouping of buttons. It adds no keyboard behaviour (each button stays a tab stop unless the
 * group sits in a `Toolbar`). With `aria-label` it is exposed as a `group`.
 */
export function ButtonGroup({ connected = false, orientation = 'horizontal', children, className, ...props }: ButtonGroupProps) {
  const labelled = Boolean(props['aria-label'] || props['aria-labelledby']);
  return (
    <div
      role={labelled ? 'group' : undefined}
      {...props}
      data-orientation={orientation}
      className={cx(styles.group, connected && styles.connected, className)}
    >
      {children}
    </div>
  );
}
