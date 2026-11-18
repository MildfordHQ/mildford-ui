import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Dialog, type DialogSize } from './Dialog';

const meta = {
  title: 'Primitives/Menus and overlays/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Modal dialog on RAC `ModalOverlay` + `Modal` + `Dialog`. Focus is trapped and returns to the trigger on close; Escape and a press on the scrim call `onOpenChange(false)`. `size` picks 360 / 480 / 640px; omit it for the legacy 560px width.',
      },
    },
  },
  args: { isOpen: false, onOpenChange: () => undefined, title: 'Stop production run?', children: 'Active agents will finish their current operation before the run stops.' },
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DestructiveConfirmation: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>Stop run</Button>
        <Dialog {...args} isOpen={open} onOpenChange={setOpen} footer={<><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="danger" onClick={() => setOpen(false)}>Stop run</Button></>} />
      </>
    );
  },
};

const sizes: DialogSize[] = ['sm', 'md', 'lg'];

export const Sizes: Story = {
  args: { title: 'Rename design', description: 'Design names appear in the file list and the browser tab.' },
  render: (args) => {
    const [size, setSize] = useState<DialogSize | null>(null);
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        {sizes.map((value) => <Button key={value} onClick={() => setSize(value)}>Open {value}</Button>)}
        <Dialog
          {...args}
          size={size ?? undefined}
          isOpen={size !== null}
          onOpenChange={(open) => { if (!open) setSize(null); }}
          footer={<><Button onClick={() => setSize(null)}>Cancel</Button><Button variant="primary" onClick={() => setSize(null)}>Rename</Button></>}
        >
          {size === 'sm' && 'Compact confirmation width (360px).'}
          {size === 'md' && 'Standard form width (480px).'}
          {size === 'lg' && 'Wide content such as an export summary or a shortcut list (640px).'}
        </Dialog>
      </div>
    );
  },
};
