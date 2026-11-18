import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe';
import { Switch } from './Switch';

describe('Switch', () => {
  it('toggles with click and reports onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch onChange={onChange}>Show grid</Switch>);
    const input = screen.getByRole('switch', { name: 'Show grid' }) as HTMLInputElement;
    expect(input.checked).toBe(false);
    await user.click(screen.getByText('Show grid'));
    expect(input.checked).toBe(true);
    expect(onChange).toHaveBeenLastCalledWith(true);
    await user.click(input);
    expect(input.checked).toBe(false);
    expect(onChange).toHaveBeenLastCalledWith(false);
    await expectNoAxeViolations();
  });

  it('toggles with Space', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch defaultSelected onChange={onChange}>Keep shape tool active</Switch>);
    const input = screen.getByRole('switch', { name: 'Keep shape tool active' }) as HTMLInputElement;
    expect(input.checked).toBe(true);
    await user.tab();
    expect(document.activeElement).toBe(input);
    await user.keyboard(' ');
    expect(input.checked).toBe(false);
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it('supports aria-label without a visible label and disabled state', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch aria-label="Show grid" isDisabled onChange={onChange} />);
    const input = screen.getByRole('switch', { name: 'Show grid' }) as HTMLInputElement;
    expect(input.disabled).toBe(true);
    await user.click(input);
    expect(onChange).not.toHaveBeenCalled();
    await expectNoAxeViolations();
  });
});
