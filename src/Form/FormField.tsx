import type { ReactNode } from 'react';
import styles from './Form.module.css';

export interface FormFieldProps {
  label: ReactNode;
  htmlFor: string;
  description?: ReactNode;
  error?: ReactNode;
  isRequired?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, htmlFor, description, error, isRequired, children, className = '' }: FormFieldProps) {
  return (
    <div className={`${styles.field} ${className}`}>
      <label className={styles.label} htmlFor={htmlFor}>{label}{isRequired && <span className={styles.required} aria-hidden="true"> *</span>}</label>
      {children}
      {description && !error && <div className={styles.description} id={`${htmlFor}-description`}>{description}</div>}
      {error && <div className={styles.error} id={`${htmlFor}-error`} role="alert">{error}</div>}
    </div>
  );
}
