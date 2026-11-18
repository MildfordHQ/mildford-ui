import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe';
import { Chip } from './Chip';

const glyph = <svg viewBox="0 0 10 10"><path d="M0 0h10v10H0Z" /></svg>;

describe('Chip', () => {
  it('assist chip calls onPress from pointer and keyboard', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<Chip icon={glyph} onPress={onPress}>Primaries</Chip>);
    const chip = screen.getByRole('button', { name: 'Primaries' });
    await user.click(chip);
    expect(onPress).toHaveBeenCalledTimes(1);
    await user.keyboard('{Enter}');
    expect(onPress).toHaveBeenCalledTimes(2);
    await expectNoAxeViolations();
  });

  it('disabled assist chip does not press', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<Chip isDisabled onPress={onPress}>Primaries</Chip>);
    await user.click(screen.getByRole('button', { name: 'Primaries' }));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('filter chip toggles aria-pressed and shows the check when selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Chip variant="filter" onChange={onChange}>Shapes</Chip>);
    const chip = screen.getByRole('button', { name: 'Shapes' });
    expect(chip.getAttribute('aria-pressed')).toBe('false');
    expect(chip.querySelector('svg')).toBeNull();
    await user.click(chip);
    expect(chip.getAttribute('aria-pressed')).toBe('true');
    expect(onChange).toHaveBeenLastCalledWith(true);
    expect(chip.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    await user.keyboard(' ');
    expect(chip.getAttribute('aria-pressed')).toBe('false');
    await expectNoAxeViolations();
  });

  it('static chip is a non-focusable span that takes a consumer role', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Chip isStatic icon={glyph} role="status">Saved locally</Chip>
        <button type="button">After</button>
      </>,
    );
    const status = screen.getByRole('status');
    expect(status.tagName).toBe('SPAN');
    expect(status.textContent).toBe('Saved locally');
    expect(status.hasAttribute('tabindex')).toBe(false);
    expect(screen.queryByRole('button', { name: 'Saved locally' })).toBeNull();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'After' }));
    await expectNoAxeViolations();
  });
});
