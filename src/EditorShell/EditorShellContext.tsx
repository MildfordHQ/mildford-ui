import { createContext, useContext, type RefObject } from 'react';
import type { Breakpoint } from '../internal/useMediaQuery';

export type PanelMode = 'docked' | 'overlay' | 'sheet';

export interface WorkspaceViewport {
  /** The workspace element: the host's stage viewport. */
  ref: RefObject<HTMLDivElement>;
  width: number;
  height: number;
}

export interface EditorShellContextValue {
  breakpoint: Breakpoint;
  /** Resolved panel mode (`auto` already mapped to a breakpoint). */
  panelMode: PanelMode;
  /** Where the rail renders: the start edge, or the bottom navigation bar below 1024px. */
  railPlacement: 'start' | 'bottom';
}

export const WorkspaceViewportContext = createContext<WorkspaceViewport | null>(null);
export const EditorShellContext = createContext<EditorShellContextValue | null>(null);
/** Set inside the shell's panel region so `SidePanel` lets the shell own placement and dismissal. */
export const PanelRegionContext = createContext<PanelMode | null>(null);

/** The workspace box of the nearest `EditorShell`, updated on resize. */
export function useWorkspaceViewport(): WorkspaceViewport {
  const value = useContext(WorkspaceViewportContext);
  if (!value) throw new Error('useWorkspaceViewport must be used inside an EditorShell workspace.');
  return value;
}

/** Layout state of the nearest `EditorShell`, or `null` outside one. */
export function useEditorShell(): EditorShellContextValue | null {
  return useContext(EditorShellContext);
}

export function usePanelRegion(): PanelMode | null {
  return useContext(PanelRegionContext);
}
