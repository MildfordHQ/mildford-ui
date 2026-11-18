import type { ReactNode, TableHTMLAttributes } from 'react';
import styles from './Table.module.css';

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  children: ReactNode;
  /** An accessible table name when no visible caption is provided. */
  'aria-label'?: string;
}

export function Table({ children, className = '', 'aria-label': ariaLabel, ...props }: TableProps) {
  const regionLabel = ariaLabel ? `${ariaLabel} table, scrollable` : 'Scrollable table';

  return (
    <div className={styles.overflow} tabIndex={0} role="region" aria-label={regionLabel}>
      <table {...props} className={`${styles.table} ${className}`}>{children}</table>
    </div>
  );
}
