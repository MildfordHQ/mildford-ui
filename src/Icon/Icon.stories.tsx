import type { Meta, StoryObj } from '@storybook/react-vite';
import { demoIcons } from '../stories/demoIcons';
import { Icon } from './Icon';

const meta = {
  title: 'Primitives/Display/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Sizes and colors an icon. Mildford ships no icons: pass a Material Symbols SVG component, an `<svg>` element, or path content in the `0 -960 960 960` viewBox. Decorative by default; pass `label` when the icon carries meaning on its own. The glyphs in these stories are placeholders drawn for Storybook.',
      },
    },
  },
  args: { size: 24, children: demoIcons.undo },
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', color: 'var(--mild-color-text)' }}>
      {([16, 20, 24] as const).map((size) => (
        <span key={size} style={{ display: 'grid', justifyItems: 'center', gap: 8, font: 'var(--mild-type-label-medium)' }}>
          <Icon size={size}>{demoIcons.grid}</Icon>
          {size}px
        </span>
      ))}
    </div>
  ),
};

export const InText: Story = {
  name: 'In text',
  render: () => (
    <p style={{ color: 'var(--mild-color-text)', font: 'var(--mild-type-body-medium)', display: 'flex', alignItems: 'center', gap: 4 }}>
      <Icon size={20}>{demoIcons.history}</Icon> Saved locally — this design is stored in this browser.
    </p>
  ),
};

export const FillPairing: Story = {
  name: 'Outline / fill pairing',
  parameters: { docs: { description: { story: 'An active tool shows the `-fill` variant of the same symbol (M3 navigation rail). The consumer passes both SVGs.' } } },
  render: () => (
    <div style={{ display: 'flex', gap: 24, color: 'var(--mild-color-text)' }}>
      {(['select', 'grid', 'square', 'circle', 'triangle', 'palette'] as const).map((name) => (
        <span key={name} style={{ display: 'flex', gap: 4 }}>
          <Icon>{demoIcons[name]}</Icon>
          <Icon style={{ color: 'var(--mild-color-action)' }}>{demoIcons[`${name}Fill`]}</Icon>
        </span>
      ))}
    </div>
  ),
};
