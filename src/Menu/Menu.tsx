import type { CSSProperties, ReactNode } from 'react';
import {
  Header,
  Menu as RACMenu,
  MenuItem as RACMenuItem,
  MenuSection as RACMenuSection,
  MenuTrigger as RACMenuTrigger,
  Popover as RACPopover,
  SubmenuTrigger as RACSubmenuTrigger,
  Text,
  type MenuItemProps as RACMenuItemProps,
  type MenuProps as RACMenuProps,
  type MenuSectionProps as RACMenuSectionProps,
  type MenuTriggerProps as RACMenuTriggerProps,
  type PopoverProps as RACPopoverProps,
  type SubmenuTriggerProps as RACSubmenuTriggerProps,
} from 'react-aria-components';
import { cx } from '../internal/cx';
import { Kbd } from '../Kbd';
import styles from './Menu.module.css';

export type MenuTriggerProps = RACMenuTriggerProps;

/**
 * Opens a `Menu` from its first child (a Mildford `Button`, `IconButton` or other RAC pressable).
 * `trigger` may be `"press"` (default), `"longPress"` or `"contextMenu"`.
 */
export function MenuTrigger(props: MenuTriggerProps) {
  return <RACMenuTrigger {...props} />;
}

export type SubmenuTriggerProps = RACSubmenuTriggerProps;

/** Wraps a `MenuItem` (the trigger) and a nested `Menu`. */
export function SubmenuTrigger(props: SubmenuTriggerProps) {
  return <RACSubmenuTrigger {...props} />;
}

export interface MenuProps<T> extends Omit<RACMenuProps<T>, 'className' | 'style'> {
  /** Minimum width in px. @default 220 */
  minWidth?: number;
  /** `compact` = 40px rows for long menus. @default "standard" (48px) */
  density?: 'standard' | 'compact';
  /** Popover placement relative to the trigger. Submenus default to `end top`. */
  placement?: RACPopoverProps['placement'];
  /** @default 4 */
  offset?: number;
  className?: string;
}

/**
 * M3 menu on RAC `Menu`, rendered in its own popover: `surface-container`,
 * `corner.medium`, elevation 2. Typeahead, sections, checkbox/radio sections, submenus and Escape
 * come from React Aria. Disabled items are skipped by arrow keys and inert (React Aria behaviour).
 */
export function Menu<T extends object>({ minWidth = 220, density = 'standard', placement, offset = 4, className, ...props }: MenuProps<T>) {
  const style = { '--menu-min-width': `${minWidth}px` } as CSSProperties;
  return (
    <RACPopover className={styles.popover} placement={placement} offset={offset} style={style}>
      <RACMenu<T> {...props} className={cx(styles.menu, className)} data-density={density} />
    </RACPopover>
  );
}

export interface MenuItemProps<T = object> extends Omit<RACMenuItemProps<T>, 'children' | 'className' | 'style'> {
  children: ReactNode;
  /** Leading 24px slot: an `<Icon>` or a shape preview. */
  icon?: ReactNode;
  /** Trailing shortcut, rendered as `<Kbd>`. */
  shortcut?: string | string[];
  /** Secondary line, e.g. why the item is disabled. */
  description?: ReactNode;
  /** Error-colored destructive action (e.g. Delete). */
  destructive?: boolean;
  className?: string;
}

export function MenuItem<T extends object>({ children, icon, shortcut, description, destructive, className, textValue, ...props }: MenuItemProps<T>) {
  return (
    <RACMenuItem<T>
      {...props}
      textValue={textValue ?? (typeof children === 'string' ? children : undefined)}
      className={cx(styles.item, destructive && styles.destructive, className)}
      data-has-icon={icon ? true : undefined}
    >
      {({ selectionMode, isSelected, hasSubmenu }) => (
        <>
          {selectionMode !== 'none' && (
            <span className={styles.selection} data-mode={selectionMode} data-checked={isSelected || undefined} aria-hidden="true">
              {isSelected && (
                selectionMode === 'single'
                  ? <span className={styles.radioDot} />
                  : <svg viewBox="0 -960 960 960" width={20} height={20}><path d="M380-250 160-470l56-56 164 164 364-364 56 56Z" /></svg>
              )}
            </span>
          )}
          {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
          <span className={styles.text}>
            <Text slot="label" className={styles.label}>{children}</Text>
            {description && <Text slot="description" className={styles.description}>{description}</Text>}
          </span>
          {shortcut && !hasSubmenu && <Kbd keys={shortcut} className={styles.shortcut} />}
          {hasSubmenu && (
            <svg className={styles.chevron} viewBox="0 -960 960 960" width={20} height={20} aria-hidden="true"><path d="M600-480 360-240l-56-56 184-184-184-184 56-56Z" /></svg>
          )}
        </>
      )}
    </RACMenuItem>
  );
}

export interface MenuSectionProps<T> extends Omit<RACMenuSectionProps<T>, 'className' | 'style' | 'children'> {
  /** Static `MenuItem`s (sections with a visible header take static children). */
  children: ReactNode;
  /** Visible section header (title-small). Also labels the group. */
  title?: ReactNode;
  /**
   * `grid` lays the section's items out in a grid (shape pickers, swatches). Items stay menu items:
   * React Aria forbids interactive content inside a menu item, and arrow keys step through them in order.
   */
  layout?: 'list' | 'grid';
  /** Columns for `layout="grid"`. @default 6 */
  columns?: number;
  className?: string;
}

export function MenuSection<T extends object>({ title, layout = 'list', columns = 6, className, children, ...props }: MenuSectionProps<T>) {
  const style = layout === 'grid' ? ({ '--menu-columns': columns } as CSSProperties) : undefined;
  return (
    <RACMenuSection<T> {...props} className={cx(styles.section, layout === 'grid' && styles.grid, className)} style={style}>
      {title && <Header className={styles.header}>{title}</Header>}
      {children}
    </RACMenuSection>
  );
}
