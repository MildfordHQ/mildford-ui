import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: 'none' | 'compact' | 'default' | 'spacious';
  /** Adds a soft elevation shadow while preserving the card's white surface. */
  elevated?: boolean;
}

export function Card({ children, padding = 'default', elevated = false, className = '', ...props }: CardProps) {
  const classNames = [styles.card, styles[padding], elevated && styles.withShade, className]
    .filter(Boolean)
    .join(' ');

  return <div {...props} className={classNames}>{children}</div>;
}
