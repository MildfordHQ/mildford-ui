import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe';
import { MenuItem, MenuSection } from '../Menu';
import { ContextMenu } from './ContextMenu';

function Artboard({ onAction = vi.fn(), onStagePointerDown = vi.fn() }) {
  return (
    <ContextMenu
      role="application"
      aria-label="Artboard"
      onAction={onAction}
      menu={
        <>
          <MenuSection layout="grid" columns={3} title="Insert shape" aria-label="Insert shape">
            <MenuItem id="square">Square</MenuItem>
            <MenuItem id="circle">Circle</MenuItem>
            <MenuItem id="triangle">Triangle</MenuItem>
          </MenuSection>
          <MenuSection aria-label="Artboard">
            <MenuItem id="select-all">Select all</MenuItem>
            <MenuItem id="paste" isDisabled>Paste here</MenuItem>
          </MenuSection>
        </>
      }
    >
      <div data-testid="stage" onPointerDown={onStagePointerDown} style={{ width: 400, height: 300 }} />
    </ContextMenu>
  );
}

describe('ContextMenu', () => {
  it('opens on right-click and runs the chosen action', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<Artboard onAction={onAction} />);
    fireEvent.contextMenu(screen.getByTestId('stage'), { clientX: 120, clientY: 80 });
    const menu = await screen.findByRole('menu');
    // Outside content is aria-hidden while the menu is open, hence `hidden: true`.
    expect(menu.getAttribute('aria-labelledby')).toBe(screen.getByRole('application', { name: 'Artboard', hidden: true }).id);
    await expectNoAxeViolations(menu);
    await user.click(screen.getByRole('menuitem', { name: 'Select all' }));
    expect(onAction.mock.calls[0][0]).toBe('select-all');
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('opens from the keyboard when the wrapper is focused and Escape returns focus to it', async () => {
    const user = userEvent.setup();
    render(<Artboard />);
    const wrapper = screen.getByRole('application', { name: 'Artboard' });
    await user.tab();
    expect(document.activeElement).toBe(wrapper);
    // Shift+F10 and the Menu key make the browser fire a contextmenu event on the focused element.
    fireEvent.contextMenu(wrapper);
    expect(await screen.findByRole('menu')).toBeTruthy();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(wrapper));
  });

  it("does not swallow the host's own pointer handlers", () => {
    const onStagePointerDown = vi.fn();
    render(<Artboard onStagePointerDown={onStagePointerDown} />);
    fireEvent.pointerDown(screen.getByTestId('stage'), { button: 0, pointerType: 'mouse' });
    expect(onStagePointerDown).toHaveBeenCalledTimes(1);
  });

  // iOS fires no contextmenu event, so React Aria opens on its own long press there (Android and
  // desktop touch screens fire contextmenu, covered above). Whether a tap also reaches the stage is
  // browser behaviour: the Storybook story's pointer counter is the real check.
  it('opens on an iOS touch long press', () => {
    vi.useFakeTimers();
    Object.defineProperty(window.navigator, 'platform', { value: 'iPhone', configurable: true });
    render(<Artboard />);
    const stage = screen.getByTestId('stage');
    fireEvent.pointerDown(stage, { pointerType: 'touch', pointerId: 1, button: 0, isPrimary: true, clientX: 10, clientY: 10 });
    act(() => { vi.advanceTimersByTime(600); });
    fireEvent.pointerUp(stage, { pointerType: 'touch', pointerId: 1, button: 0, isPrimary: true, clientX: 10, clientY: 10 });
    expect(screen.queryByRole('menu')).toBeTruthy();
    delete (window.navigator as { platform?: string }).platform;
    vi.useRealTimers();
  });

  it('renders a plain labelled region when disabled', () => {
    render(<ContextMenu role="application" aria-label="Artboard" isDisabled menu={null}><p>Stage</p></ContextMenu>);
    fireEvent.contextMenu(screen.getByText('Stage'));
    expect(screen.queryByRole('menu')).toBeNull();
    expect(screen.getByRole('application', { name: 'Artboard' })).toBeTruthy();
  });
});
