import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './Spinner';

const meta = { title: 'Primitives/Status and feedback/Spinner', component: Spinner, tags: ['autodocs'], args: { label: 'Loading run history' } } satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Sizes: Story = { render: () => <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}><Spinner size="small" /><Spinner /><Spinner size="large" /></div> };
