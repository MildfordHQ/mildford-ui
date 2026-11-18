import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { Input, TextField as RACTextField } from 'react-aria-components';
import { cx } from '../internal/cx';
import { FieldMessages, FieldLabel, toFieldValue } from './fieldParts';
import styles from './Form.module.css';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'disabled' | 'required' | 'readOnly'> {
  label: ReactNode;
  isDisabled?: boolean;
  /** Marks the field required: a visual asterisk, `aria-required` and the native `required` attribute. */
  isRequired?: boolean;
  isReadOnly?: boolean;
  /** Help text under the field; hidden while `error` is shown. Wired through `aria-describedby`. */
  description?: ReactNode;
  /** Error message. Marks the field invalid (`aria-invalid`) and is announced (`role="alert"`). */
  error?: ReactNode;
}

/**
 * A labelled text input on RAC `TextField` + `Label` + `Input` + `Text`.
 *
 * Every native input prop still reaches the `<input>`: `onChange` receives the native React
 * `ChangeEvent`, `ref` is the `<input>`, and `value`/`defaultValue`/`type`/`inputMode` behave as
 * on a plain input. `className` styles the input.
 *
 * Validation is display-only (`validationBehavior="aria"`): `error` never calls
 * `setCustomValidity`, so it does not block form submission; `isRequired` also sets the native `required` attribute.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, description, error, id, className, isRequired, isDisabled, isReadOnly, value, defaultValue, 'aria-describedby': describedBy, ...props },
  ref,
) {
  return (
    <RACTextField
      className={styles.field}
      id={id}
      value={toFieldValue(value)}
      defaultValue={toFieldValue(defaultValue)}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isInvalid={Boolean(error)}
      validationBehavior="aria"
      aria-describedby={describedBy}
    >
      <FieldLabel label={label} required={isRequired} />
      <Input {...props} ref={ref} required={isRequired} className={cx(styles.control, className)} />
      <FieldMessages description={description} error={error} />
    </RACTextField>
  );
});
