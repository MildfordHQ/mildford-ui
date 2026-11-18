import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Feedback.module.css';

export type AlertTone = 'info' | 'success' | 'warning' | 'error';
export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: AlertTone;
  title?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
}

export function Alert({ tone = 'info', title, children, actions, className = '', ...props }: AlertProps) {
  const urgent = tone === 'error';
  return (
    <div {...props} className={`${styles.alert} ${styles[tone]} ${className}`} role={urgent ? 'alert' : 'status'} aria-live={urgent ? 'assertive' : 'polite'}>
      <span className={styles.alertIcon} aria-hidden="true">{tone === 'success' ? '✓' : tone === 'warning' ? '!' : tone === 'error' ? '×' : 'i'}</span>
      <div className={styles.alertBody}>{title && <strong>{title}</strong>}<div>{children}</div></div>
      {actions && <div className={styles.alertActions}>{actions}</div>}
    </div>
  );
}
