import type { ReactNode } from 'react';
import { Card, type CardProps } from './Card';
import styles from './Card.module.css';

export interface MetricCardProps extends Omit<CardProps, 'children' | 'title'> {
  label: ReactNode;
  value: ReactNode;
  trend?: ReactNode;
  supportingText?: ReactNode;
}

export function MetricCard({ label, value, trend, supportingText, className = '', ...props }: MetricCardProps) {
  return (
    <Card {...props} className={`${styles.metric} ${className}`}>
      <div className={styles.metricLabel}>{label}</div>
      <div className={styles.metricRow}><strong className={styles.metricValue}>{value}</strong>{trend && <span className={styles.trend}>{trend}</span>}</div>
      {supportingText && <div className={styles.supporting}>{supportingText}</div>}
    </Card>
  );
}
