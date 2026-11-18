import type { HTMLAttributes, ReactNode } from 'react';
import styles from './SegmentedNavigation.module.css';

export interface SegmentedNavigationItem { label: ReactNode; href: string; isCurrent?: boolean; }
export interface SegmentedNavigationProps extends HTMLAttributes<HTMLElement> {
  items: readonly SegmentedNavigationItem[];
  label?: string;
}

export function SegmentedNavigation({ items, label = 'Section navigation', className = '', ...props }: SegmentedNavigationProps) {
  return (
    <nav {...props} className={`${styles.nav} ${className}`} aria-label={label}>
      {items.map((item) => <a key={item.href} href={item.href} className={`${styles.link} ${item.isCurrent ? styles.current : ''}`} aria-current={item.isCurrent ? 'page' : undefined}>{item.label}</a>)}
    </nav>
  );
}
