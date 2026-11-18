import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormField } from './FormField';

const meta = { title: 'Primitives/Inputs/FormField', component: FormField, tags: ['autodocs'], args: { label: 'Environment', htmlFor: 'environment', description: 'Choose where this workflow runs.', children: <select id="environment" aria-describedby="environment-description"><option>Staging</option><option>Production</option></select> } } satisfies Meta<typeof FormField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const CustomControl: Story = {};
