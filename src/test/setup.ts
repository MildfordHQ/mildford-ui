import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

// jsdom lacks the layout observers and media queries that overlays and the shell use.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Assigned (not vi.stubGlobal) so tests that unstub their own globals keep them.
if (!('ResizeObserver' in globalThis)) {
  (globalThis as { ResizeObserver?: unknown }).ResizeObserver = ResizeObserverStub;
}

// React Aria's Sheet tracks snap points with IntersectionObserver.
class IntersectionObserverStub {
  readonly root = null;
  readonly rootMargin = '0px';
  readonly thresholds = [0];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}

if (!('IntersectionObserver' in globalThis)) {
  (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = IntersectionObserverStub;
}

if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

if (typeof window !== 'undefined') {
  // React Aria escapes ids with CSS.escape, which jsdom lacks.
  const css = (globalThis.CSS ?? {}) as { escape?: (value: string) => string };
  if (!css.escape) css.escape = (value: string) => value.replace(/([^\w-])/g, '\\$1');
  (globalThis as { CSS?: unknown }).CSS = css;
  // axe probes canvas for icon ligatures; jsdom has no canvas implementation.
  HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext;
}

// jsdom has no PointerEvent; without it React Aria falls back to mouse/touch events and simulated
// touch pointers (long press) are ignored.
if (typeof window !== 'undefined' && !('PointerEvent' in window)) {
  class PointerEventPolyfill extends MouseEvent {
    readonly pointerId: number;
    readonly pointerType: string;
    readonly width: number;
    readonly height: number;
    readonly pressure: number;
    readonly isPrimary: boolean;
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerId = init.pointerId ?? 1;
      this.pointerType = init.pointerType ?? 'mouse';
      this.width = init.width ?? 1;
      this.height = init.height ?? 1;
      this.pressure = init.pressure ?? 0;
      this.isPrimary = init.isPrimary ?? true;
    }
  }
  (window as unknown as { PointerEvent: unknown }).PointerEvent = PointerEventPolyfill;
}
