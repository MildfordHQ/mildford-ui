import { forwardRef, useMemo } from 'react';
import {
  Button as RACButton,
  ColorSwatch as RACColorSwatch,
  type ButtonProps as RACButtonProps,
  type ColorSwatchProps as RACColorSwatchProps,
} from 'react-aria-components';
import { cx } from '../internal/cx';
import { isTransparent, normalizeColor, toColor } from './colorUtils';
import styles from './Color.module.css';

export type ColorSwatchSize = 24 | 32 | 40;
export type ColorSwatchShape = 'circle' | 'square';

export interface ColorSwatchProps
  extends Omit<RACColorSwatchProps, 'color' | 'colorName' | 'className' | 'style' | 'aria-label'> {
  /** Hex (`#0064d4`, `#0064d480`), `rgb()/rgba()`, `hsl()` or `transparent`. */
  color: string;
  /** Visual size in px. @default 32 */
  size?: ColorSwatchSize;
  /** `square` uses `corner.small`. @default "circle" */
  shape?: ColorSwatchShape;
  /**
   * Accessible color name, e.g. a palette name ("Ink") or index ("#1"). Without it the swatch is
   * named by RAC's localized color name ("dark vibrant blue"), or "Transparent" for alpha 0.
   */
  colorName?: string;
  /** Replaces the color name entirely (same effect as `colorName`). */
  'aria-label'?: string;
  className?: string;
}

/**
 * A color preview on RAC `ColorSwatch` (`role="img"` with a color name). Fully transparent
 * colors render a token-colored checkerboard and are announced as "Transparent".
 */
export const ColorSwatch = forwardRef<HTMLDivElement, ColorSwatchProps>(function ColorSwatch(
  { color, size = 32, shape = 'circle', colorName, 'aria-label': ariaLabel, className, ...props },
  ref,
) {
  const parsed = useMemo(() => toColor(color), [color]);
  const transparent = isTransparent(parsed);
  return (
    <RACColorSwatch
      {...props}
      ref={ref}
      color={parsed ?? normalizeColor(color)}
      colorName={ariaLabel ?? colorName ?? (transparent ? 'Transparent' : undefined)}
      data-transparent={transparent || undefined}
      className={cx(styles.swatch, styles[`size${size}`], shape === 'square' && styles.square, className)}
    />
  );
});

export interface ColorSwatchButtonProps extends Omit<RACButtonProps, 'children' | 'className' | 'style'> {
  /** Required: names the control and its purpose, e.g. "Fill color: dark blue". */
  'aria-label': string;
  color: string;
  /** @default 24 */
  size?: ColorSwatchSize;
  /** @default "circle" */
  shape?: ColorSwatchShape;
  /** Draws a trailing chevron to signal that the button opens a popover. @default false */
  showChevron?: boolean;
  className?: string;
}

/**
 * A pressable swatch on RAC `Button` for "Fill", "Stroke" and "Background" controls. Place it as the `trigger` of a `Popover` / `ColorPickerPopover`.
 */
export const ColorSwatchButton = forwardRef<HTMLButtonElement, ColorSwatchButtonProps>(function ColorSwatchButton(
  { color, size = 24, shape = 'circle', showChevron = false, className, ...props },
  ref,
) {
  return (
    <RACButton {...props} ref={ref} className={cx(styles.swatchButton, showChevron && styles.withChevron, className)}>
      <ColorSwatch color={color} size={size} shape={shape} aria-hidden="true" />
      {showChevron && (
        <svg className={styles.chevron} viewBox="0 -960 960 960" aria-hidden="true">
          <path d="M480-340 240-580l56-56 184 184 184-184 56 56Z" />
        </svg>
      )}
    </RACButton>
  );
});
