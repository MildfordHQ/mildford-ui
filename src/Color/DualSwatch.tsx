import { forwardRef, useMemo, type ReactNode } from 'react';
import { Button as RACButton, useLocale } from 'react-aria-components';
import { cx } from '../internal/cx';
import { IconButton } from '../IconButton';
import { ColorSwatch } from './ColorSwatch';
import { isTransparent, toColor } from './colorUtils';
import styles from './Color.module.css';

export interface DualSwatchProps {
  /** Front swatch (top-left), e.g. the fill color. */
  foreground: string;
  /** Back swatch (bottom-right), e.g. the stroke color; `transparent` shows the checkerboard. */
  background: string;
  /** Role of the front swatch. @default "Fill" */
  foregroundLabel?: string;
  /** Role of the back swatch. @default "Stroke" */
  backgroundLabel?: string;
  /** Color name for the front swatch, e.g. a palette index ("#1"). Defaults to RAC's color name. */
  foregroundName?: string;
  /** Color name for the back swatch. Defaults to RAC's color name, or "transparent". */
  backgroundName?: string;
  /** 56 for the side panel, 32 for the contextual toolbar. @default 56 */
  size?: 32 | 56;
  /** Shows a swap icon button that exchanges the two roles. */
  onSwap?: () => void;
  /** Accessible name of the swap button. @default "Swap {foregroundLabel} and {backgroundLabel}" */
  swapLabel?: string;
  /** Replaces the built-in swap glyph (24px Material Symbols viewBox). */
  swapIcon?: ReactNode;
  /** Makes the pair one button (e.g. a popover trigger in the toolbar). */
  onPress?: () => void;
  /** Accessible name of the pair. @default "{foregroundLabel} {name} · {backgroundLabel} {name}" */
  'aria-label'?: string;
  className?: string;
}

const SWAP_GLYPH = (
  <svg viewBox="0 -960 960 960" width="18" height="18" aria-hidden="true" className={styles.swapGlyph}>
    <path d="M280-160 120-320l160-160 56 56-64 64h448v80H272l64 64Zm400-320-56-56 64-64H240v-80h448l-64-64 56-56 160 160Z" />
  </svg>
);

function useColorName(color: string, override: string | undefined): string {
  const { locale } = useLocale();
  return useMemo(() => {
    if (override) return override;
    const parsed = toColor(color);
    if (!parsed) return color;
    return isTransparent(parsed) ? 'transparent' : parsed.getColorName(locale);
  }, [color, override, locale]);
}

/**
 * Two overlapping swatches showing the current pair of color roles — foreground top-left over
 * background bottom-right — with an optional swap button.
 * Static, the pair is a labelled group of two named swatches; with `onPress`, one button.
 * `DualSwatch` is a forwardRef to the pressable when `onPress` is set.
 */
export const DualSwatch = forwardRef<HTMLButtonElement, DualSwatchProps>(function DualSwatch(
  {
    foreground,
    background,
    foregroundLabel = 'Fill',
    backgroundLabel = 'Stroke',
    foregroundName,
    backgroundName,
    size = 56,
    onSwap,
    swapLabel,
    swapIcon,
    onPress,
    'aria-label': ariaLabel,
    className,
  },
  ref,
) {
  const fgName = useColorName(foreground, foregroundName);
  const bgName = useColorName(background, backgroundName);
  const summary = ariaLabel ?? `${foregroundLabel} ${fgName} · ${backgroundLabel} ${bgName}`;
  const sizeClass = size === 32 ? styles.dual32 : styles.dual56;

  const swatches = (
    <>
      <ColorSwatch
        color={background}
        className={cx(styles.dualSwatch, styles.dualBack)}
        aria-label={`${backgroundLabel}: ${bgName}`}
      />
      <ColorSwatch
        color={foreground}
        className={cx(styles.dualSwatch, styles.dualFront)}
        aria-label={`${foregroundLabel}: ${fgName}`}
      />
    </>
  );

  return (
    <div className={cx(styles.dual, sizeClass, className)}>
      {onPress ? (
        <RACButton ref={ref} onPress={onPress} aria-label={summary} className={styles.dualPair}>
          {swatches}
        </RACButton>
      ) : (
        <div role="group" aria-label={summary} className={styles.dualPair}>
          {swatches}
        </div>
      )}
      {onSwap && (
        <IconButton
          size="sm"
          aria-label={swapLabel ?? `Swap ${foregroundLabel} and ${backgroundLabel}`}
          onPress={onSwap}
          className={styles.dualSwap}
        >
          {swapIcon ?? SWAP_GLYPH}
        </IconButton>
      )}
    </div>
  );
});
