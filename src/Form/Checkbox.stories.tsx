import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const meta = { title: 'Primitives/Inputs/Checkbox', component: Checkbox, tags: ['autodocs'], args: { label: 'Require approval before production', description: 'Pauses the workflow until an operator approves it.' } } satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ApprovalGate: Story = {};
export const Error: Story = { args: { error: 'Approval is required for this environment.' } };
export const Checked: Story = { args: { defaultSelected: true } };
export const Disabled: Story = { args: { defaultSelected: true, isDisabled: true } };
