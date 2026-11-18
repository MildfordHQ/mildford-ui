import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusIndicator } from '../Status';
import { AppShell } from './AppShell';

const meta = { title: 'Patterns/Control planes/AppShell', component: AppShell, tags: ['autodocs'], parameters: { layout: 'fullscreen' }, args: { brand: 'Mildford Control', navigationItems: [{ label: 'Overview', href: '#overview', isCurrent: true }, { label: 'Workflows', href: '#workflows' }, { label: 'Agents', href: '#agents' }], utility: <StatusIndicator state="online">API online</StatusIndicator>, children: <div><h1>Control plane</h1><p>Operational content remains the visual focus.</p></div> } } satisfies Meta<typeof AppShell>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ResponsiveShell: Story = {};
