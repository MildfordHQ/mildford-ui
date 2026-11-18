import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Dropdown } from './Dropdown';
import type { DropdownItemType } from './Dropdown';

const meta = {
  title: 'Primitives/Inputs/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '**Deprecated:** use `Select` for value choice or `Menu` for actions. `Dropdown` keeps its flat item-list props as a thin wrapper over `Select`. Labels become listbox section headers and separators become section dividers.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const simpleItems: DropdownItemType[] = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
];

const paletteItems: (DropdownItemType | 'separator' | { type: 'label'; text: string })[] = [
  { type: 'label', text: 'Built-in Palettes' },
  { label: 'Default', value: 'default' },
  { label: 'Pastels', value: 'pastels' },
  { label: 'Earth Tones', value: 'earth' },
  'separator',
  { type: 'label', text: 'Custom Palettes' },
  { label: 'My Palette 1', value: 'custom1' },
  { label: 'My Palette 2', value: 'custom2' },
  'separator',
  { label: '+ Create Custom Palette', value: 'create' },
];

export const Basic: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | undefined>(args.value);

    return (
      <Dropdown
        {...args}
        value={value}
        onSelect={setValue}
      />
    );
  },
  args: {
    items: simpleItems,
    placeholder: 'Select an option',
  },
};

export const WithValue: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | undefined>(args.value);

    return (
      <Dropdown
        {...args}
        value={value}
        onSelect={setValue}
      />
    );
  },
  args: {
    items: simpleItems,
    value: 'option2',
  },
};

export const WithLabel: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | undefined>(args.value);

    return (
      <Dropdown
        {...args}
        value={value}
        onSelect={setValue}
      />
    );
  },
  args: {
    label: 'Custom Label',
    items: simpleItems,
  },
};

export const Disabled: Story = {
  args: {
    items: simpleItems,
    isDisabled: true,
    placeholder: 'Disabled dropdown',
  },
};

export const WithSeparators: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | undefined>(args.value);

    return (
      <Dropdown
        {...args}
        value={value}
        onSelect={setValue}
      />
    );
  },
  args: {
    items: paletteItems,
    placeholder: 'Select a palette',
  },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState<string>();
    
    return (
      <div style={{ minWidth: '300px' }}>
        <Dropdown
          items={simpleItems}
          value={value}
          onSelect={setValue}
          placeholder="Select an option"
        />
        <p style={{ marginTop: '20px', fontSize: '13px', color: 'var(--mild-color-text-muted)' }}>
          Selected: {value || 'None'}
        </p>
      </div>
    );
  },
};

export const EnvironmentSelector: Story = {
  render: () => {
    const [value, setValue] = useState<string>('staging');
    return <Dropdown items={[{ label: 'Development', value: 'development' }, { label: 'Staging', value: 'staging' }, 'separator', { label: 'Production', value: 'production' }]} value={value} onSelect={setValue} />;
  },
};

export const PaletteSelector: Story = {
  render: () => {
    const [value, setValue] = useState<string>('default');
    
    const selectedItem = paletteItems.find(
      (item): item is DropdownItemType => 
        typeof item === 'object' && 'value' in item && item.value === value
    );
    
    return (
      <div style={{ minWidth: '300px' }}>
        <Dropdown
          items={paletteItems}
          value={value}
          onSelect={setValue}
        />
        <p style={{ marginTop: '20px', fontSize: '13px', color: 'var(--mild-color-text-muted)' }}>
          Current palette: {selectedItem?.label || 'None'}
        </p>
      </div>
    );
  },
};
