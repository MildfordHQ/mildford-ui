import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextField } from './TextField';

const meta = { title: 'Primitives/Inputs/TextField', component: TextField, tags: ['autodocs'], args: { label: 'Workflow name', placeholder: 'Incident triage', description: 'Use a unique, descriptive name.' } } satisfies Meta<typeof TextField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Error: Story = { args: { defaultValue: 'Prod', error: 'A workflow with this name already exists.' } };
