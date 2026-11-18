import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { SectionHeader } from './SectionHeader';

const meta = { title: 'Patterns/Control planes/SectionHeader', component: SectionHeader, tags: ['autodocs'], args: { title: 'Recent runs', description: 'Latest execution activity across environments.', actions: <Button size="small" variant="outline">View all</Button> } } satisfies Meta<typeof SectionHeader>;
export default meta;
type Story = StoryObj<typeof meta>;
export const DataSection: Story = {};
