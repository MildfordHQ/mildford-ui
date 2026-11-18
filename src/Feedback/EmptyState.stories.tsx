import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { EmptyState } from './EmptyState';

const meta = { title: 'Primitives/Status and feedback/EmptyState', component: EmptyState, tags: ['autodocs'], args: { title: 'No workflows yet', description: 'Create a workflow to coordinate agents, tools, and approval stages.', icon: '◇', actions: <Button variant="primary">Create workflow</Button> } } satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;
export const FirstRun: Story = {};
