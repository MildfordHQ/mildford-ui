import type { Key, ReactNode } from 'react';
import { MenuTrigger, Pressable } from 'react-aria-components';
import { cx } from '../internal/cx';
import { Menu } from '../Menu';
import styles from './ContextMenu.module.css';

export interface ContextMenuProps {
  /** The target area (e.g. the editor stage). */
  children: ReactNode;
  /** The menu's `MenuItem`s / `MenuSection`s, re-rendered on each open (derive them from current state). */
  menu: ReactNode;
  onAction?: (key: Key) => void;
  isDisabled?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /** Interactive ARIA role of the wrapper, e.g. `"application"` for a drawing surface with its own hotkeys. */
  role: string;
  /** Names the wrapper; the menu is labelled by it too. */
  'aria-label': string;
  /** @default 0 */
  tabIndex?: number;
  /** @default "compact" when the menu is long; pass explicitly to override. */
  density?: 'standard' | 'compact';
  className?: string;
}

/**
 * Context menu on RAC `MenuTrigger trigger="contextMenu"`: opens at the pointer on
 * right-click, on touch/pen long press, and from Shift+F10 / the Menu key (and Ctrl+Enter for screen
 * readers) while the wrapper has focus; Escape, outside press and selection close it and focus
 * returns to the wrapper. Nothing is hand-rolled.
 *
 * The wrapper is a RAC `Pressable` around a `div` that sits outside the host's own element, so the
 * host's pointer handlers (marquee, drag, pan) still run first.
 */
export function ContextMenu({
  children,
  menu,
  onAction,
  isDisabled = false,
  isOpen,
  onOpenChange,
  role,
  'aria-label': ariaLabel,
  tabIndex = 0,
  density,
  className,
}: ContextMenuProps) {
  if (isDisabled) {
    return (
      <div role={role} aria-label={ariaLabel} tabIndex={tabIndex} className={cx(styles.target, className)}>
        {children}
      </div>
    );
  }
  return (
    <MenuTrigger trigger="contextMenu" isOpen={isOpen} onOpenChange={onOpenChange}>
      <Pressable>
        <div role={role} aria-label={ariaLabel} tabIndex={tabIndex} className={cx(styles.target, className)}>
          {children}
        </div>
      </Pressable>
      <Menu onAction={onAction} density={density} placement="bottom start" offset={0}>
        {menu}
      </Menu>
    </MenuTrigger>
  );
}
