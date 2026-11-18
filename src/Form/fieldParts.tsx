import type { ReactNode } from 'react';
import { Label, Text } from 'react-aria-components';
import styles from './Form.module.css';

/** Native `value`/`defaultValue` (string | number | readonly string[]) as the string RAC expects. */
export function toFieldValue(value: string | number | readonly string[] | undefined): string | undefined {
  if (value === undefined || value === null) return undefined;
  return Array.isArray(value) ? value.join(',') : String(value);
}

/** RAC `Label` with the decorative required marker. */
export function FieldLabel({ label, required }: { label: ReactNode; required?: boolean }) {
  return (
    <Label className={styles.label}>
      {label}
      {required && <span className={styles.required} aria-hidden="true"> *</span>}
    </Label>
  );
}

/**
 * Description and error as RAC `Text` slots, so the field adds their ids to the control's
 * `aria-describedby`. The error uses `slot="errorMessage"` (what RAC `FieldError` renders) directly
 * because `FieldError` drops `role`, and the error has always been a `role="alert"` live region.
 */
export function FieldMessages({ description, error }: { description?: ReactNode; error?: ReactNode }) {
  return (
    <>
      {description && !error && <Text slot="description" elementType="div" className={styles.description}>{description}</Text>}
      {error && <Text slot="errorMessage" elementType="div" className={styles.error} role="alert">{error}</Text>}
    </>
  );
}
