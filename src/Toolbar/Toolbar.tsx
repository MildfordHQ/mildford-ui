import { useEffect, useRef, type ReactNode } from 'react';
import { SeparatorContext, Toolbar as RACToolbar, type ToolbarProps as RACToolbarProps } from 'react-aria-components';
import { useEditorShell } from '../EditorShell/EditorShellContext';
import { cx } from '../internal/cx';
import styles from './Toolbar.module.css';

interface ToolbarBaseProps extends Omit<RACToolbarProps, 'className' | 'style' | 'children'> {
  /** Required: names the toolbar, e.g. after the current mode ("Object"). */
  'aria-label': string;
  children: ReactNode;
  className?: string;
}

export interface ToolbarProps extends ToolbarBaseProps {
  /** `scroll` keeps one row and scrolls horizontally (narrow widths); `wrap` wraps. @default "scroll" */
  overflow?: 'scroll' | 'wrap';
  /** Bottom divider. Off inside `EditorShell`, whose toolbar region already draws it. */
  divider?: boolean;
}

/**
 * Docked contextual toolbar on RAC `Toolbar`: 48px, one tab stop, arrow keys and
 * Home/End move between controls. Separate groups with `<Separator />`.
 */
export function Toolbar({ overflow = 'scroll', divider, className, children, ...props }: ToolbarProps) {
  const insideShell = useEditorShell() !== null;
  const ref = useHomeEnd();
  return (
    <RACToolbar
      {...props}
      ref={ref}
      className={cx(styles.toolbar, className)}
      data-overflow={overflow}
      data-divider={(divider ?? !insideShell) || undefined}
    >
      <PerpendicularSeparators orientation={props.orientation}>{children}</PerpendicularSeparators>
    </RACToolbar>
  );
}

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Home / End jump to the first / last control. React Aria's toolbar handles arrows and
 * Tab but not Home / End, and it does not forward keyboard props, so this listens natively in the
 * capture phase. It only moves DOM focus and leaves everything else to React Aria.
 */
function useHomeEnd() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const toolbar = ref.current;
    if (!toolbar) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.key !== 'Home' && event.key !== 'End') || event.defaultPrevented) return;
      if ((event.target as HTMLElement).closest('input, textarea, [contenteditable="true"]')) return;
      const controls = [...toolbar.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (element) => element.closest('[role="toolbar"]') === toolbar && element.getAttribute('aria-disabled') !== 'true',
      );
      const next = event.key === 'Home' ? controls[0] : controls[controls.length - 1];
      if (next) {
        event.preventDefault();
        next.focus();
      }
    };
    toolbar.addEventListener('keydown', onKeyDown, true);
    return () => toolbar.removeEventListener('keydown', onKeyDown, true);
  }, []);
  return ref;
}

/** Separators inside a toolbar run across it. */
function PerpendicularSeparators({ orientation = 'horizontal', children }: { orientation?: 'horizontal' | 'vertical'; children: ReactNode }) {
  return (
    <SeparatorContext.Provider value={{ orientation: orientation === 'horizontal' ? 'vertical' : 'horizontal' }}>
      {children}
    </SeparatorContext.Provider>
  );
}

export interface FloatingToolbarProps extends ToolbarBaseProps {
  /**
   * Places the pill in the nearest positioned ancestor (e.g. `EditorShell` overlays) with a 16px
   * inset plus the safe-area inset. `none` leaves positioning to the consumer. @default "none"
   */
  position?: 'none' | 'bottom-end' | 'bottom-start' | 'top-end' | 'top-start';
}

/**
 * M3 floating toolbar: the same semantics in a 40px `surface-container` pill with elevation 2.
 * Use `size="sm"` (32px) icon buttons inside it.
 */
export function FloatingToolbar({ position = 'none', className, children, ...props }: FloatingToolbarProps) {
  const ref = useHomeEnd();
  return (
    <RACToolbar {...props} ref={ref} className={cx(styles.floating, className)} data-position={position === 'none' ? undefined : position}>
      <PerpendicularSeparators orientation={props.orientation}>{children}</PerpendicularSeparators>
    </RACToolbar>
  );
}
