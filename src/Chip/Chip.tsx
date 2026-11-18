import { forwardRef, type ForwardedRef, type HTMLAttributes, type ReactNode } from 'react';
import {
  Button as RACButton,
  ToggleButton as RACToggleButton,
  type ButtonProps as RACButtonProps,
  type ToggleButtonProps as RACToggleButtonProps,
} from 'react-aria-components';
import { cx } from '../internal/cx';
import styles from './Chip.module.css';

interface ChipBaseProps {
  /** Chip label (label-large). */
  children: ReactNode;
  /** Leading icon, sized to 20px (usually an `<Icon>`). Decorative: the label names the chip. */
  icon?: ReactNode;
  className?: string;
}

/** Assist chip on RAC `Button`: a shortcut action such as a palette chip ("Primaries"). */
export interface AssistChipProps extends ChipBaseProps, Omit<RACButtonProps, 'children' | 'className' | 'style'> {
  /** @default "assist" */
  variant?: 'assist';
  isStatic?: false;
  /** Elevated assist chip: `surface-container-low` with elevation 1 instead of the outline. */
  elevated?: boolean;
}

/**
 * Static (read-only) assist chip: renders a `<span>` with chip styling and no behaviour, e.g. the
 * "Saved locally" status chip. It is not focusable and has no role; add `role="status"` (or another
 * role) yourself when the content is a live status.
 */
export interface StaticChipProps extends ChipBaseProps, Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'className'> {
  variant?: 'assist';
  isStatic: true;
  elevated?: boolean;
}

/** Filter chip on RAC `ToggleButton` (`aria-pressed`); selected shows a leading check. */
export interface FilterChipProps extends ChipBaseProps, Omit<RACToggleButtonProps, 'children' | 'className' | 'style'> {
  variant: 'filter';
}

export type ChipProps = AssistChipProps | StaticChipProps | FilterChipProps;

/** The filter chip's selected mark, drawn in the Material Symbols viewBox. */
function CheckMark() {
  return (
    <svg className={styles.check} viewBox="0 -960 960 960" aria-hidden="true" focusable="false">
      <path d="M380-250 160-470l56-56 164 164 364-364 56 56Z" />
    </svg>
  );
}

function Content({ icon, children, check = false }: { icon?: ReactNode; children: ReactNode; check?: boolean }) {
  const leading = check ? <CheckMark /> : icon;
  return (
    <>
      {leading != null && (
        <span className={styles.icon} aria-hidden="true">
          {leading}
        </span>
      )}
      <span className={styles.label}>{children}</span>
    </>
  );
}

/**
 * M3 assist and filter chips: 32px tall, `corner.full`,
 * label-large, optional 20px leading icon. `variant="assist"` is a RAC `Button`, `isStatic` a plain
 * `<span>`, `variant="filter"` a RAC `ToggleButton`.
 */
export const Chip = forwardRef<HTMLElement, ChipProps>(function Chip(props, ref) {
  if (props.variant === 'filter') {
    const { variant: _variant, icon, children, className, ...rest } = props;
    return (
      <RACToggleButton
        {...rest}
        ref={ref as ForwardedRef<HTMLButtonElement>}
        className={cx(styles.chip, styles.interactive, styles.filter, icon != null && styles.withIcon, className)}
      >
        {({ isSelected }) => <Content icon={icon} check={isSelected}>{children}</Content>}
      </RACToggleButton>
    );
  }

  if (props.isStatic) {
    const { variant: _variant, isStatic: _isStatic, elevated = false, icon, children, className, ...rest } = props;
    return (
      <span
        {...rest}
        ref={ref as ForwardedRef<HTMLSpanElement>}
        className={cx(styles.chip, styles.assist, elevated && styles.elevated, icon != null && styles.withIcon, className)}
      >
        <Content icon={icon}>{children}</Content>
      </span>
    );
  }

  const { variant: _variant, isStatic: _isStatic, elevated = false, icon, children, className, ...rest } = props;
  return (
    <RACButton
      {...rest}
      ref={ref as ForwardedRef<HTMLButtonElement>}
      className={cx(styles.chip, styles.interactive, styles.assist, elevated && styles.elevated, icon != null && styles.withIcon, className)}
    >
      <Content icon={icon}>{children}</Content>
    </RACButton>
  );
});
