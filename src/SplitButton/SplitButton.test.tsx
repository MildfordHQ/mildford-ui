import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe';
import { MenuItem } from '../Menu';
import { SplitButton } from './SplitButton';

const renderSplit = (props: Partial<React.ComponentProps<typeof SplitButton>> = {}) =>
  render(
    <SplitButton
      menuLabel="Export options"
      menu={[
        <MenuItem key="png" id="png">Export PNG</MenuItem>,
        <MenuItem key="copy" id="copy">Save a copy</MenuItem>,
      ]}
      {...props}
    >
      Export
    </SplitButton>,
  );

describe('SplitButton', () => {
  it('is one group named by the main label, with both halves reachable by keyboard', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    renderSplit({ onPress });
    const group = screen.getByRole('group', { name: 'Export' });
    expect(group).toBeTruthy();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Export' }));
    await user.keyboard('{Enter}');
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).toBeNull();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Export options' }));
    await expectNoAxeViolations(group);
  });

  it('opens the menu from the trailing half only', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    renderSplit({ onAction });
    await user.click(screen.getByRole('button', { name: 'Export' }));
    expect(screen.queryByRole('menu')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Export options' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Save a copy' }));
    expect(onAction.mock.calls[0][0]).toBe('copy');
  });

  it('keeps the menu available when the main action is disabled', async () => {
    const user = userEvent.setup();
    renderSplit({ isDisabled: true });
    expect(screen.getByRole('button', { name: 'Export' }).hasAttribute('disabled')).toBe(true);
    await user.click(screen.getByRole('button', { name: 'Export options' }));
    expect(await screen.findByRole('menu')).toBeTruthy();
  });
});
