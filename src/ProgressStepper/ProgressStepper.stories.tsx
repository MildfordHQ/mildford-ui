import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressStepper } from './ProgressStepper';

const steps = [{ id: 'plan', label: 'Plan', description: 'Prompt accepted', status: 'complete', statusLabel: 'Completed' }, { id: 'execute', label: 'Execute', description: 'Agents working', status: 'current', statusLabel: 'In progress' }, { id: 'approve', label: 'Approve', description: 'Operator gate', status: 'upcoming', statusLabel: 'Pending' }, { id: 'release', label: 'Release', status: 'upcoming', statusLabel: 'Pending' }] as const;
const meta = { title: 'Primitives/Display/ProgressStepper', component: ProgressStepper, tags: ['autodocs'], args: { label: 'Workflow progress', steps } } satisfies Meta<typeof ProgressStepper>;
export default meta;
type Story = StoryObj<typeof meta>;
export const OrchestrationStages: Story = {};
export const Vertical: Story = { args: { orientation: 'vertical' } };
