import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('presses with mouse and keyboard', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<IconButton aria-label="Zoom to fit" onPress={onPress}>F</IconButton>);
    const button = screen.getByRole('button', { name: 'Zoom to fit' });
    await user.click(button);
    button.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onPress).toHaveBeenCalledTimes(3);
  });

  it('does not press when disabled', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<IconButton aria-label="Redo" isDisabled onPress={onPress}>R</IconButton>);
    await user.click(screen.getByRole('button', { name: 'Redo' }));
    expect(onPress).not.toHaveBeenCalled();
  });

  it.each(['standard', 'filled', 'tonal', 'outlined'] as const)('%s variant is accessible', async (variant) => {
    const { container } = render(<IconButton aria-label="Delete" variant={variant} tooltip="Delete" shortcut="Backspace">D</IconButton>);
    await expectNoAxeViolations(container);
  });
});
