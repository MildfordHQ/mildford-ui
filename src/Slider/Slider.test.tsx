import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe';
import { Slider } from './Slider';

const percent = (v: number) => `${Math.round(v * 100)}%`;

describe('Slider', () => {
  it('changes value with arrow keys (linear)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onChangeEnd = vi.fn();
    render(<Slider label="Stroke width" minValue={0} maxValue={20} defaultValue={4} showOutput onChange={onChange} onChangeEnd={onChangeEnd} />);
    const slider = screen.getByRole('slider', { name: 'Stroke width' }) as HTMLInputElement;
    expect(slider.value).toBe('4');
    await user.tab();
    expect(document.activeElement).toBe(slider);
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(slider.value).toBe('6');
    expect(onChange).toHaveBeenLastCalledWith(6);
    expect(onChangeEnd).toHaveBeenLastCalledWith(6);
    await user.keyboard('{ArrowLeft}');
    expect(onChange).toHaveBeenLastCalledWith(5);
    expect(document.querySelector('output')?.textContent).toBe('5');
    await expectNoAxeViolations();
  });

  it('uses formatValue for aria-valuetext and the output', async () => {
    render(<Slider aria-label="Zoom" minValue={0.1} maxValue={8} scale="log" value={1.28} formatValue={percent} showOutput />);
    const slider = screen.getByRole('slider', { name: 'Zoom' });
    expect(slider.getAttribute('aria-valuetext')).toBe('128%');
    expect(document.querySelector('output')?.textContent).toBe('128%');
    await expectNoAxeViolations();
  });

  it('maps a log scale: min, max and geometric midpoint', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Slider aria-label="Zoom" scale="log" minValue={0.1} maxValue={10} defaultValue={1} formatValue={percent} onChange={onChange} />);
    const slider = screen.getByRole('slider', { name: 'Zoom' }) as HTMLInputElement;
    // 1 is the geometric midpoint of 0.1..10: half-way along the internal 0..1000 track.
    expect(slider.value).toBe('500');
    expect(slider.getAttribute('aria-valuetext')).toBe('100%');
    await user.tab();
    await user.keyboard('{End}');
    expect(onChange).toHaveBeenLastCalledWith(10);
    expect(slider.getAttribute('aria-valuetext')).toBe('1000%');
    await user.keyboard('{Home}');
    expect(onChange).toHaveBeenLastCalledWith(0.1);
    expect(slider.getAttribute('aria-valuetext')).toBe('10%');
    await user.keyboard('{ArrowRight}');
    // One log step = 1% of the track: 0.1 · 100^(0.01).
    expect(onChange.mock.lastCall![0]).toBeCloseTo(0.1 * 100 ** 0.01, 6);
  });

  it('keeps consumer units when controlled', async () => {
    const user = userEvent.setup();
    function Zoom() {
      const [zoom, setZoom] = useState(1);
      return (
        <>
          <Slider aria-label="Zoom" scale="log" minValue={0.1} maxValue={8} value={zoom} onChange={setZoom} formatValue={percent} />
          <span data-testid="zoom">{zoom.toFixed(2)}</span>
        </>
      );
    }
    render(<Zoom />);
    const slider = screen.getByRole('slider', { name: 'Zoom' });
    expect(slider.getAttribute('aria-valuetext')).toBe('100%');
    await user.tab();
    await user.keyboard('{End}');
    expect(screen.getByTestId('zoom').textContent).toBe('8.00');
    expect(slider.getAttribute('aria-valuetext')).toBe('800%');
  });

  it('is inert when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Slider label="Opacity" defaultValue={50} isDisabled onChange={onChange} />);
    const slider = screen.getByRole('slider', { name: 'Opacity' }) as HTMLInputElement;
    expect(slider.disabled).toBe(true);
    await user.tab();
    expect(document.activeElement).not.toBe(slider);
    await user.keyboard('{ArrowRight}');
    expect(onChange).not.toHaveBeenCalled();
    await expectNoAxeViolations();
  });
});
