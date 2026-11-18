import type { HTMLAttributes } from 'react';
import styles from './Feedback.module.css';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  label?: string;
  size?: 'small' | 'medium' | 'large';
}

export function Spinner({ label = 'Loading', size = 'medium', className = '', ...props }: SpinnerProps) {
  return (
    <span {...props} className={`${styles.spinnerWrap} ${className}`} role="status">
      <span className={`${styles.spinner} ${styles[size]}`} aria-hidden="true" />
      <span className={styles.visuallyHidden}>{label}</span>
    </span>
  );
}
