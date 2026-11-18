import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe';
import { ColorSwatch, ColorSwatchButton } from './ColorSwatch';

describe('ColorSwatch', () => {
  it('names a transparent swatch "Transparent" and marks it for the checkerboard', () => {
    render(<ColorSwatch color="transparent" />);
    const swatch = screen.getByRole('img', { name: 'Transparent' });
    expect(swatch.hasAttribute('data-transparent')).toBe(true);
  });

  it('treats an alpha-0 color as transparent', () => {
    render(<ColorSwatch color="#0064d400" />);
    expect(screen.getByRole('img', { name: 'Transparent' })).toBeTruthy();
  });

  it('uses the built-in color name, or the override', () => {
    render(
      <>
        <ColorSwatch color="#ffffff" />
        <ColorSwatch color="#0064d4" colorName="Cobalt" />
        <ColorSwatch color="#0064d4" aria-label="#1" />
      </>,
    );
    const names = screen.getAllByRole('img').map((img) => img.getAttribute('aria-label'));
    expect(names[0]).toMatch(/white/i);
    expect(names[1]).toBe('Cobalt');
    expect(names[2]).toBe('#1');
  });

  it('is accessible in every size and shape', async () => {
    const { container } = render(
      <>
        {([24, 32, 40] as const).map((size) => (
          <ColorSwatch key={size} color="#cf263e" size={size} shape={size === 32 ? 'square' : 'circle'} />
        ))}
        <ColorSwatch color="transparent" />
      </>,
    );
    await expectNoAxeViolations(container);
  });
});

describe('ColorSwatchButton', () => {
  it('presses and is accessible', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    const { container } = render(<ColorSwatchButton aria-label="Fill color" color="#0064d4" showChevron onPress={onPress} />);
    await user.click(screen.getByRole('button', { name: 'Fill color' }));
    expect(onPress).toHaveBeenCalledTimes(1);
    await expectNoAxeViolations(container);
  });
});
