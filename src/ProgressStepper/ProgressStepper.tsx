import type { HTMLAttributes, ReactNode } from 'react';
import styles from './ProgressStepper.module.css';

export type ProgressStepStatus = 'complete' | 'current' | 'upcoming' | 'error';
export interface ProgressStep {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  status: ProgressStepStatus;
  /** Visible status copy; defaults to the normalized visual status. */
  statusLabel?: ReactNode;
}
export interface ProgressStepperProps extends HTMLAttributes<HTMLOListElement> {
  steps: readonly ProgressStep[];
  label?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function ProgressStepper({ steps, label = 'Progress', orientation = 'horizontal', className = '', ...props }: ProgressStepperProps) {
  return (
    <ol {...props} className={`${styles.stepper} ${styles[orientation]} ${className}`} aria-label={label}>
      {steps.map((step, index) => (
        <li key={step.id} className={`${styles.step} ${styles[step.status]}`} aria-current={step.status === 'current' ? 'step' : undefined}>
          <span className={styles.marker} aria-hidden="true">{step.status === 'complete' ? '✓' : step.status === 'error' ? '!' : index + 1}</span>
          <span className={styles.copy}><span className={styles.label}>{step.label}</span>{step.description && <span className={styles.description}>{step.description}</span>}<span className={styles.state}>{step.statusLabel ?? step.status}</span></span>
        </li>
      ))}
    </ol>
  );
}
