import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe';
import { EditorShell } from './EditorShell';
import { useWorkspaceViewport } from './EditorShellContext';

function Viewport() {
  const { width, height } = useWorkspaceViewport();
  return <output aria-label="viewport">{`${width}x${height}`}</output>;
}

describe('EditorShell', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('renders the region landmarks', async () => {
    render(
      <EditorShell
        panelMode="docked"
        appBar={<span>Bar</span>}
        rail={<button type="button">Select</button>}
        panel={<p>Palette body</p>}
        panelLabel="Palette panel"
        toolbar={<span>Toolbar</span>}
        workspace={<div>Stage</div>}
      />,
    );
    expect(screen.getByRole('banner').textContent).toContain('Bar');
    expect(screen.getByRole('navigation', { name: 'Tools' })).toBeTruthy();
    expect(screen.getByRole('complementary', { name: 'Palette panel' }).textContent).toContain('Palette body');
    expect(screen.getByRole('main').textContent).toContain('Stage');
    await expectNoAxeViolations();
  });

  it('stops pointer events in chrome regions from reaching the host', () => {
    const onHostPointerDown = vi.fn();
    const onHostClick = vi.fn();
    render(
      <div onPointerDown={onHostPointerDown} onClick={onHostClick}>
        <EditorShell panelMode="docked" appBar={<button type="button">Undo</button>} toolbar={<button type="button">Fit</button>} workspace={<div>Stage</div>} />
      </div>,
    );
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Undo' }));
    fireEvent.click(screen.getByRole('button', { name: 'Fit' }));
    expect(onHostPointerDown).not.toHaveBeenCalled();
    expect(onHostClick).not.toHaveBeenCalled();

    fireEvent.pointerDown(screen.getByText('Stage'));
    expect(onHostPointerDown).toHaveBeenCalledTimes(1);
  });

  it('can leave pointer events alone', () => {
    const onHostPointerDown = vi.fn();
    render(
      <div onPointerDown={onHostPointerDown}>
        <EditorShell isolatePointerEvents={false} appBar={<button type="button">Undo</button>} workspace={<div />} />
      </div>,
    );
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Undo' }));
    expect(onHostPointerDown).toHaveBeenCalledTimes(1);
  });

  it('reports the workspace box and updates on resize', () => {
    let notify: () => void = () => {};
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) { notify = callback; }
        observe() {}
        disconnect() {}
      },
    );
    let box = { width: 800, height: 600 };
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => ({ ...box, x: 0, y: 0, top: 0, left: 0, right: box.width, bottom: box.height, toJSON: () => box }) as DOMRect);

    render(<EditorShell appBar={null} workspace={<Viewport />} />);
    expect(screen.getByLabelText('viewport').textContent).toContain('800x600');

    box = { width: 480, height: 600 };
    act(() => notify());
    expect(screen.getByLabelText('viewport').textContent).toContain('480x600');
  });

  it('dismisses an overlay panel on Escape and on a press outside it, but not on the rail', () => {
    const onPanelDismiss = vi.fn();
    render(
      <EditorShell
        panelMode="overlay"
        onPanelDismiss={onPanelDismiss}
        appBar={null}
        rail={<button type="button">Palette</button>}
        panel={<button type="button">Inside</button>}
        workspace={<div>Stage</div>}
      />,
    );
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Inside' }));
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Palette' }));
    expect(onPanelDismiss).not.toHaveBeenCalled();

    fireEvent.keyDown(screen.getByRole('button', { name: 'Inside' }), { key: 'Escape' });
    expect(onPanelDismiss).toHaveBeenCalledTimes(1);

    fireEvent.pointerDown(screen.getByText('Stage'));
    expect(onPanelDismiss).toHaveBeenCalledTimes(2);
  });

  it('does not dismiss a docked panel on outside press', () => {
    const onPanelDismiss = vi.fn();
    render(<EditorShell panelMode="docked" onPanelDismiss={onPanelDismiss} appBar={null} panel={<p>Body</p>} workspace={<div>Stage</div>} />);
    fireEvent.pointerDown(screen.getByText('Stage'));
    expect(onPanelDismiss).not.toHaveBeenCalled();
  });
});
