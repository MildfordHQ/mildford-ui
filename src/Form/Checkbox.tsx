import {
  forwardRef,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { Checkbox as RACCheckbox, type CheckboxProps as RACCheckboxProps } from 'react-aria-components';
import { cx } from '../internal/cx';
import { toFieldValue } from './fieldParts';
import styles from './Form.module.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'defaultChecked' | 'disabled' | 'required' | 'readOnly'> {
  label: ReactNode;
  /** Whether the checkbox is checked (controlled). */
  isSelected?: boolean;
  /** Initial checked state (uncontrolled). */
  defaultSelected?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  isReadOnly?: boolean;
  /** Help text under the checkbox; hidden while `error` is shown. Wired through `aria-describedby`. */
  description?: ReactNode;
  /** Error message. Marks the checkbox invalid (`aria-invalid`) and is announced (`role="alert"`). */
  error?: ReactNode;
}

/**
 * Builds the `ChangeEvent` a native checkbox would have produced. RAC toggles a checkbox from a
 * press on its `<label>` (pointer) without a native `change` event, and reports the new state
 * only as a boolean, so the consumer's `onChange(event)` contract is kept by handing it the real
 * `<input>` as `target`/`currentTarget`, with `target.checked` already set to the new value.
 */
function createChangeEvent(input: HTMLInputElement): ChangeEvent<HTMLInputElement> {
  const nativeEvent = new Event('change', { bubbles: true });
  let defaultPrevented = false;
  let propagationStopped = false;
  return {
    nativeEvent,
    target: input,
    currentTarget: input,
    type: 'change',
    bubbles: true,
    cancelable: false,
    eventPhase: nativeEvent.eventPhase,
    isTrusted: false,
    timeStamp: nativeEvent.timeStamp,
    get defaultPrevented() { return defaultPrevented; },
    preventDefault() { defaultPrevented = true; },
    isDefaultPrevented: () => defaultPrevented,
    stopPropagation() { propagationStopped = true; },
    isPropagationStopped: () => propagationStopped,
    persist() {},
  };
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value);
  else if (ref) (ref as { current: T | null }).current = value;
}

/**
 * M3 checkbox on RAC `Checkbox`: 18px box, 40px state layer, focus ring, check mark drawn in SVG.
 *
 * - `ref` is the (visually hidden) `<input type="checkbox">`.
 * - `isSelected` (controlled) or `defaultSelected` (uncontrolled) sets the checked state.
 * - `onChange(event)` gets a `ChangeEvent` whose `target` is the input and `target.checked` is the
 *   new value, for pointer, keyboard and label activation. When the browser toggles the input
 *   itself (a click on the input, keyboard Space) React's real event is passed through; when RAC
 *   toggles from a press on the label text or box, an equivalent is built (`createChangeEvent`).
 * - `name`, `value`, `id`, `isDisabled`, `isRequired`, `isReadOnly`, `form`, `autoFocus`, `aria-*`,
 *   `onFocus`/`onBlur`, `onKeyDown`/`onKeyUp` and `onClick` reach the input's behaviour; `data-*`
 *   and other global attributes land on the `<label>`. `className` styles the outer wrapper.
 * - `error` is display-only: it sets `aria-invalid` but never blocks form submission.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    label,
    description,
    error,
    id,
    className,
    isSelected: selectedProp,
    defaultSelected,
    onChange,
    isDisabled,
    isRequired,
    isReadOnly,
    name,
    value,
    form,
    autoFocus,
    tabIndex,
    'aria-describedby': describedBy,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = error ? `${inputId}-error` : description ? `${inputId}-description` : undefined;

  const [uncontrolled, setUncontrolled] = useState(Boolean(defaultSelected));
  const isControlled = selectedProp !== undefined;
  const selected = isControlled ? Boolean(selectedProp) : uncontrolled;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const setInputRef = useCallback((node: HTMLInputElement | null) => {
    inputRef.current = node;
    assignRef(ref, node);
  }, [ref]);

  // A real change event (click on the input, keyboard Space) is caught in the capture phase, before
  // RAC's own input handler stops its propagation, and handed to the consumer unchanged.
  const pendingNative = useRef<ChangeEvent<HTMLInputElement> | null>(null);
  const handleChangeCapture = (event: FormEvent<HTMLDivElement>) => {
    pendingNative.current = event.target === inputRef.current ? (event as unknown as ChangeEvent<HTMLInputElement>) : null;
  };

  const [, forceRender] = useState(0);
  const handleRACChange = (isSelected: boolean) => {
    const input = inputRef.current;
    const pending = pendingNative.current;
    pendingNative.current = null;
    if (!isControlled) setUncontrolled(isSelected);
    // Re-render even when a controlled owner ignores the change, so the DOM is re-synced below.
    else forceRender((n) => n + 1);
    if (!onChange || !input) return;
    if (pending && pending.target.checked === isSelected) {
      onChange(pending);
      return;
    }
    input.checked = isSelected;
    onChange(createChangeEvent(input));
  };

  // Keep the DOM `checked` property equal to the rendered state (it was set ahead of React when
  // building the change event, and a controlled owner may have rejected the change).
  useLayoutEffect(() => {
    if (inputRef.current && inputRef.current.checked !== selected) inputRef.current.checked = selected;
  });

  // Display-only validation keeps `isRequired` out of RAC, so set the native attribute directly.
  useLayoutEffect(() => {
    if (inputRef.current) inputRef.current.required = Boolean(isRequired);
  }, [isRequired]);

  return (
    <div className={cx(styles.checkboxField, className)} onChangeCapture={handleChangeCapture}>
      <RACCheckbox
        {...(props as Omit<RACCheckboxProps, 'children'>)}
        inputRef={setInputRef}
        id={inputId}
        isSelected={selected}
        onChange={handleRACChange}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        isRequired={isRequired}
        isInvalid={Boolean(error)}
        validationBehavior="aria"
        name={name}
        value={toFieldValue(value)}
        form={form}
        autoFocus={autoFocus}
        excludeFromTabOrder={tabIndex !== undefined && tabIndex < 0}
        aria-describedby={cx(describedBy, messageId) || undefined}
        className={styles.checkboxRow}
      >
        <span className={styles.checkboxBox} aria-hidden="true">
          <svg className={styles.checkmark} viewBox="0 0 18 18" focusable="false">
            <path d="M3.5 9.5 7 13l7.5-8" />
          </svg>
        </span>
        <span className={styles.checkboxLabel}>{label}</span>
      </RACCheckbox>
      {description && !error && <div className={styles.checkboxMessage} id={`${inputId}-description`}>{description}</div>}
      {error && <div className={cx(styles.checkboxMessage, styles.error)} id={`${inputId}-error`} role="alert">{error}</div>}
    </div>
  );
});
