import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { Popover } from '../Popover';
import { ToggleButton, ToggleButtonGroup } from '../ToggleButton';
import { ColorSwatchButton } from './ColorSwatch';
import { ColorPicker, ColorPickerPopover } from './ColorPicker';
import { DualSwatch } from './DualSwatch';
import { SwatchGrid } from './SwatchGrid';

const meta = {
  title: 'Primitives/Color/Color',
  component: SwatchGrid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The color set. `SwatchGrid` is RAC `ColorSwatchPicker`: arrows move, Space/Enter or click picks, Alt/Option + ←/→ reorders through `onReorder`; it accepts and emits color strings or entry ids. `ColorPicker` composes RAC `ColorArea`, hue `ColorSlider` and a hex `ColorField` (non-hex keys are rejected; incomplete values show an error) and is also offered in a `Popover` as `ColorPickerPopover`. `DualSwatch` shows the Fill/Stroke pair with an optional swap button.',
      },
    },
  },
  args: { colors: [] },
} satisfies Meta<typeof SwatchGrid>;
export default meta;
type Story = StoryObj<typeof meta>;

interface PaletteColor {
  id: string;
  color: string;
}

const INITIAL: PaletteColor[] = [
  { id: 'c0', color: 'transparent' },
  { id: 'c1', color: '#111112' },
  { id: 'c2', color: '#ffffff' },
  { id: 'c3', color: '#0064d4' },
  { id: 'c4', color: '#cf263e' },
  { id: 'c5', color: '#f2b705' },
  { id: 'c6', color: '#008a5e' },
  { id: 'c7', color: '#7a4fd6' },
];

const panel: CSSProperties = {
  display: 'grid',
  gap: 24,
  width: 360,
  padding: 16,
  boxSizing: 'border-box',
  color: 'var(--mild-color-text)',
  background: 'var(--md-sys-color-surface-container-low)',
  borderRadius: 'var(--md-sys-shape-corner-large)',
};

function Block({ title, children }: { title: string; children: ReactNode }) {
  const id = `block-${title.toLowerCase().replace(/\W+/g, '-')}`;
  return (
    <section aria-labelledby={id} style={{ display: 'grid', gap: 12 }}>
      <h3 id={id} style={{ margin: 0, font: 'var(--mild-type-title-small, var(--mild-type-label-large))', color: 'var(--md-sys-color-on-surface-variant)' }}>{title}</h3>
      {children}
    </section>
  );
}

function move<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export const PalettePanel: Story = {
  name: 'Palette panel',
  render: function Render() {
    const [palette, setPalette] = useState(INITIAL);
    const [fill, setFill] = useState('c3');
    const [stroke, setStroke] = useState('c0');
    const [role, setRole] = useState<'fill' | 'stroke'>('fill');
    const colorOf = (id: string) => palette.find((entry) => entry.id === id)?.color ?? 'transparent';
    const indexOf = (id: string) => `#${palette.findIndex((entry) => entry.id === id) + 1}`;
    return (
      <div style={panel}>
        <Block title="Current colors">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <DualSwatch
              foreground={colorOf(fill)}
              background={colorOf(stroke)}
              foregroundName={indexOf(fill)}
              backgroundName={colorOf(stroke) === 'transparent' ? 'transparent' : indexOf(stroke)}
              onSwap={() => {
                setFill(stroke);
                setStroke(fill);
              }}
            />
            <ToggleButtonGroup
              aria-label="Swatch click sets"
              selectionMode="single"
              disallowEmptySelection
              selectedKeys={[role]}
              onSelectionChange={(keys) => setRole([...keys][0] as 'fill' | 'stroke')}
              connected
            >
              <ToggleButton id="fill" variant="tonal">Fill</ToggleButton>
              <ToggleButton id="stroke" variant="tonal">Stroke</ToggleButton>
            </ToggleButtonGroup>
          </div>
        </Block>
        <Block title="Swatches">
          <SwatchGrid
            aria-labelledby="block-swatches"
            colors={palette}
            value={role === 'fill' ? fill : stroke}
            onChange={(_, { id }) => (role === 'fill' ? setFill : setStroke)(id ?? 'c0')}
            onReorder={(from, to) => setPalette((list) => move(list, from, to))}
          />
          <p style={{ margin: 0, font: 'var(--mild-type-body-small)', color: 'var(--mild-color-text-muted)' }}>
            Arrows move · Space picks · ⌥←/→ reorders. Order: {palette.map((entry) => entry.color).join(', ')}
          </p>
        </Block>
      </div>
    );
  },
};

export const ObjectToolbar: Story = {
  name: 'Object toolbar Fill / Stroke',
  render: function Render() {
    const [fill, setFill] = useState('#0064d4');
    const [stroke, setStroke] = useState('transparent');
    const swatches = INITIAL.map((entry) => entry.color);
    return (
      <div role="toolbar" aria-label="Object" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: 4, borderRadius: 999, background: 'var(--md-sys-color-surface-container-high)', boxShadow: 'var(--mild-elevation-2)' }}>
        <ColorPickerPopover
          label="Fill color"
          trigger={<ColorSwatchButton aria-label={`Fill: ${fill}`} color={fill} showChevron />}
          value={fill === 'transparent' ? '#000000' : fill}
          onChange={setFill}
          swatches={swatches.filter((color) => color !== 'transparent')}
        />
        <ColorPickerPopover
          label="Stroke color"
          trigger={<ColorSwatchButton aria-label={`Stroke: ${stroke}`} color={stroke} shape="square" showChevron />}
          value={stroke}
          onChange={setStroke}
          swatches={swatches}
        />
        <Popover trigger={<DualSwatch size={32} foreground={fill} background={stroke} onPress={() => undefined} />} aria-label="Current colors">
          <SwatchGrid colors={swatches} value={fill} onChange={setFill} swatchSize={32} aria-label="Fill swatches" />
        </Popover>
      </div>
    );
  },
};

export const StandalonePicker: Story = {
  name: 'ColorPicker (palette editor embed)',
  render: function Render() {
    const [color, setColor] = useState('#0064d4');
    return (
      <div style={{ ...panel, width: 'auto', justifyItems: 'start' }}>
        <ColorPicker value={color} onChange={setColor} swatches={INITIAL.map((entry) => entry.color)} />
        <span style={{ font: 'var(--mild-type-body-small)' }}>Value: {color}</span>
      </div>
    );
  },
};

export const DualSwatchSizes: Story = {
  name: 'DualSwatch sizes',
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
      <DualSwatch foreground="#0064d4" background="transparent" onSwap={() => undefined} />
      <DualSwatch foreground="#111112" background="#ffffff" size={32} />
      <DualSwatch foreground="#cf263e" background="#f2b705" foregroundLabel="Stroke" backgroundLabel="Background" onPress={() => undefined} />
    </div>
  ),
};
