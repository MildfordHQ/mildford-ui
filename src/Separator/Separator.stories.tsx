import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from './Separator';

const meta = {
  title: 'Primitives/Display/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'A 1px `outline-variant` divider (RAC `Separator`). Vertical separators are 24px tall with 8px margins, as between toolbar groups.' } } },
} satisfies Meta<typeof Separator>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div style={{ width: 320, color: 'var(--mild-color-text)', font: 'var(--mild-type-body-medium)' }}>
      <p>Save a copy</p>
      <Separator />
      <p>Export PNG</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', height: 48, color: 'var(--mild-color-text)', font: 'var(--mild-type-label-large)' }}>
      <span>Fill</span>
      <Separator orientation="vertical" />
      <span>Stroke</span>
      <Separator orientation="vertical" />
      <span>Corners</span>
    </div>
  ),
};
