import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Button as RACButton, type PressEvent } from 'react-aria-components';
import styles from './Button.module.css';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'disabled'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  /** Disables the button. */
  isDisabled?: boolean;
  /** Shows the selected style and sets `aria-pressed`. For a toggle, prefer `ToggleButton`. */
  isSelected?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  /** @deprecated Use `IconButton`, which requires an accessible label. Will be removed in a future release. */
  iconOnly?: boolean;
  /** Disables interaction and announces that the action is in progress. */
  isPending?: boolean;
  /** Accessible announcement while pending; visible content stays unchanged. @default "Loading" */
  pendingLabel?: string;
  /**
   * Preferred press handler (mouse, touch, keyboard and screen readers alike). `onClick` still
   * works and receives the native click event.
   */
  onPress?: (event: PressEvent) => void;
}

/**
 * Text button on React Aria `Button`. The native `<button>` keeps `type="submit"`, `onClick` and
 * every other native attribute; pressed, hovered and focus-visible states come from React Aria.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'ghost',
    size = 'medium',
    isSelected = false,
    fullWidth = false,
    iconOnly = false,
    isPending = false,
    pendingLabel = 'Loading',
    children,
    className = '',
    type = 'button',
    isDisabled,
    onPress,
    'aria-pressed': ariaPressed,
    ...props
  },
  ref,
) {
  const classNames = [styles.button, styles[variant], styles[size], isSelected && styles.active,
    fullWidth && styles.fullWidth, iconOnly && styles.iconOnly, className].filter(Boolean).join(' ');

  return (
    <RACButton
      {...(props as object)}
      ref={ref}
      type={type}
      className={classNames}
      isDisabled={isDisabled}
      isPending={isPending}
      onPress={onPress}
      // React Aria filters some native attributes (title, aria-busy, …); restore them underneath its own props.
      render={(domProps) => {
        // aria-busy / aria-pressed go last so serialized markup keeps a stable attribute order.
        const { 'aria-busy': _busy, 'aria-pressed': _pressed, ...merged } = { ...props, ...domProps } as typeof domProps;
        return <button {...merged} aria-busy={isPending || undefined} aria-pressed={ariaPressed ?? (isSelected ? true : undefined)} />;
      }}
    >
      {isPending && <span className={styles.spinner} aria-hidden="true" />}
      <span className={isPending ? styles.loadingContent : undefined}>{children}</span>
      {isPending && <span className={styles.visuallyHidden}>{pendingLabel}</span>}
    </RACButton>
  );
});

export default Button;
