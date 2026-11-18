import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Icon } from '../Icon';
import { MenuItem, MenuSection } from '../Menu';
import { demoIcons } from '../stories/demoIcons';
import { ContextMenu } from './ContextMenu';

const SHAPES = [
  { id: 'rect', name: 'Rectangle', d: 'M4 4h20v20H4z' },
  { id: 'rounded', name: 'Rounded rectangle', d: 'M8 4h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z' },
  { id: 'ellipse', name: 'Ellipse', d: 'M14 4a10 10 0 1 1 0 20 10 10 0 0 1 0-20z' },
  { id: 'triangle', name: 'Triangle', d: 'M14 4l10 20H4z' },
  { id: 'diamond', name: 'Diamond', d: 'M14 4l10 10-10 10L4 14z' },
  { id: 'hexagon', name: 'Hexagon', d: 'M9 5h10l5 9-5 9H9l-5-9z' },
];

type Target = 'object' | 'artboard' | 'locked';

function menuFor(target: Target) {
  const grid = (title: string) => (
    <MenuSection layout="grid" columns={6} title={title} aria-label={title}>
      {SHAPES.map((shape) => (
        <MenuItem key={shape.id} id={shape.id} textValue={shape.name} icon={<svg viewBox="0 0 28 28" width={28} height={28}><path d={shape.d} fill="var(--mild-color-action)" /></svg>}>
          {shape.name}
        </MenuItem>
      ))}
    </MenuSection>
  );
  if (target === 'object') {
    return (
      <>
        {grid('Change shape')}
        <MenuSection aria-label="Shape">
          <MenuItem id="delete" destructive icon={<Icon>{demoIcons.delete}</Icon>} shortcut="Backspace">Delete</MenuItem>
        </MenuSection>
      </>
    );
  }
  if (target === 'artboard') {
    return (
      <>
        {grid('Insert shape')}
        <MenuSection aria-label="Artboard">
          <MenuItem id="select-all" icon={<Icon>{demoIcons.select}</Icon>} shortcut="Mod+A">Select all</MenuItem>
          <MenuItem id="paste" icon={<Icon>{demoIcons.paste}</Icon>} shortcut="Mod+V" isDisabled description="The clipboard is empty">Paste here</MenuItem>
        </MenuSection>
      </>
    );
  }
  return <MenuItem id="locked" isDisabled>Unlock the layer to edit it</MenuItem>;
}

const meta = {
  title: 'Primitives/Menus and overlays/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'RAC `MenuTrigger trigger="contextMenu"` around a `Pressable` wrapper: right-click, touch/pen long press, Shift+F10 / Menu key with the wrapper focused. Escape, outside press and selection close it; focus returns to the wrapper. The wrapper sits outside the host element, so the host\'s pointer handlers still run — the counters below prove it (left-drag on the artboard increments pointerdown; a long press must not add a click).',
      },
    },
  },
  args: { role: 'application', 'aria-label': 'Artboard', menu: null, children: null },
} satisfies Meta<typeof ContextMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ArtboardStates: Story = {
  name: 'Shape / artboard / locked layer',
  argTypes: { target: { control: 'inline-radio', options: ['object', 'artboard', 'locked'] } } as never,
  args: { target: 'artboard' } as never,
  render: function Render(args) {
    const target = (args as unknown as { target: Target }).target;
    const [counts, setCounts] = useState({ pointerdown: 0, click: 0 });
    const [last, setLast] = useState<string>('—');
    return (
      <div style={{ height: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr', background: 'var(--mild-color-workspace)', color: 'var(--mild-color-text)', font: 'var(--mild-type-body-medium)' }}>
        <p style={{ margin: 0, padding: '12px 16px' }}>
          Right-click, long-press or focus the artboard and press Shift+F10. Last action: <strong>{last}</strong> · stage pointerdown {counts.pointerdown} · stage click {counts.click}
        </p>
        <ContextMenu role="application" aria-label="Artboard" menu={menuFor(target)} onAction={(key) => setLast(String(key))}>
          <div
            onPointerDown={() => setCounts((c) => ({ ...c, pointerdown: c.pointerdown + 1 }))}
            onClick={() => setCounts((c) => ({ ...c, click: c.click + 1 }))}
            style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}
          >
            <div style={{ width: 360, height: 360, background: 'var(--mild-color-surface)', boxShadow: 'var(--mild-elevation-artboard)', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 48, top: 64, width: 140, height: 100, borderRadius: 12, background: 'var(--mild-color-action)' }} />
              <div style={{ position: 'absolute', right: 56, bottom: 56, width: 120, height: 120, borderRadius: '50%', border: '4px solid var(--mild-color-text)' }} />
            </div>
          </div>
        </ContextMenu>
      </div>
    );
  },
};
