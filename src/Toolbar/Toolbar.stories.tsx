import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button';
import { ButtonGroup } from '../ButtonGroup';
import { Chip } from '../Chip';
import { ColorPickerPopover, ColorSwatchButton, DualSwatch } from '../Color';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { Menu, MenuItem, MenuSection, MenuTrigger } from '../Menu';
import { Separator } from '../Separator';
import { Slider } from '../Slider';
import { demoIcons } from '../stories/demoIcons';
import { ToggleButton } from '../ToggleButton';
import { FloatingToolbar, Toolbar } from './Toolbar';

const meta = {
  title: 'Patterns/Editors/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '`Toolbar` is the docked contextual toolbar on RAC `Toolbar`: 48px, one tab stop, arrows and Home/End move, groups separated by `Separator`. `FloatingToolbar` is the same semantics in the M3 floating pill. Both require `aria-label`.',
      },
    },
  },
  args: { 'aria-label': 'Toolbar', children: null },
} satisfies Meta<typeof Toolbar>;
export default meta;
type Story = StoryObj<typeof meta>;

const SHAPES = [
  { id: 'rect', name: 'Rectangle', d: 'M4 4h16v16H4z' },
  { id: 'rounded', name: 'Rounded rectangle', d: 'M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z' },
  { id: 'ellipse', name: 'Ellipse', d: 'M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16z' },
  { id: 'triangle', name: 'Triangle', d: 'M12 4l8 16H4z' },
  { id: 'diamond', name: 'Diamond', d: 'M12 4l8 8-8 8-8-8z' },
  { id: 'hexagon', name: 'Hexagon', d: 'M8 5h8l4 7-4 7H8l-4-7z' },
];
const shapePreview = (d: string) => <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden="true"><path d={d} fill="var(--mild-color-action)" /></svg>;

function Idle() {
  return (
    <Toolbar aria-label="Artboard">
      <DualSwatch size={32} foreground="#0064d4" background="transparent" foregroundName="#1" backgroundName="transparent" onPress={() => {}} />
      <Chip icon={<Icon size={20}>{demoIcons.palette}</Icon>}>Primaries</Chip>
      <Separator />
      <ToggleButton aria-label="Show grid" tooltip="Show grid" shortcut="Shift+G" defaultSelected><Icon>{demoIcons.grid}</Icon></ToggleButton>
      <IconButton aria-label="Zoom to fit" tooltip="Zoom to fit" shortcut="⇧1"><Icon>{demoIcons.fitScreen}</Icon></IconButton>
      <span style={{ marginLeft: 'auto', color: 'var(--mild-color-text-muted)', font: 'var(--mild-type-body-small)', whiteSpace: 'nowrap' }}>
        Drag on the artboard to select shapes · right-click for more
      </span>
    </Toolbar>
  );
}

function Selection() {
  return (
    <Toolbar aria-label="Selection">
      <ButtonGroup connected aria-label="Change shape">
        {SHAPES.map((shape) => <IconButton key={shape.id} variant="tonal" aria-label={`Change to ${shape.name.toLowerCase()}`} tooltip={`Change to ${shape.name.toLowerCase()}`}>{shapePreview(shape.d)}</IconButton>)}
      </ButtonGroup>
      <Separator />
      <Button variant="secondary" size="small">Group</Button>
      <Button variant="secondary" size="small" isDisabled>Ungroup</Button>
      <Separator />
      <IconButton aria-label="Clear selection" tooltip="Clear selection" shortcut="Escape"><Icon>{demoIcons.close}</Icon></IconButton>
    </Toolbar>
  );
}

function ObjectMode() {
  const [fill, setFill] = useState('#0064d4');
  const [stroke, setStroke] = useState('transparent');
  return (
    <Toolbar aria-label="Object">
      <ColorPickerPopover label="Fill color" value={fill} onChange={setFill} swatches={['#111112', '#0064d4', '#cf263e', '#008200', '#8a6100', '#ffffff']}
        trigger={<ColorSwatchButton aria-label={`Fill color ${fill}`} color={fill} showChevron />} />
      <ColorPickerPopover label="Stroke color" value={stroke} onChange={setStroke} swatches={['transparent', '#fafafa', '#e0e2e4', '#111112']}
        trigger={<ColorSwatchButton aria-label={`Stroke color ${stroke}`} color={stroke} shape="square" showChevron />} />
      <Separator />
      <IconButton aria-label="Corners" tooltip="Corners"><Icon>{demoIcons.roundedCorner}</Icon></IconButton>
      <MenuTrigger>
        <IconButton aria-label="Shape" tooltip="Shape"><Icon>{demoIcons.shapes}</Icon></IconButton>
        <Menu aria-label="Shape">
          <MenuSection layout="grid" columns={6} aria-label="Shapes">
            {SHAPES.map((shape) => <MenuItem key={shape.id} id={shape.id} textValue={shape.name} icon={shapePreview(shape.d)}>{shape.name}</MenuItem>)}
          </MenuSection>
        </Menu>
      </MenuTrigger>
      <Separator />
      <IconButton aria-label="Delete" tooltip="Delete" shortcut="Backspace"><Icon>{demoIcons.delete}</Icon></IconButton>
    </Toolbar>
  );
}

export const Contextual: Story = {
  name: 'Contextual toolbar (idle / selection / object)',
  argTypes: { mode: { control: 'inline-radio', options: ['idle', 'selection', 'object'] } } as never,
  args: { mode: 'idle' } as never,
  render: (args) => {
    const mode = (args as unknown as { mode: 'idle' | 'selection' | 'object' }).mode;
    return (
      <div style={{ background: 'var(--md-sys-color-surface)' }}>
        {mode === 'idle' && <Idle />}
        {mode === 'selection' && <Selection />}
        {mode === 'object' && <ObjectMode />}
      </div>
    );
  },
};

export const ZoomPill: Story = {
  name: 'Zoom pill (floating)',
  render: function Render() {
    const [zoom, setZoom] = useState(1.28);
    const format = (value: number) => `${Math.round(value * 100)}%`;
    return (
      <div style={{ position: 'relative', height: 240, background: 'var(--mild-color-workspace)' }}>
        <FloatingToolbar aria-label="Zoom" position="bottom-end">
          <IconButton size="sm" aria-label="Zoom out" tooltip="Zoom out" shortcut="Mod+-" tooltipPlacement="top" onPress={() => setZoom((z) => Math.max(0.1, z / 1.25))}><Icon size={20}>{demoIcons.zoomOut}</Icon></IconButton>
          <Slider aria-label="Zoom" scale="log" minValue={0.1} maxValue={8} value={zoom} onChange={setZoom} formatValue={format} className="zoom-slider" />
          <IconButton size="sm" aria-label="Zoom in" tooltip="Zoom in" shortcut="Mod+=" tooltipPlacement="top" onPress={() => setZoom((z) => Math.min(8, z * 1.25))}><Icon size={20}>{demoIcons.zoomIn}</Icon></IconButton>
          <MenuTrigger>
            <Button size="small" variant="ghost">{format(zoom)} ▾</Button>
            <Menu aria-label="Zoom level" placement="top end" onAction={(key) => setZoom(key === 'fit' ? 1 : Number(key))}>
              <MenuItem id="fit" shortcut="⇧1">Zoom to fit</MenuItem>
              <MenuItem id="0.5">50%</MenuItem>
              <MenuItem id="1" shortcut="Mod+0">100%</MenuItem>
              <MenuItem id="2">200%</MenuItem>
              <MenuItem id="4">400%</MenuItem>
            </Menu>
          </MenuTrigger>
        </FloatingToolbar>
        <style>{'.zoom-slider { width: 120px; }'}</style>
      </div>
    );
  },
};
