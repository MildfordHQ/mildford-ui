import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Headers.module.css';

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, description, eyebrow, actions, className = '', ...props }: PageHeaderProps) {
  return (
    <header {...props} className={`${styles.page} ${className}`}>
      <div>{eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}<h1>{title}</h1>{description && <p>{description}</p>}</div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
