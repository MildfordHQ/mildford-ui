import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '../Icon';
import { demoIcons } from '../stories/demoIcons';
import { IconButton } from './IconButton';

const meta = {
  title: 'Primitives/Actions/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'M3 icon button on RAC `Button`: `standard`, `filled`, `tonal`, `outlined`; 40px (or 32px `sm`) with a 44px touch target. `aria-label` is required. `tooltip` and `shortcut` wrap it in a `Tooltip` with a `Kbd`. Press morphs the pill toward `corner.medium`.',
      },
    },
  },
  args: { 'aria-label': 'Undo', tooltip: 'Undo', shortcut: 'Mod+Z', children: <Icon>{demoIcons.undo}</Icon> },
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const variants = ['standard', 'filled', 'tonal', 'outlined'] as const;

export const VariantsAndStates: Story = {
  name: 'Variants × states',
  render: () => (
    <table style={{ color: 'var(--mild-color-text)', font: 'var(--mild-type-label-medium)', borderSpacing: '24px 12px' }}>
      <thead><tr><th scope="col">Variant</th><th>Enabled</th><th>Disabled</th><th>Small</th></tr></thead>
      <tbody>
        {variants.map((variant) => (
          <tr key={variant}>
            <th scope="row" style={{ textAlign: 'left' }}>{variant}</th>
            <td><IconButton variant={variant} aria-label={`${variant} delete`} tooltip="Delete" shortcut="Backspace"><Icon>{demoIcons.delete}</Icon></IconButton></td>
            <td><IconButton variant={variant} aria-label={`${variant} delete (disabled)`} isDisabled><Icon>{demoIcons.delete}</Icon></IconButton></td>
            <td><IconButton variant={variant} size="sm" aria-label={`${variant} close`}><Icon size={20}>{demoIcons.close}</Icon></IconButton></td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};
