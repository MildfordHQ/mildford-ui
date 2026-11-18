import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';

const meta = {
  title: 'Primitives/Display/Card',
  component: Card,
  tags: ['autodocs'],
  args: { children: 'Workflow details' },
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

const example = (
  <>
    <small style={{ color: 'var(--mild-color-text-muted)', letterSpacing: '.08em' }}>ENGINEERING</small>
    <h3 style={{ margin: '24px 0 12px' }}>Backend Engineer, Flag Delivery</h3>
    <p style={{ margin: 0, color: 'var(--mild-color-text-muted)', lineHeight: 1.6 }}>
      Review the role, responsibilities, and next steps with a calm information hierarchy.
    </p>
  </>
);

export const Flat: Story = { args: { children: example, elevated: false } };
export const Elevated: Story = { args: { children: example, elevated: true } };
export const Treatments: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 32, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
      <Card>{example}</Card>
      <Card elevated>{example}</Card>
    </div>
  ),
};
export const Padding: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, width: 420 }}>
      <Card padding="compact">Compact operational content</Card>
      <Card padding="spacious">Spacious editorial content</Card>
    </div>
  ),
};
