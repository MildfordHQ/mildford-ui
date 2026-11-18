import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe';
import { DualSwatch } from './DualSwatch';

describe('DualSwatch', () => {
  it('labels both roles and swaps', async () => {
    const user = userEvent.setup();
    const onSwap = vi.fn();
    const { container } = render(<DualSwatch foreground="#0064d4" foregroundName="#1" background="transparent" onSwap={onSwap} />);
    expect(screen.getByRole('group', { name: 'Fill #1 · Stroke transparent' })).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Fill: #1' })).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Stroke: transparent' })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Swap Fill and Stroke' }));
    expect(onSwap).toHaveBeenCalledTimes(1);
    await expectNoAxeViolations(container);
  });

  it('becomes one button with onPress and custom labels', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    const { container } = render(
      <DualSwatch size={32} foreground="#111112" background="#ffffff" foregroundLabel="Stroke" backgroundLabel="Background" onPress={onPress} />,
    );
    const button = screen.getByRole('button', { name: /^Stroke .+ · Background .+$/ });
    button.focus();
    await user.keyboard('{Enter}');
    expect(onPress).toHaveBeenCalledTimes(1);
    await expectNoAxeViolations(container);
  });
});
