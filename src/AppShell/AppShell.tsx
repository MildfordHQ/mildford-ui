import type { HTMLAttributes, ReactNode } from 'react';
import styles from './AppShell.module.css';

export interface AppShellNavigationItem {
  label: ReactNode;
  href: string;
  isCurrent?: boolean;
  icon?: ReactNode;
}
export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  brand: ReactNode;
  navigationLabel?: string;
  navigationItems: readonly AppShellNavigationItem[];
  utility?: ReactNode;
  children: ReactNode;
}

export function AppShell({ brand, navigationLabel = 'Primary navigation', navigationItems, utility, children, className = '', ...props }: AppShellProps) {
  return (
    <div {...props} className={`${styles.shell} ${className}`}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>{brand}</div>
        <nav className={styles.navigation} aria-label={navigationLabel}>
          {navigationItems.map((item) => <a key={item.href} href={item.href} className={`${styles.navItem} ${item.isCurrent ? styles.current : ''}`} aria-current={item.isCurrent ? 'page' : undefined}>{item.icon && <span aria-hidden="true">{item.icon}</span>}<span>{item.label}</span></a>)}
        </nav>
        {utility && <div className={styles.utility}>{utility}</div>}
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
