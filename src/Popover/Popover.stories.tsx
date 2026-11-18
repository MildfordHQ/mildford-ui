import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { demoIcons } from '../stories/demoIcons';
import { Popover } from './Popover';

const meta = {
  title: 'Primitives/Menus and overlays/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Anchored surface on RAC `Popover` + `Dialog`: `surface-container`, `corner.medium`, elevation 2, 8px offset. Focus moves in on open and returns on close; Escape and outside press close it. Pass `triggerRef` + `isOpen` to anchor to an element that is not the trigger.',
      },
    },
  },
  args: { children: null },
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;

const SWATCHES = ['#111112', '#0064d4', '#cf263e', '#008200', '#8a6100', '#ffffff'];

export const CornerOptions: Story = {
  name: 'From a trigger',
  render: () => (
    <Popover trigger={<IconButton aria-label="Corners" tooltip="Corners"><Icon>{demoIcons.roundedCorner}</Icon></IconButton>} aria-label="Fill color" showArrow>
      {(close) => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 32px)', gap: 8 }}>
          {SWATCHES.map((color) => (
            <button key={color} type="button" aria-label={color} onClick={close} style={{ width: 32, height: 32, borderRadius: 999, border: '1px solid var(--md-sys-color-outline-variant)', background: color, cursor: 'pointer' }} />
          ))}
        </div>
      )}
    </Popover>
  ),
};

export const AnchoredToSelection: Story = {
  name: 'Anchored to another element',
  render: function Render() {
    const anchor = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: 'grid', gap: 16, justifyItems: 'center' }}>
        <div ref={anchor} style={{ width: 160, height: 96, border: '2px dashed var(--mild-color-action)', borderRadius: 8, display: 'grid', placeItems: 'center', color: 'var(--mild-color-text-muted)', font: 'var(--mild-type-body-small)' }}>
          Selection box
        </div>
        <Button variant="outline" onClick={() => setOpen(true)}>Show selection actions</Button>
        <Popover triggerRef={anchor} isOpen={open} onOpenChange={setOpen} placement="top" aria-label="Selection actions">
          {(close) => <Button size="small" variant="secondary" onClick={close}>Done</Button>}
        </Popover>
      </div>
    );
  },
};
