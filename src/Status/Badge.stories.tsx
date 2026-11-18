import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta = { title: 'Primitives/Status and feedback/Badge', component: Badge, tags: ['autodocs'], args: { children: 'Running' } } satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Variants: Story = { render: () => <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{(['neutral','info','success','warning','error','accent'] as const).map((tone) => <Badge key={tone} tone={tone}>{tone}</Badge>)}</div> };
