import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextArea } from './TextArea';

const meta = { title: 'Primitives/Inputs/TextArea', component: TextArea, tags: ['autodocs'], args: { label: 'System instructions', description: 'Describe the agent objective and guardrails.', placeholder: 'Coordinate incident response…' } } satisfies Meta<typeof TextArea>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Instructions: Story = {};
