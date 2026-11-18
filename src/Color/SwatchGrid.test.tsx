import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe';
import { SwatchGrid, type SwatchGridColor } from './SwatchGrid';

const PALETTE: SwatchGridColor[] = [
  { color: 'transparent', id: 'c0' },
  { color: '#111112', name: 'Ink', id: 'c1' },
  { color: '#0064d4', id: 'c2' },
  { color: '#cf263e', id: 'c3' },
];

describe('SwatchGrid', () => {
  it('selects with a click and reports the color as given', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SwatchGrid colors={['#111112', '#0064d4', '#cf263e']} onChange={onChange} aria-label="Palette" />);
    const options = screen.getAllByRole('option');
    await user.click(options[1]);
    expect(onChange).toHaveBeenCalledWith('#0064d4', { id: undefined, index: 1 });
    expect(options[1].getAttribute('aria-selected')).toBe('true');
  });

  it('selects with the keyboard and reports the id', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SwatchGrid colors={PALETTE} defaultValue="c1" onChange={onChange} aria-label="Palette" />);
    const options = screen.getAllByRole('option');
    expect(options[1].getAttribute('aria-selected')).toBe('true');
    await user.tab();
    expect(document.activeElement).toBe(options[1]);
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(options[2]);
    await user.keyboard(' ');
    expect(onChange).toHaveBeenLastCalledWith('#0064d4', { id: 'c2', index: 2 });
  });

  it('names transparent and named entries', () => {
    render(<SwatchGrid colors={PALETTE} aria-label="Palette" />);
    expect(screen.getByRole('img', { name: 'Transparent' }).hasAttribute('data-transparent')).toBe(true);
    expect(screen.getByRole('img', { name: 'Ink' })).toBeTruthy();
    expect(screen.getByRole('option', { name: 'Transparent' })).toBeTruthy();
  });

  it('reorders with Alt+Arrow and keeps focus on the moved swatch', async () => {
    const onReorder = vi.fn();
    function Reorderable() {
      const [colors, setColors] = useState(PALETTE);
      return (
        <SwatchGrid
          colors={colors}
          aria-label="Palette"
          onReorder={(from, to) => {
            onReorder(from, to);
            setColors((list) => {
              const next = [...list];
              const [moved] = next.splice(from, 1);
              next.splice(to, 0, moved);
              return next;
            });
          }}
        />
      );
    }
    const user = userEvent.setup();
    render(<Reorderable />);
    await user.click(screen.getAllByRole('option')[1]);
    await user.keyboard('{Alt>}{ArrowRight}{/Alt}');
    expect(onReorder).toHaveBeenCalledWith(1, 2);
    const options = screen.getAllByRole('option');
    expect(options[2].textContent).toBe('');
    expect(options[2].querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('Ink');
    expect(document.activeElement).toBe(options[2]);

    await user.keyboard('{Alt>}{ArrowLeft}{/Alt}');
    expect(onReorder).toHaveBeenLastCalledWith(2, 1);
    expect(document.activeElement).toBe(screen.getAllByRole('option')[1]);

    // Plain arrows keep RAC navigation and do not reorder.
    await user.keyboard('{ArrowRight}');
    expect(onReorder).toHaveBeenCalledTimes(2);
    expect(document.activeElement).toBe(screen.getAllByRole('option')[2]);
  });

  it('does not reorder past the ends', async () => {
    const user = userEvent.setup();
    const onReorder = vi.fn();
    render(<SwatchGrid colors={PALETTE} onReorder={onReorder} aria-label="Palette" />);
    await user.click(screen.getAllByRole('option')[0]);
    await user.keyboard('{Alt>}{ArrowLeft}{/Alt}');
    expect(onReorder).not.toHaveBeenCalled();
  });

  it('is accessible', async () => {
    const { container } = render(<SwatchGrid colors={PALETTE} value="c2" aria-label="Palette" />);
    await expectNoAxeViolations(container);
  });
});
