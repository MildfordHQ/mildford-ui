import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricCard } from './MetricCard';

const meta = { title: 'Primitives/Display/MetricCard', component: MetricCard, tags: ['autodocs'], args: { label: 'Successful runs', value: '98.4%', trend: '↑ 2.1%', supportingText: 'Last 24 hours · 1,284 runs' } } satisfies Meta<typeof MetricCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const OrchestrationMetric: Story = {};
