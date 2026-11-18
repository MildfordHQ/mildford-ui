import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { demoIcons } from '../stories/demoIcons';
import { ButtonGroup } from './ButtonGroup';

const meta = {
  title: 'Primitives/Actions/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Visual grouping only. `connected` collapses inner corners with 2px gaps (M3 connected button group). With `aria-label` it is exposed as a `group`.' } } },
  args: { children: null },
} satisfies Meta<typeof ButtonGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ConnectedHistory: Story = {
  name: 'Connected undo / redo',
  render: () => (
    <ButtonGroup connected aria-label="History">
      <IconButton variant="tonal" aria-label="Undo" tooltip="Undo" shortcut="Mod+Z"><Icon>{demoIcons.undo}</Icon></IconButton>
      <IconButton variant="tonal" aria-label="Redo" tooltip="Redo" shortcut="Shift+Mod+Z" isDisabled><Icon>{demoIcons.redo}</Icon></IconButton>
    </ButtonGroup>
  ),
};

export const Standard: Story = {
  render: () => (
    <ButtonGroup aria-label="View">
      <IconButton aria-label="Zoom out" tooltip="Zoom out" shortcut="Mod+-"><Icon>{demoIcons.zoomOut}</Icon></IconButton>
      <IconButton aria-label="Zoom in" tooltip="Zoom in" shortcut="Mod+="><Icon>{demoIcons.zoomIn}</Icon></IconButton>
      <IconButton aria-label="Zoom to fit" tooltip="Zoom to fit" shortcut="⇧1"><Icon>{demoIcons.fitScreen}</Icon></IconButton>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ButtonGroup connected orientation="vertical" aria-label="Zoom">
      <IconButton variant="outlined" aria-label="Zoom in"><Icon>{demoIcons.add}</Icon></IconButton>
      <IconButton variant="outlined" aria-label="Zoom out"><Icon>{demoIcons.remove}</Icon></IconButton>
    </ButtonGroup>
  ),
};
