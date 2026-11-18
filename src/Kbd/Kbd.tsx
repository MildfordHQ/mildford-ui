import type { HTMLAttributes } from 'react';
import { Keyboard } from 'react-aria-components';
import { cx } from '../internal/cx';
import styles from './Kbd.module.css';

export interface KbdProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /**
   * A shortcut: `"Mod+Shift+Z"`, `"⇧⌘Z"`, or explicit keys `['Shift', 'G']`.
   * `Mod`/`Cmd`/`Meta` → ⌘, `Shift` → ⇧, `Alt`/`Option` → ⌥, `Ctrl` → ⌃.
   */
  keys: string | string[];
}

const GLYPHS: Record<string, { glyph: string; spoken: string }> = {
  mod: { glyph: '⌘', spoken: 'Command' },
  cmd: { glyph: '⌘', spoken: 'Command' },
  command: { glyph: '⌘', spoken: 'Command' },
  meta: { glyph: '⌘', spoken: 'Command' },
  '⌘': { glyph: '⌘', spoken: 'Command' },
  shift: { glyph: '⇧', spoken: 'Shift' },
  '⇧': { glyph: '⇧', spoken: 'Shift' },
  alt: { glyph: '⌥', spoken: 'Option' },
  option: { glyph: '⌥', spoken: 'Option' },
  '⌥': { glyph: '⌥', spoken: 'Option' },
  ctrl: { glyph: '⌃', spoken: 'Control' },
  control: { glyph: '⌃', spoken: 'Control' },
  '⌃': { glyph: '⌃', spoken: 'Control' },
  enter: { glyph: '↵', spoken: 'Enter' },
  return: { glyph: '↵', spoken: 'Enter' },
  backspace: { glyph: '⌫', spoken: 'Backspace' },
  '⌫': { glyph: '⌫', spoken: 'Backspace' },
  delete: { glyph: '⌦', spoken: 'Delete' },
  escape: { glyph: 'Esc', spoken: 'Escape' },
  esc: { glyph: 'Esc', spoken: 'Escape' },
  space: { glyph: 'Space', spoken: 'Space' },
  tab: { glyph: '⇥', spoken: 'Tab' },
  arrowup: { glyph: '↑', spoken: 'Up arrow' },
  arrowdown: { glyph: '↓', spoken: 'Down arrow' },
  arrowleft: { glyph: '←', spoken: 'Left arrow' },
  arrowright: { glyph: '→', spoken: 'Right arrow' },
  '−': { glyph: '−', spoken: 'Minus' },
  '-': { glyph: '−', spoken: 'Minus' },
  '=': { glyph: '=', spoken: 'Equals' },
  '?': { glyph: '?', spoken: 'Question mark' },
};

const MODIFIER_GLYPHS = /^[⌘⇧⌥⌃]/;

/** Splits a shortcut string into keys: on `+`, otherwise peeling leading modifier glyphs (`⇧⌘Z`). */
export function parseKeys(keys: string | string[]): string[] {
  if (Array.isArray(keys)) return keys;
  if (keys.length > 1 && keys.includes('+')) return keys.split('+').map((key) => key.trim()).filter(Boolean);
  const parts: string[] = [];
  let rest = keys;
  while (rest.length > 1 && MODIFIER_GLYPHS.test(rest)) {
    parts.push(rest[0]);
    rest = rest.slice(1);
  }
  if (rest) parts.push(rest);
  return parts;
}

export function describeKey(key: string): { glyph: string; spoken: string } {
  const known = GLYPHS[key.toLowerCase()];
  if (known) return known;
  return { glyph: key.length === 1 ? key.toUpperCase() : key, spoken: key.length === 1 ? key.toUpperCase() : key };
}

/** A keyboard shortcut as key chips (M3 label-small). Screen readers hear the key names. */
export function Kbd({ keys, className, ...props }: KbdProps) {
  const described = parseKeys(keys).map(describeKey);
  return (
    <Keyboard {...props} className={cx(styles.kbd, className)}>
      {described.map((key, index) => (
        <kbd key={`${key.glyph}-${index}`} className={styles.key} aria-hidden="true">{key.glyph}</kbd>
      ))}
      <span className={styles.visuallyHidden}>{described.map((key) => key.spoken).join(' ')}</span>
    </Keyboard>
  );
}
