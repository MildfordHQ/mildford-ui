import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Status.module.css';

export type StatusIndicatorState = 'neutral' | 'online' | 'busy' | 'offline';
export interface StatusIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  state?: StatusIndicatorState;
  children: ReactNode;
  /** Adds polite live announcements when the state changes. */
  announce?: boolean;
}

export function StatusIndicator({ state = 'neutral', announce = false, className = '', children, ...props }: StatusIndicatorProps) {
  return (
    <span {...props} className={`${styles.indicator} ${styles[state]} ${className}`} aria-live={announce ? 'polite' : undefined}>
      <span className={styles.dot} aria-hidden="true" />{children}
    </span>
  );
}
