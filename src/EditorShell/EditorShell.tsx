import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import { Sheet, SheetBackdrop, SheetContent, SheetOverlay } from 'react-aria-components';
import { useBreakpoint } from '../internal/useMediaQuery';
import {
  EditorShellContext,
  PanelRegionContext,
  WorkspaceViewportContext,
  type EditorShellContextValue,
  type PanelMode,
  type WorkspaceViewport,
} from './EditorShellContext';
import styles from './EditorShell.module.css';

export interface EditorShellProps extends HTMLAttributes<HTMLDivElement> {
  /** Rendered in the `<header>` region (usually a `TopAppBar`). */
  appBar: ReactNode;
  /** Rendered in `<nav aria-label={railLabel}>` (usually a `NavigationRail`). */
  rail?: ReactNode;
  /** @default "Tools" */
  railLabel?: string;
  /** Rendered in `<aside aria-label={panelLabel}>`. `null`/`undefined` = closed. */
  panel?: ReactNode;
  /** @default "Panel" */
  panelLabel?: string;
  /**
   * `docked` pushes the workspace; `overlay` floats over it (Esc / outside press dismiss);
   * `sheet` is a bottom sheet; `auto` follows the breakpoints (≥1280 docked, 1024–1279 overlay, <1024 sheet).
   * @default "auto"
   */
  panelMode?: PanelMode | 'auto';
  /** Called on Esc / outside press in overlay mode and on swipe-down / Esc / backdrop press in sheet mode. */
  onPanelDismiss?: () => void;
  /**
   * `start` = vertical rail at the inline start; `bottom` = navigation bar; `auto` = bottom below 1024px.
   * @default "auto"
   */
  railPlacement?: 'start' | 'bottom' | 'auto';
  /** Docked contextual toolbar slot, above the workspace. */
  toolbar?: ReactNode;
  /** The host's stage. Read its box with `useWorkspaceViewport()`. */
  workspace: ReactNode;
  /** Absolutely positioned children over the workspace (zoom pill, help button). */
  overlays?: ReactNode;
  /**
   * Regions stop pointerdown / mousedown / mouseup / click / contextmenu propagation so a host's
   * stage handlers never see presses on chrome.
   * @default true
   */
  isolatePointerEvents?: boolean;
}

const stop = (event: SyntheticEvent) => event.stopPropagation();

/** Stops propagation; on buttons also prevents the mousedown default so focus is not stolen mid-drag. */
function stopMouseDown(event: MouseEvent) {
  event.stopPropagation();
  const target = event.target as Element | null;
  if (target?.closest?.('button, [role="button"]')) event.preventDefault();
}

const ISOLATE = { onPointerDown: stop, onMouseDown: stopMouseDown, onMouseUp: stop, onClick: stop, onContextMenu: stop };
/** Panels hold text fields: keep their mousedown default so inputs can take focus. */
const ISOLATE_PANEL = { onPointerDown: stop, onMouseDown: stop, onMouseUp: stop, onClick: stop, onContextMenu: stop };

function useElementSize(ref: RefObject<HTMLElement>): { width: number; height: number } {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => {
      const rect = element.getBoundingClientRect();
      setSize((previous) => (previous.width === rect.width && previous.height === rect.height ? previous : { width: rect.width, height: rect.height }));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return size;
}

export function EditorShell({
  appBar,
  rail,
  railLabel = 'Tools',
  panel,
  panelLabel = 'Panel',
  panelMode = 'auto',
  onPanelDismiss,
  railPlacement = 'auto',
  toolbar,
  workspace,
  overlays,
  isolatePointerEvents = true,
  className = '',
  ...props
}: EditorShellProps) {
  const breakpoint = useBreakpoint();
  const resolvedMode: PanelMode = panelMode !== 'auto' ? panelMode : breakpoint === 'lg' ? 'docked' : breakpoint === 'md' ? 'overlay' : 'sheet';
  const resolvedRail = railPlacement !== 'auto' ? railPlacement : breakpoint === 'sm' ? 'bottom' : 'start';
  const isPanelOpen = panel !== null && panel !== undefined && panel !== false;

  const rootRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(workspaceRef);
  const viewport = useMemo<WorkspaceViewport>(() => ({ ref: workspaceRef, width, height }), [width, height]);
  const shellContext = useMemo<EditorShellContextValue>(() => ({ breakpoint, panelMode: resolvedMode, railPlacement: resolvedRail }), [breakpoint, resolvedMode, resolvedRail]);

  // Overlay mode: a press elsewhere in the shell dismisses the panel. The rail is exempt because its
  // entries toggle the panel themselves; portaled overlays (menus, popovers) live outside the shell.
  useEffect(() => {
    if (!isPanelOpen || resolvedMode !== 'overlay' || !onPanelDismiss) return;
    const root = rootRef.current;
    if (!root) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || railRef.current?.contains(target)) return;
      onPanelDismiss();
    };
    root.addEventListener('pointerdown', onPointerDown, true);
    return () => root.removeEventListener('pointerdown', onPointerDown, true);
  }, [isPanelOpen, resolvedMode, onPanelDismiss]);

  const onPanelKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && !event.defaultPrevented && resolvedMode === 'overlay' && onPanelDismiss) {
      event.preventDefault();
      onPanelDismiss();
    }
  };

  const isolate = isolatePointerEvents ? ISOLATE : undefined;
  const isolatePanel = isolatePointerEvents ? ISOLATE_PANEL : undefined;

  return (
    <EditorShellContext.Provider value={shellContext}>
      <div
        {...props}
        ref={rootRef}
        className={`${styles.shell} ${className}`}
        data-rail={rail ? resolvedRail : undefined}
        data-panel-mode={resolvedMode}
        data-panel-open={isPanelOpen || undefined}
      >
        <header className={styles.appBar} {...isolate}>{appBar}</header>
        {rail && (
          <nav ref={railRef} className={styles.rail} aria-label={railLabel} data-placement={resolvedRail} {...isolate}>
            {rail}
          </nav>
        )}
        {isPanelOpen && resolvedMode !== 'sheet' && (
          <PanelRegionContext.Provider value={resolvedMode}>
            <aside ref={panelRef} className={styles.panel} aria-label={panelLabel} data-mode={resolvedMode} onKeyDown={onPanelKeyDown} {...isolatePanel}>
              {panel}
            </aside>
          </PanelRegionContext.Provider>
        )}
        <main className={styles.main}>
          {toolbar && <div className={styles.toolbar} {...isolate}>{toolbar}</div>}
          <div className={styles.workspaceFrame}>
            <WorkspaceViewportContext.Provider value={viewport}>
              <div ref={workspaceRef} className={styles.workspace}>{workspace}</div>
            </WorkspaceViewportContext.Provider>
            {overlays && <div className={styles.overlays} {...isolate}>{overlays}</div>}
          </div>
        </main>
      </div>
      {resolvedMode === 'sheet' && (
        <SheetOverlay
          className={styles.sheetOverlay}
          isOpen={isPanelOpen}
          onOpenChange={(open) => { if (!open) onPanelDismiss?.(); }}
          position="bottom"
          snapPoints={['60%']}
          preventDismissal={!onPanelDismiss}
        >
          <SheetBackdrop className={styles.sheetBackdrop} />
          <Sheet className={styles.sheet}>
            <SheetContent className={styles.sheetContent} aria-label={panelLabel}>
              <PanelRegionContext.Provider value="sheet">
                <div className={styles.sheetHandle} aria-hidden="true" />
                {panel}
              </PanelRegionContext.Provider>
            </SheetContent>
          </Sheet>
        </SheetOverlay>
      )}
    </EditorShellContext.Provider>
  );
}
