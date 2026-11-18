import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Status.module.css';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'error' | 'accent';
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  children: ReactNode;
}

export function Badge({ tone = 'neutral', className = '', children, ...props }: BadgeProps) {
  return <span {...props} className={`${styles.badge} ${styles[tone]} ${className}`}>{children}</span>;
}
