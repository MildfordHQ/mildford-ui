import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { Kbd } from '../Kbd';
import { demoIcons } from '../stories/demoIcons';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Primitives/Menus and overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'M3 plain tooltip on RAC `TooltipTrigger`: `inverse-surface`, label-medium, `corner.small`, 8px offset, 500ms delay (instant when another tooltip was just open). Shows on hover and keyboard focus, hides on Escape, never on touch. Never the only label: the trigger keeps its `aria-label`.',
      },
    },
  },
  args: {
    trigger: <IconButton aria-label="Undo"><Icon>{demoIcons.undo}</Icon></IconButton>,
    children: <>Undo <Kbd keys="Mod+Z" /></>,
  },
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Placements: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      {(['bottom', 'right', 'top', 'left'] as const).map((placement) => (
        <Tooltip key={placement} placement={placement} trigger={<IconButton variant="outlined" aria-label={`Tooltip ${placement}`}><Icon>{demoIcons.info}</Icon></IconButton>}>
          Placement {placement}
        </Tooltip>
      ))}
    </div>
  ),
};
