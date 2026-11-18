import { parseColor, type Color } from 'react-aria-components';

/** RAC's parser does not accept the CSS keyword; transparent is fully transparent black. */
const TRANSPARENT = '#00000000';

/** Maps a public color string (hex, rgb(a), hsl(a) or `transparent`) to one RAC can parse. */
export function normalizeColor(color: string): string {
  return color.trim().toLowerCase() === 'transparent' ? TRANSPARENT : color;
}

/** Parses a public color string, or returns `null` when it is not a color. */
export function toColor(color: string | null | undefined): Color | null {
  if (!color) return null;
  try {
    return parseColor(normalizeColor(color));
  } catch {
    return null;
  }
}

/** Whether the color is fully transparent (alpha 0). */
export function isTransparent(color: Color | null): boolean {
  return color !== null && color.getChannelValue('alpha') === 0;
}

/** RAC's collection key for a color (`#rrggbbaa`). */
export function colorKey(color: Color): string {
  return color.toString('hexa');
}

/** Lower-case `#rrggbb` for an opaque color, `transparent` for alpha 0. */
export function toHex(color: Color): string {
  return isTransparent(color) ? 'transparent' : color.toString('hex').toLowerCase();
}

/** Whether a hex field draft is a complete 3- or 6-digit hex color. */
export function isCompleteHex(value: string): boolean {
  return /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim());
}
