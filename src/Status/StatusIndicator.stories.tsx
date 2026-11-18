import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusIndicator } from './StatusIndicator';

const meta = { title: 'Primitives/Status and feedback/StatusIndicator', component: StatusIndicator, tags: ['autodocs'], args: { children: 'Sync API', state: 'online' } } satisfies Meta<typeof StatusIndicator>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ApiStates: Story = { render: () => <div style={{ display: 'grid', gap: 12 }}><StatusIndicator state="online">API available</StatusIndicator><StatusIndicator state="busy">Reconnecting</StatusIndicator><StatusIndicator state="offline">API unavailable</StatusIndicator></div> };
