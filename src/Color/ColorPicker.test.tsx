import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe';
import { ColorSwatchButton } from './ColorSwatch';
import { ColorPicker, ColorPickerPopover } from './ColorPicker';

describe('ColorPicker', () => {
  it('rejects non-hex input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ColorPicker defaultValue="#111112" onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: 'Hex' }) as HTMLInputElement;
    await user.clear(input);
    await user.type(input, 'zzz');
    expect(input.value).toBe('');
    await user.tab();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('shows an error state for an incomplete hex value', async () => {
    const user = userEvent.setup();
    render(<ColorPicker defaultValue="#111112" />);
    const input = screen.getByRole('textbox', { name: 'Hex' }) as HTMLInputElement;
    await user.clear(input);
    await user.type(input, '#12345');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('Enter a 3- or 6-digit hex color')).toBeTruthy();
    await user.type(input, '6');
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  it('commits a typed hex value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ColorPicker defaultValue="#111112" onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: 'Hex' });
    await user.clear(input);
    await user.type(input, '#0064d4{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('#0064d4');
  });

  it('picks from swatches', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ColorPicker defaultValue="#111112" swatches={['#111112', '#cf263e', 'transparent']} onChange={onChange} />);
    await user.click(screen.getByRole('option', { name: 'Transparent' }));
    expect(onChange).toHaveBeenLastCalledWith('transparent');
  });

  it('is accessible', async () => {
    const { container } = render(<ColorPicker defaultValue="#0064d4" swatches={['#111112', '#0064d4']} />);
    await expectNoAxeViolations(container);
  });
});

describe('ColorPickerPopover', () => {
  it('opens from its trigger and is accessible', async () => {
    const user = userEvent.setup();
    render(
      <ColorPickerPopover
        trigger={<ColorSwatchButton aria-label="Background" color="#ffffff" showChevron />}
        label="Background color"
        defaultValue="#ffffff"
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Background' }));
    const dialog = await screen.findByRole('dialog', { name: 'Background color' });
    expect(screen.getByRole('textbox', { name: 'Hex' })).toBeTruthy();
    await expectNoAxeViolations(dialog);
  });
});
