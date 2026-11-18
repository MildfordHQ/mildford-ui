import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { PageHeader } from './PageHeader';

const meta = { title: 'Patterns/Control planes/PageHeader', component: PageHeader, tags: ['autodocs'], args: { eyebrow: 'Production', title: 'Workflows', description: 'Monitor, deploy, and manage orchestrated agent workflows.', actions: <Button variant="primary">New workflow</Button> } } satisfies Meta<typeof PageHeader>;
export default meta;
type Story = StoryObj<typeof meta>;
export const OperationalPage: Story = {};
