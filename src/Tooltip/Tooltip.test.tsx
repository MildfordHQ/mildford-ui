import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe';
import { IconButton } from '../IconButton';
import { Kbd } from '../Kbd';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  const renderTooltip = () =>
    render(
      <Tooltip trigger={<IconButton aria-label="Undo">U</IconButton>}>
        Undo <Kbd keys="Mod+Z" />
      </Tooltip>,
    );

  it('shows on keyboard focus and hides on Escape', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderTooltip();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Undo' })).toBe(document.activeElement);
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip.textContent).toContain('Undo');
    expect(screen.getByRole('button', { name: 'Undo' }).getAttribute('aria-describedby')).toBe(tooltip.id);
    await expectNoAxeViolations();

    await user.keyboard('{Escape}');
    act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('shows on mouse hover after the delay', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderTooltip();
    // Hover tooltips follow pointer modality; a mouse user has already pressed something.
    await user.click(document.body);
    await user.hover(screen.getByRole('button', { name: 'Undo' }));
    act(() => { vi.advanceTimersByTime(200); });
    expect(screen.queryByRole('tooltip')).toBeNull();
    act(() => { vi.advanceTimersByTime(400); });
    expect(screen.getByRole('tooltip')).toBeTruthy();
  });

  it('never shows on touch', () => {
    renderTooltip();
    const button = screen.getByRole('button', { name: 'Undo' });
    fireEvent.pointerEnter(button, { pointerType: 'touch' });
    fireEvent.pointerDown(button, { pointerType: 'touch' });
    fireEvent.pointerUp(button, { pointerType: 'touch' });
    act(() => { vi.advanceTimersByTime(2000); });
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
});
