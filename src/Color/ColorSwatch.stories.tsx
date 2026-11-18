import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColorSwatch, ColorSwatchButton } from './ColorSwatch';

const meta = {
  title: 'Primitives/Color/ColorSwatch',
  component: ColorSwatch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Color preview on RAC `ColorSwatch` (`role="img"`, localized color name). Sizes 24/32/40, `circle` or `square` (`corner.small`). A 1px `outline-variant` inset ring keeps white swatches visible. Fully transparent colors render a token checkerboard (CSS `conic-gradient`) and are announced as "Transparent". `colorName` / `aria-label` replace the name, e.g. with a palette index. `ColorSwatchButton` wraps a swatch in a RAC `Button` (optional chevron) for Fill / Stroke / Background popover triggers.',
      },
    },
  },
  args: { color: '#0064d4' },
} satisfies Meta<typeof ColorSwatch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const SAMPLES = ['#111112', '#0064d4', '#cf263e', '#ffffff', '#0064d480', 'transparent'];

export const SizesAndShapes: Story = {
  name: 'Sizes and shapes',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'max-content repeat(6, max-content)', alignItems: 'center', gap: '12px 16px', color: 'var(--mild-color-text)', font: 'var(--mild-type-label-medium)' }}>
      {([24, 32, 40] as const).flatMap((size) =>
        (['circle', 'square'] as const).map((shape) => (
          <div key={`${size}-${shape}`} style={{ display: 'contents' }}>
            <span>{size}px {shape}</span>
            {SAMPLES.map((color) => (
              <ColorSwatch key={color} color={color} size={size} shape={shape} />
            ))}
          </div>
        )),
      )}
    </div>
  ),
};

export const SwatchButtons: Story = {
  name: 'Swatch buttons (object toolbar)',
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 4, borderRadius: 999, background: 'var(--md-sys-color-surface-container-high)' }}>
      <ColorSwatchButton aria-label="Fill color: dark blue" color="#0064d4" showChevron />
      <ColorSwatchButton aria-label="Stroke color: transparent" color="transparent" shape="square" showChevron />
      <ColorSwatchButton aria-label="Background color: white" color="#ffffff" size={32} />
    </div>
  ),
};
