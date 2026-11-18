import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Feedback.module.css';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
}

export function EmptyState({ title, description, icon, actions, className = '', ...props }: EmptyStateProps) {
  return (
    <div {...props} className={`${styles.empty} ${className}`}>
      {icon && <div className={styles.emptyIcon} aria-hidden="true">{icon}</div>}
      <h3>{title}</h3>{description && <p>{description}</p>}
      {actions && <div className={styles.emptyActions}>{actions}</div>}
    </div>
  );
}
