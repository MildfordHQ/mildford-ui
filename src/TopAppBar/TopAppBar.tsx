import type { HTMLAttributes, ReactNode } from 'react';
import { Toolbar } from 'react-aria-components';
import { useEditorShell } from '../EditorShell/EditorShellContext';
import { cx } from '../internal/cx';
import { useBreakpoint } from '../internal/useMediaQuery';
import styles from './TopAppBar.module.css';

export interface TopAppBarProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'children'> {
  /** Product mark and wordmark (static). */
  brand: ReactNode;
  /** Document menus and history (independent `MenuTrigger`s, a `ButtonGroup` of undo/redo). */
  leading?: ReactNode;
  /** Status (e.g. a static `Chip` with `role="status"`). */
  status?: ReactNode;
  /** Centred document title (title-medium). Hidden below 1024px. */
  title?: ReactNode;
  /** Theme toggle, primary action (`SplitButton`). */
  trailing?: ReactNode;
  /**
   * Replaces `leading` below 1024px: usually a `MenuTrigger` on a `more_vert`
   * `IconButton` whose menu holds the File / View items.
   */
  collapsedMenu?: ReactNode;
  /** Names the bar's toolbar. @default "Document" */
  'aria-label'?: string;
}

/**
 * M3 top app bar for editors. One RAC `Toolbar`: a single tab stop with arrow-key
 * navigation across all controls. The title is centred by a three-column grid, so it stays centred
 * with asymmetric sides. Renders `<header>` on its own and a plain element inside `EditorShell`,
 * whose app bar region is already the banner landmark.
 *
 * React Aria has no menubar: adjacent menus are independent `MenuTrigger`s, so moving from File to
 * View while one is open takes a click, not a hover.
 */
export function TopAppBar({ brand, leading, status, title, trailing, collapsedMenu, 'aria-label': ariaLabel = 'Document', className, ...props }: TopAppBarProps) {
  const shell = useEditorShell();
  const ownBreakpoint = useBreakpoint();
  const isCompact = (shell?.breakpoint ?? ownBreakpoint) === 'sm';
  const Element = shell ? 'div' : 'header';
  const showCollapsed = isCompact && collapsedMenu !== undefined;

  return (
    <Element {...props} className={cx(styles.bar, className)} data-compact={isCompact || undefined}>
      <Toolbar aria-label={ariaLabel} className={styles.toolbar}>
        <div className={styles.start}>
          <span className={styles.brand}>{brand}</span>
          {showCollapsed ? collapsedMenu : leading}
          {status && <span className={styles.status}>{status}</span>}
        </div>
        {title && !isCompact && <div className={styles.title}>{title}</div>}
        <div className={styles.end}>{trailing}</div>
      </Toolbar>
    </Element>
  );
}
