import type { Meta, StoryObj } from '@storybook/react-vite';
import { EditorAppBar } from '../stories/editorDemo';
import { TopAppBar } from './TopAppBar';

const meta = {
  title: 'Patterns/Editors/TopAppBar',
  component: TopAppBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'M3 top app bar for editors: brand, leading menus and history, status, centred title, trailing actions — one RAC `Toolbar` (`aria-label="Document"`), arrow keys across all controls. Below 1024px the title hides and `leading` is replaced by `collapsedMenu`. **Known gap:** React Aria has no menubar, so File and View are independent menus — moving between them while one is open is a click, not a hover.',
      },
    },
  },
  args: { brand: null },
} satisfies Meta<typeof TopAppBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Editor: Story = { render: () => <EditorAppBar /> };
export const Compact: Story = { name: 'Compact (< 1024px)', render: () => <EditorAppBar />, globals: {
  viewport: {
    value: 'tablet900',
    isRotated: false
  }
} };
