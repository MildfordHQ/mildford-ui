import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { demoIcons } from '../stories/demoIcons';
import { Slider } from './Slider';

const percent = (v: number) => `${Math.round(v * 100)}%`;

const meta = {
  title: 'Primitives/Inputs/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'M3 slider on RAC `Slider` (4px track, 16px thumb). `formatValue` drives the visible output and `aria-valuetext` (the zoom slider announces "128%"). `scale="log"` maps the track logarithmically between `minValue` and `maxValue`; values and callbacks stay in your units. The slider fills its container — give it a width through `className` or its parent.',
      },
    },
  },
  args: { label: 'Stroke width', minValue: 0, maxValue: 20, defaultValue: 4, showOutput: true, formatValue: (v: number) => `${v} px` },
  decorators: [(Story) => <div style={{ width: 240 }}><Story /></div>],
} satisfies Meta<typeof Slider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { isDisabled: true } };

function ZoomPill() {
  const [zoom, setZoom] = useState(1.28);
  const clamp = (v: number) => Math.min(8, Math.max(0.1, v));
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        height: 40,
        padding: 4,
        boxSizing: 'border-box',
        borderRadius: 999,
        background: 'var(--md-sys-color-surface-container)',
        boxShadow: 'var(--mild-elevation-2)',
        color: 'var(--mild-color-text)',
        font: 'var(--mild-type-label-large)',
      }}
    >
      <IconButton size="sm" aria-label="Zoom out" onPress={() => setZoom((z) => clamp(z / 1.25))}><Icon size={20}>{demoIcons.zoomOut}</Icon></IconButton>
      <div style={{ width: 120 }}>
        <Slider aria-label="Zoom" scale="log" minValue={0.1} maxValue={8} value={zoom} onChange={setZoom} formatValue={percent} />
      </div>
      <IconButton size="sm" aria-label="Zoom in" onPress={() => setZoom((z) => clamp(z * 1.25))}><Icon size={20}>{demoIcons.zoomIn}</Icon></IconButton>
      <span style={{ minWidth: 48, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{percent(zoom)}</span>
    </div>
  );
}

export const Zoom: Story = {
  name: 'Zoom pill (log 10%–800%)',
  decorators: [(Story) => <Story />],
  render: () => <ZoomPill />,
};
