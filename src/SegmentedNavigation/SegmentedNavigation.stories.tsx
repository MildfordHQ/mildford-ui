import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentedNavigation } from './SegmentedNavigation';

const meta = { title: 'Patterns/Control planes/SegmentedNavigation', component: SegmentedNavigation, tags: ['autodocs'], args: { label: 'Workflow views', items: [{ label: 'Overview', href: '#overview', isCurrent: true }, { label: 'Runs', href: '#runs' }, { label: 'Configuration', href: '#configuration' }] } } satisfies Meta<typeof SegmentedNavigation>;
export default meta;
type Story = StoryObj<typeof meta>;
export const WorkflowViews: Story = {};
