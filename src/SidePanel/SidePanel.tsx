import { forwardRef, useEffect, useRef, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { Dialog, Heading, Sheet, SheetBackdrop, SheetContent, SheetOverlay } from 'react-aria-components';
import { usePanelRegion } from '../EditorShell/EditorShellContext';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { cx } from '../internal/cx';
import styles from './SidePanel.module.css';

export type SidePanelMode = 'docked' | 'overlay' | 'sheet';

export interface SidePanelProps {
  /** Rendered as the dialog title (`Heading slot="title"`): it names the panel for assistive tech. */
  title: ReactNode;
  /** Called by the close button, by Esc in docked mode and, standalone, by Esc / outside press (overlay) and swipe / backdrop (sheet). */
  onClose: () => void;
  /** The scrolling body. */
  children: ReactNode;
  /** Pinned below the body, above a top divider. */
  footer?: ReactNode;
  /**
   * Standalone only. Inside an `EditorShell` panel region the region's mode wins and this prop is
   * ignored: the shell owns placement and dismissal there.
   * @default "docked"
   */
  mode?: SidePanelMode;
  /** Width in px, standalone only (inside a shell the region sets the width). @default var(--mild-panel-width) = 320 */
  width?: number;
  /** Standalone `overlay`: top offset in px (e.g. the app bar height). @default 0 */
  inset?: number;
  /** `false` renders nothing (standalone sheets animate out). Inside a shell, open the panel by passing it to the `panel` slot instead. @default true */
  isOpen?: boolean;
  /** @default "Close panel" */
  closeLabel?: string;
  className?: string;
}

/** Close glyph in the Material Symbols viewBox (0 -960 960 960). */
const closeGlyph = <path d="M256-200 200-256l224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224Z" />;

interface ChromeProps {
  title: ReactNode;
  onClose: () => void;
  closeLabel: string;
  footer?: ReactNode;
  children: ReactNode;
}

/** Header (56px, title + close), scrolling body, optional footer. */
function PanelChrome({ title, onClose, closeLabel, footer, children }: ChromeProps) {
  return (
    <>
      <div className={styles.header}>
        <Heading slot="title" className={styles.title}>{title}</Heading>
        <IconButton aria-label={closeLabel} onPress={onClose}>
          <Icon>{closeGlyph}</Icon>
        </IconButton>
      </div>
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </>
  );
}

function sizeVars(width?: number, inset?: number): CSSProperties | undefined {
  if (width === undefined && inset === undefined) return undefined;
  return {
    ...(width !== undefined && { '--side-panel-width': `${width}px` }),
    ...(inset !== undefined && { '--side-panel-inset': `${inset}px` }),
  } as CSSProperties;
}

/**
 * M3 side sheet for editor panels: 56px header with the title and a close button, a
 * scrolling body and an optional footer.
 *
 * Inside an `EditorShell` panel region it renders only this chrome and the shell owns placement and
 * dismissal (Esc / outside press in overlay mode, swipe / Esc / backdrop in sheet mode, all routed to
 * `onPanelDismiss`). Standalone it honours `mode`: `docked` is a static panel, `overlay` floats at the
 * inline start and closes on Esc / outside press, `sheet` is a RAC bottom sheet.
 *
 * Docked and overlay panels are non-modal RAC `Dialog`s labelled by the title: focus is not trapped.
 */
export const SidePanel = forwardRef<HTMLDivElement, SidePanelProps>(function SidePanel(
  { title, onClose, children, footer, mode = 'docked', width, inset, isOpen = true, closeLabel = 'Close panel', className },
  ref,
) {
  const region = usePanelRegion();
  const resolvedMode: SidePanelMode = region ?? mode;
  const standalone = region === null;

  const panelRef = useRef<HTMLDivElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  /** Set by a pointerdown anywhere in the panel's React tree, including overlays it portals out. */
  const pressedInsideRef = useRef(false);

  const isStandaloneOverlay = standalone && resolvedMode === 'overlay' && isOpen;

  // Standalone overlay: a press outside the panel closes it. The decision waits one task so the
  // panel's React capture handler can claim presses inside menus or popovers it opened (they are
  // portaled out of its DOM subtree but stay in its React tree).
  useEffect(() => {
    if (!isStandaloneOverlay) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onPointerDown = (event: PointerEvent) => {
      if (panelRef.current?.contains(event.target as Node)) return;
      pressedInsideRef.current = false;
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!pressedInsideRef.current) onCloseRef.current();
      });
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      clearTimeout(timer);
    };
  }, [isStandaloneOverlay]);

  const chrome = (
    <PanelChrome title={title} onClose={onClose} closeLabel={closeLabel} footer={footer}>
      {children}
    </PanelChrome>
  );

  if (resolvedMode === 'sheet') {
    // Inside the shell, its SheetContent is already the dialog: never nest another one.
    if (!standalone) {
      return <div ref={ref} className={cx(styles.panel, styles.sheetPanel, className)} data-mode="sheet">{chrome}</div>;
    }
    return (
      <SheetOverlay
        className={styles.sheetOverlay}
        isOpen={isOpen}
        onOpenChange={(open) => { if (!open) onClose(); }}
        position="bottom"
        snapPoints={['60%']}
      >
        <SheetBackdrop className={styles.sheetBackdrop} />
        <Sheet className={styles.sheet}>
          <SheetContent ref={ref} className={cx(styles.panel, styles.sheetPanel, styles.standaloneSheet, className)} data-mode="sheet">
            <div className={styles.sheetHandle} aria-hidden="true" />
            {chrome}
          </SheetContent>
        </Sheet>
      </SheetOverlay>
    );
  }

  if (!isOpen) return null;

  // In a shell overlay region the shell handles Esc (on its aside); handling it here would close twice.
  // RAC `Dialog` does not forward key handlers, so a wrapper listens; it sees keys from the dialog
  // itself and, through React's tree, from overlays the panel opened unless they handled the key.
  const handlesEscape = resolvedMode === 'docked' || standalone;
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && !event.defaultPrevented) {
      event.preventDefault();
      onClose();
    }
  };

  const setRef = (node: HTMLDivElement | null) => {
    panelRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <div
      ref={setRef}
      className={cx(styles.panel, standalone && styles.standalone, className)}
      data-mode={resolvedMode}
      style={standalone ? sizeVars(width, inset) : undefined}
      onKeyDown={handlesEscape ? onKeyDown : undefined}
      onPointerDownCapture={isStandaloneOverlay ? () => { pressedInsideRef.current = true; } : undefined}
    >
      <Dialog className={styles.dialog}>{chrome}</Dialog>
    </div>
  );
});
