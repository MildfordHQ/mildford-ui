import { useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  parseColor,
  useLocale,
  type Color,
} from 'react-aria-components';
import { cx } from '../internal/cx';
import { ColorSwatch, type ColorSwatchShape, type ColorSwatchSize } from './ColorSwatch';
import { colorKey, toColor } from './colorUtils';
import styles from './Color.module.css';

export type SwatchGridColor = string | { color: string; name?: string; id?: string };

export interface SwatchGridChangeDetail {
  /** The entry's `id`, when it has one. */
  id?: string;
  /** The entry's position in `colors`. */
  index: number;
}

export interface SwatchGridProps {
  /**
   * The swatches, in order. Strings are colors (hex, rgb(a), hsl(a) or `transparent`); objects add
   * an accessible `name` (e.g. "#1") and a stable `id`. Colors must be unique: RAC keys swatches
   * by color value.
   */
  colors: SwatchGridColor[];
  /** Selected swatch, as an entry `id` or a color string. `null` selects nothing. */
  value?: string | null;
  /** Initial selection when uncontrolled (entry `id` or color string). */
  defaultValue?: string | null;
  /** Called with the selected entry's color string exactly as given in `colors`, plus its id and index. */
  onChange?: (color: string, detail: SwatchGridChangeDetail) => void;
  /** Swatches per row, 1–12. @default 8 */
  columns?: number;
  /** @default 40 */
  swatchSize?: ColorSwatchSize;
  /** @default "circle" */
  shape?: ColorSwatchShape;
  /**
   * Enables keyboard reorder: Alt/Option + ArrowLeft/ArrowRight on the focused swatch asks to move it
   * one place (mirrored in RTL). The owner reorders `colors`; focus follows the moved swatch.
   */
  onReorder?: (fromIndex: number, toIndex: number) => void;
  isDisabled?: boolean;
  /** @default "Swatches" when no `aria-labelledby` is given */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  className?: string;
}

interface Entry {
  source: string;
  color: Color;
  key: string;
  name?: string;
  id?: string;
}

/** Selects nothing: an alpha-0 color that no real swatch uses (transparent is `#00000000`). */
const NO_SELECTION = parseColor('#01020300');

function toEntries(colors: SwatchGridColor[]): Entry[] {
  const entries: Entry[] = [];
  for (const item of colors) {
    const spec = typeof item === 'string' ? { color: item } : item;
    const color = toColor(spec.color);
    if (!color) continue;
    entries.push({ source: spec.color, color, key: colorKey(color), name: spec.name, id: spec.id });
  }
  return entries;
}

function findIndex(entries: Entry[], value: string | null | undefined): number {
  if (value == null) return -1;
  const byId = entries.findIndex((entry) => entry.id !== undefined && entry.id === value);
  if (byId !== -1) return byId;
  const color = toColor(value);
  return color ? entries.findIndex((entry) => entry.key === colorKey(color)) : -1;
}

/**
 * A grid of selectable swatches on RAC `ColorSwatchPicker`: arrows move, Space/Enter
 * or click picks, Alt/Option + ←/→ reorders when `onReorder` is set.
 */
export function SwatchGrid({
  colors,
  value,
  defaultValue = null,
  onChange,
  columns = 8,
  swatchSize = 40,
  shape = 'circle',
  onReorder,
  isDisabled = false,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  className,
}: SwatchGridProps) {
  const entries = useMemo(() => toEntries(colors), [colors]);
  const [uncontrolled, setUncontrolled] = useState<string | null>(defaultValue);
  const selectedIndex = findIndex(entries, value !== undefined ? value : uncontrolled);
  const selected = selectedIndex === -1 ? NO_SELECTION : entries[selectedIndex].color;
  const { direction } = useLocale();
  const root = useRef<HTMLDivElement>(null);
  const movedKey = useRef<string | null>(null);

  // After a keyboard reorder the moved option may have been re-inserted by React, which drops
  // DOM focus; put it back on the same swatch so RAC's focused key stays on it.
  useLayoutEffect(() => {
    const key = movedKey.current;
    movedKey.current = null;
    if (!key || !root.current) return;
    const option = Array.from(root.current.querySelectorAll<HTMLElement>('[role="option"]')).find(
      (element) => element.dataset.key === key,
    );
    const active = document.activeElement;
    const focusLost = !active || active === document.body || root.current.contains(active);
    if (option && focusLost && active !== option) option.focus();
  }, [entries]);

  const handleChange = (color: Color) => {
    const index = entries.findIndex((entry) => entry.key === colorKey(color));
    if (index === -1) return;
    const entry = entries[index];
    if (value === undefined) setUncontrolled(entry.id ?? entry.source);
    onChange?.(entry.source, { id: entry.id, index });
  };

  // Capture phase: Alt+Arrow never reaches RAC's own arrow navigation; plain arrows pass through.
  const handleKeyDownCapture = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onReorder || isDisabled || !event.altKey || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
    const option = (event.target as Element).closest('[role="option"]');
    if (!option || !root.current) return;
    const options = Array.from(root.current.querySelectorAll('[role="option"]'));
    const from = options.indexOf(option);
    if (from === -1) return;
    const forward = (event.key === 'ArrowRight') !== (direction === 'rtl');
    const to = from + (forward ? 1 : -1);
    event.preventDefault();
    event.stopPropagation();
    if (to < 0 || to >= entries.length) return;
    movedKey.current = entries[from].key;
    onReorder(from, to);
  };

  return (
    <div ref={root} className={styles.gridRoot} onKeyDownCapture={handleKeyDownCapture}>
      <ColorSwatchPicker
        value={selected}
        onChange={handleChange}
        aria-label={ariaLabel ?? (ariaLabelledby ? undefined : 'Swatches')}
        aria-labelledby={ariaLabelledby}
        data-columns={Math.min(12, Math.max(1, Math.round(columns)))}
        data-size={swatchSize}
        className={cx(styles.grid, className)}
      >
        {entries.map((entry) => (
          <ColorSwatchPickerItem
            key={entry.key}
            color={entry.color}
            isDisabled={isDisabled}
            className={cx(styles.gridItem, shape === 'square' && styles.square)}
          >
            <ColorSwatch color={entry.source} size={swatchSize} shape={shape} colorName={entry.name} />
          </ColorSwatchPickerItem>
        ))}
      </ColorSwatchPicker>
    </div>
  );
}
