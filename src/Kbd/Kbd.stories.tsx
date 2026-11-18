import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kbd } from './Kbd';

const meta = {
  title: 'Primitives/Display/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'A keyboard shortcut as key chips (label-small, `corner.extra-small`). Accepts `"Mod+Shift+Z"`, glyph strings like `"⇧⌘Z"`, or an array. Screen readers hear the key names, not the glyphs.' } } },
  args: { keys: 'Mod+Z' },
} satisfies Meta<typeof Kbd>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Shortcuts: Story = {
  render: () => (
    <table style={{ color: 'var(--mild-color-text)', font: 'var(--mild-type-body-medium)', borderSpacing: '16px 8px' }}>
      <tbody>
        {[
          ['Undo', 'Mod+Z'],
          ['Redo', '⇧⌘Z'],
          ['Show grid', 'Shift+G'],
          ['Zoom to fit', '⇧1'],
          ['Zoom in', 'Mod+='],
          ['Delete', 'Backspace'],
          ['Keyboard shortcuts', '?'],
        ].map(([label, keys]) => (
          <tr key={label}><td>{label}</td><td><Kbd keys={keys} /></td></tr>
        ))}
      </tbody>
    </table>
  ),
};
