import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Headers.module.css';

export interface SectionHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  headingLevel?: 2 | 3 | 4;
}

export function SectionHeader({ title, description, actions, headingLevel = 2, className = '', ...props }: SectionHeaderProps) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4';
  return (
    <header {...props} className={`${styles.section} ${className}`}>
      <div><Heading>{title}</Heading>{description && <p>{description}</p>}</div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
