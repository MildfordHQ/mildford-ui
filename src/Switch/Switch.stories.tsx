import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kbd } from '../Kbd';
import { Switch } from './Switch';

const meta = {
  title: 'Primitives/Inputs/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'M3 switch on RAC `Switch` (`role="switch"` on a native checkbox). 52×32 track; the handle is 16px off, 24px on and grows to 28px while pressed. Pass the label as children (label at the start, track at the end — the settings-panel row layout) or `aria-label` for a bare switch.',
      },
    },
  },
  args: { children: 'Show grid' },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Switch aria-label="Off" />
      <Switch aria-label="On" defaultSelected />
      <Switch aria-label="Disabled off" isDisabled />
      <Switch aria-label="Disabled on" isDisabled defaultSelected />
    </div>
  ),
};

export const DocumentPanel: Story = {
  name: 'Document panel rows',
  render: () => (
    <div style={{ width: 288, display: 'grid', gap: 4, padding: 16, background: 'var(--mild-color-surface)', borderRadius: 16 }}>
      <Switch defaultSelected>
        <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>Show grid <Kbd keys="Shift+G" /></span>
      </Switch>
      <Switch>Show rulers</Switch>
      <Switch isDisabled>Snap to grid</Switch>
    </div>
  ),
};
