import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './Alert';

const meta = { title: 'Primitives/Status and feedback/Alert', component: Alert, tags: ['autodocs'], args: { title: 'Deployment delayed', children: 'Two agents are waiting for capacity.', tone: 'warning' } } satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Tones: Story = { render: () => <div style={{ display: 'grid', gap: 12 }}><Alert tone="info">Run logs are retained for 30 days.</Alert><Alert tone="success">Workflow deployed successfully.</Alert><Alert tone="warning">One stage needs attention.</Alert><Alert tone="error">The production run failed.</Alert></div> };
