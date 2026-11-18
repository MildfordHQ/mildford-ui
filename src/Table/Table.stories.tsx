import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../Status';
import { Table } from './Table';

const meta = { title: 'Primitives/Display/Table', component: Table, tags: ['autodocs'], args: { 'aria-label': 'Recent workflow runs', children: <><thead><tr><th scope="col">Run</th><th scope="col">Workflow</th><th scope="col">Status</th><th scope="col">Duration</th></tr></thead><tbody><tr><td>#1284</td><td>Incident triage</td><td><Badge tone="success">Completed</Badge></td><td>1m 42s</td></tr><tr><td>#1283</td><td>Release review</td><td><Badge tone="warning">Waiting</Badge></td><td>8m 05s</td></tr></tbody></> } } satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;
export const RunHistory: Story = {};
