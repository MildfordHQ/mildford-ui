import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '../Icon';
import { demoIcons } from '../stories/demoIcons';
import { ToggleButton, ToggleButtonGroup } from './ToggleButton';

const meta = {
  title: 'Primitives/Actions/ToggleButton',
  component: ToggleButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'M3 toggle button on RAC `ToggleButton` (`aria-pressed`). Selected state morphs the pill to a rounded square over `--mild-motion-expressive-spatial` (`morph={false}` to opt out). Inside a `ToggleButtonGroup` with `selectionMode="single"` buttons become radios with arrow-key navigation.',
      },
    },
  },
  args: { 'aria-label': 'Show grid', tooltip: 'Show grid', shortcut: 'Shift+G', children: <Icon>{demoIcons.grid}</Icon> },
} satisfies Meta<typeof ToggleButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, max-content)', gap: '12px 24px', color: 'var(--mild-color-text)', font: 'var(--mild-type-label-medium)' }}>
      {(['standard', 'filled', 'tonal', 'outlined'] as const).map((variant) => (
        <div key={variant} style={{ display: 'grid', gap: 8, justifyItems: 'center' }}>
          <span>{variant}</span>
          <ToggleButton variant={variant} aria-label={`${variant} grid off`}><Icon>{demoIcons.grid}</Icon></ToggleButton>
          <ToggleButton variant={variant} aria-label={`${variant} grid on`} defaultSelected><Icon>{demoIcons.gridFill}</Icon></ToggleButton>
          <ToggleButton variant={variant} aria-label={`${variant} grid disabled`} isDisabled><Icon>{demoIcons.grid}</Icon></ToggleButton>
        </div>
      ))}
    </div>
  ),
};

export const SegmentedGroup: Story = {
  name: 'Connected group (Blue · Grey)',
  render: () => (
    <ToggleButtonGroup aria-label="Grid lines" selectionMode="single" disallowEmptySelection defaultSelectedKeys={['blue']} connected>
      <ToggleButton id="blue" variant="tonal">Blue</ToggleButton>
      <ToggleButton id="grey" variant="tonal">Grey</ToggleButton>
    </ToggleButtonGroup>
  ),
};

export const VerticalGroup: Story = {
  name: 'Vertical group',
  render: () => (
    <ToggleButtonGroup aria-label="Tools" selectionMode="single" disallowEmptySelection defaultSelectedKeys={['select']} orientation="vertical">
      <ToggleButton id="select" variant="tonal" aria-label="Select" tooltip="Select" shortcut="V" tooltipPlacement="right"><Icon>{demoIcons.select}</Icon></ToggleButton>
      <ToggleButton id="frame" variant="tonal" aria-label="Frame" tooltip="Frame" shortcut="F" tooltipPlacement="right"><Icon>{demoIcons.grid}</Icon></ToggleButton>
      <ToggleButton id="hand" variant="tonal" aria-label="Hand" tooltip="Hand" shortcut="H" tooltipPlacement="right"><Icon>{demoIcons.move}</Icon></ToggleButton>
    </ToggleButtonGroup>
  ),
};
