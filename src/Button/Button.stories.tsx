import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'Primitives/Actions/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Text button on React Aria `Button`. `onClick` receives the native click and `type="submit"` submits; `onPress` is the preferred handler. `loading` keeps focus, blocks presses and sets `aria-busy`. **Deprecated:** `iconOnly` — use `IconButton`.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'outline', 'danger'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    isSelected: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
    iconOnly: {
      control: 'boolean',
    },
    isDisabled: {
      control: 'boolean',
    },
    isPending: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    children: 'Small Button',
  },
};

export const Medium: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Medium Button',
  },
};

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    children: 'Large Button',
  },
};

export const IconOnly: Story = {
  name: 'Icon only (deprecated)',
  parameters: { docs: { description: { story: '`iconOnly` is deprecated; use `IconButton`, which requires `aria-label` and offers M3 icon-button variants.' } } },
  args: {
    variant: 'ghost',
    iconOnly: true,
    'aria-label': 'Workflow settings',
    children: '⚙',
  },
};

export const Selected: Story = {
  args: {
    variant: 'ghost',
    isSelected: true,
    children: 'Active Button',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    isDisabled: true,
    children: 'Disabled Button',
  },
};

export const FullWidth: Story = {
  args: {
    variant: 'primary',
    fullWidth: true,
    children: 'Full Width Button',
  },
  parameters: {
    layout: 'padded',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="danger">Stop run</Button>
      <Button variant="primary" isPending pendingLabel="Starting workflow">Start workflow</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button variant="primary" size="small">Small</Button>
      <Button variant="primary" size="medium">Medium</Button>
      <Button variant="primary" size="large">Large</Button>
    </div>
  ),
};
