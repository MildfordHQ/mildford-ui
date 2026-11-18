import { forwardRef, type TextareaHTMLAttributes, type ReactNode } from 'react';
import { TextArea as RACTextArea, TextField as RACTextField } from 'react-aria-components';
import { cx } from '../internal/cx';
import { FieldMessages, FieldLabel, toFieldValue } from './fieldParts';
import styles from './Form.module.css';

export interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'disabled' | 'required' | 'readOnly'> {
  isDisabled?: boolean;
  /** Marks the field required: a visual asterisk, `aria-required` and the native `required` attribute. */
  isRequired?: boolean;
  isReadOnly?: boolean;
  label: ReactNode;
  /** Help text under the field; hidden while `error` is shown. Wired through `aria-describedby`. */
  description?: ReactNode;
  /** Error message. Marks the field invalid (`aria-invalid`) and is announced (`role="alert"`). */
  error?: ReactNode;
}

/**
 * A labelled multi-line text area on RAC `TextField` + `Label` + `TextArea` + `Text`.
 *
 * Every native textarea prop still reaches the `<textarea>`: `onChange` receives the native React
 * `ChangeEvent`, `ref` is the `<textarea>`, and `value`/`defaultValue`/`rows` behave as
 * on a plain `<textarea>`. `className` styles the textarea.
 *
 * Validation is display-only (`validationBehavior="aria"`): `error` never calls
 * `setCustomValidity`, so it does not block form submission; `isRequired` also sets the native `required` attribute.
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
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
      <RACTextArea {...props} ref={ref} required={isRequired} className={cx(styles.control, styles.textarea, className)} />
      <FieldMessages description={description} error={error} />
    </RACTextField>
  );
});
