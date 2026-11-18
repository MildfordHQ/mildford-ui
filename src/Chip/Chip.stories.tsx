import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '../Icon';
import { demoIcons } from '../stories/demoIcons';
import { Chip } from './Chip';

const meta = {
  title: 'Primitives/Actions/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'M3 assist and filter chips: 32px tall, `corner.full` (pill), label-large, optional 20px leading icon. The assist chip is a RAC `Button` (`elevated` for the tonal-shadow form); `isStatic` renders the same look as a non-interactive `<span>` for read-only status (put `role="status"` on it yourself); `variant="filter"` is a RAC `ToggleButton` (`aria-pressed`) that shows a leading check when selected.',
      },
    },
  },
  args: { children: 'Primaries', icon: <Icon size={20}>{demoIcons.palette}</Icon> },
} satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: 'Palette chip (assist)' };

export const Elevated: Story = { args: { elevated: true } };

export const StatusChip: Story = {
  name: 'Status chip (static)',
  render: () => (
    <Chip isStatic role="status" icon={<Icon size={20}>{demoIcons.history}</Icon>}>Saved locally</Chip>
  ),
};

export const Filters: Story = {
  name: 'Filter chips',
  render: () => (
    <div role="group" aria-label="Show in library" style={{ display: 'flex', gap: 8 }}>
      <Chip variant="filter" defaultSelected icon={<Icon size={20}>{demoIcons.shapes}</Icon>}>Shapes</Chip>
      <Chip variant="filter" icon={<Icon size={20}>{demoIcons.gradient}</Icon>}>Gradients</Chip>
      <Chip variant="filter" isDisabled>Images</Chip>
    </div>
  ),
};

export const ContextualToolbar: Story = {
  name: 'In a contextual toolbar',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 48, padding: '0 16px', background: 'var(--mild-color-surface)', borderBottom: '1px solid var(--mild-color-divider)', color: 'var(--mild-color-text-muted)', font: 'var(--mild-type-body-small)' }}>
      <Chip icon={<Icon size={20}>{demoIcons.palette}</Icon>}>Primaries</Chip>
      <span>12 shapes on the artboard</span>
      <span style={{ marginInlineStart: 'auto' }}>
        <Chip isStatic role="status" icon={<Icon size={20}>{demoIcons.history}</Icon>}>Saved locally</Chip>
      </span>
    </div>
  ),
};
