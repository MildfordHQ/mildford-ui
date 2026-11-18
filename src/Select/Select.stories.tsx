import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Select } from './Select';

const meta = {
  title: 'Primitives/Inputs/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Value choice on RAC `Select` + `ListBox`: label, placeholder, optional icon and description per item, sections, `value`/`onChange` with string values, `error` via `FieldError`. Use `Menu` for actions.' } },
  },
  args: { label: 'Grid lines', items: [{ value: 'blue', label: 'Blue' }, { value: 'grey', label: 'Grey' }] },
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const swatch = (color: string) => <span style={{ display: 'block', width: 16, height: 16, borderRadius: 999, background: color, border: '1px solid var(--md-sys-color-outline-variant)' }} />;

export const PaletteSections: Story = {
  name: 'Sections with icons and descriptions',
  render: function Render() {
    const [value, setValue] = useState('primaries');
    return (
      <Select
        label="Palette"
        description="Switching palettes remaps the design's colors."
        value={value}
        onChange={setValue}
        items={[
          { title: 'Built-in', items: [
            { value: 'primaries', label: 'Primaries', icon: swatch('#0064d4'), description: '8 colors' },
            { value: 'pastels', label: 'Pastels', icon: swatch('#cf263e'), description: '8 colors' },
          ] },
          { title: 'Custom', items: [
            { value: 'sunset', label: 'Sunset', icon: swatch('#8a6100'), description: 'Saved in this browser' },
            { value: 'archived', label: 'Archived', isDisabled: true, description: 'Read-only' },
          ] },
        ]}
      />
    );
  },
};

export const WithError: Story = { args: { error: 'Choose a grid color.', placeholder: 'Choose…' } };
