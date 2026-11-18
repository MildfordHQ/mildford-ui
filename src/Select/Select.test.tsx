import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe';
import { Dropdown } from '../Dropdown';
import { Select } from './Select';

describe('Select', () => {
  it('chooses a value with the keyboard', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Select
        label="Grid lines"
        description="Color of grid lines on the artboard."
        items={[{ value: 'blue', label: 'Blue' }, { value: 'grey', label: 'Grey', description: 'Neutral' }]}
        defaultValue="blue"
        onChange={onChange}
      />,
    );
    const trigger = screen.getByRole('button', { name: /Grid lines/ });
    expect(trigger.textContent).toContain('Blue');
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    const listbox = await screen.findByRole('listbox');
    await expectNoAxeViolations(listbox);
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenCalledWith('grey');
    expect(trigger.textContent).toContain('Grey');
  });

  it('marks the field invalid with an error', () => {
    render(<Select label="Palette" items={[{ value: 'a', label: 'A' }]} error="Choose a palette." />);
    expect(screen.getByText('Choose a palette.')).toBeTruthy();
  });
});

describe('Dropdown (deprecated wrapper)', () => {
  const items = [
    { type: 'label' as const, text: 'Built-in Palettes' },
    { label: 'Default', value: 'default' },
    { label: 'Pastels', value: 'pastels' },
    'separator' as const,
    { type: 'label' as const, text: 'Custom Palettes' },
    { label: 'My Palette 1', value: 'custom1', isDisabled: true },
    'separator' as const,
    { label: '+ Create Custom Palette', value: 'create' },
  ];

  it('keeps the Dropdown props: value, onSelect, labels and separators', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    function Harness() {
      const [value, setValue] = useState<string | undefined>('default');
      return <Dropdown items={items} value={value} onSelect={(next) => { onSelect(next); setValue(next); }} />;
    }
    render(<Harness />);
    const trigger = screen.getByRole('button');
    expect(trigger.textContent).toContain('Default');
    await user.click(trigger);
    const listbox = await screen.findByRole('listbox');
    expect(within(listbox).getByRole('group', { name: 'Built-in Palettes' })).toBeTruthy();
    expect(within(listbox).getByRole('option', { name: 'My Palette 1' }).getAttribute('aria-disabled')).toBe('true');
    await user.click(within(listbox).getByRole('option', { name: 'Pastels' }));
    expect(onSelect).toHaveBeenCalledWith('pastels');
    expect(trigger.textContent).toContain('Pastels');
  });

  it('shows label over the selection and placeholder when empty, and disables', () => {
    const { rerender } = render(<Dropdown items={items} placeholder="Pick a palette" />);
    expect(screen.getByRole('button').textContent).toContain('Pick a palette');
    rerender(<Dropdown items={items} value="default" label="Palette" />);
    expect(screen.getByRole('button').textContent).toContain('Palette');
    rerender(<Dropdown items={items} isDisabled className="trigger-x" />);
    expect(screen.getByRole('button').hasAttribute('disabled')).toBe(true);
    expect(screen.getByRole('button').className).toContain('trigger-x');
  });
});
