import { useSyncExternalStore } from 'react';

/** Mirrors `--mild-breakpoint-md` / `--mild-breakpoint-lg` (custom properties cannot drive media queries). */
export const BREAKPOINT_MD = 1024;
export const BREAKPOINT_LG = 1280;

export type Breakpoint = 'sm' | 'md' | 'lg';

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {};
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false),
    () => false,
  );
}

/** Breakpoint widths: `lg` ≥ 1280, `md` 1024–1279, `sm` < 1024. Server render assumes `lg`. */
export function useBreakpoint(): Breakpoint {
  const atLeastMd = useMediaQuery(`(min-width: ${BREAKPOINT_MD}px)`);
  const atLeastLg = useMediaQuery(`(min-width: ${BREAKPOINT_LG}px)`);
  if (typeof window === 'undefined' || !window.matchMedia) return 'lg';
  return atLeastLg ? 'lg' : atLeastMd ? 'md' : 'sm';
}
