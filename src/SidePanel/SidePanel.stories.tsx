import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { Button } from '../Button';
import { ColorSwatchButton } from '../Color';
import { EditorShell } from '../EditorShell';
import { Kbd } from '../Kbd';
import { Switch } from '../Switch';
import { ToggleButton, ToggleButtonGroup } from '../ToggleButton';
import { SidePanel } from './SidePanel';

const row: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 48 };
const sectionLabel: CSSProperties = { margin: '16px 0 4px', font: 'var(--mild-type-label-medium)', color: 'var(--mild-color-text-muted)' };
const muted: CSSProperties = { font: 'var(--mild-type-body-small)', color: 'var(--mild-color-text-muted)' };

/** Document panel demo, padded with read-only rows so the body scrolls. */
function BoardRows() {
  return (
    <div style={{ display: 'grid' }}>
      <div style={row}>
        <span>Background</span>
        <ColorSwatchButton aria-label="Background color: white" color="#ffffff" size={32} showChevron />
      </div>
      <Switch defaultSelected>
        <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>Show grid <Kbd keys="Shift+G" /></span>
      </Switch>
      <div style={row}>
        <span>Grid style</span>
        <ToggleButtonGroup aria-label="Grid style" selectionMode="single" disallowEmptySelection defaultSelectedKeys={['lines']} connected>
          <ToggleButton id="lines" variant="tonal" size="sm">Lines</ToggleButton>
          <ToggleButton id="dots" variant="tonal" size="sm">Dots</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <Switch>Snap to objects</Switch>
      <p style={sectionLabel}>Document</p>
      {[
        ['Size', '1920 × 1080 px'],
        ['Layers', '12'],
        ['Shapes', '37'],
        ['Color profile', 'sRGB'],
        ['Created', '12 Oct 2026'],
        ['Last edited', 'just now'],
        ['Storage', 'This browser'],
        ['Format', 'JSON'],
        ['Undo history', '48 steps'],
        ['Snapping', 'Grid and objects'],
        ['Units', 'Pixels'],
        ['Zoom', '100%'],
      ].map(([label, value]) => (
        <div key={label} style={row}>
          <span>{label}</span>
          <span style={muted}>{value}</span>
        </div>
      ))}
    </div>
  );
}

const footer = <span style={muted}>Document settings are saved with the file.</span>;

/** Standalone demo: a reopen button and the panel. */
function Standalone({ mode, children }: { mode: 'docked' | 'overlay' | 'sheet'; children?: ReactNode }) {
  const [open, setOpen] = useState(true);
  const panel = (
    <SidePanel title="Document" mode={mode} isOpen={open} onClose={() => setOpen(false)} footer={footer} inset={mode === 'overlay' ? 56 : undefined}>
      <BoardRows />
    </SidePanel>
  );
  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--mild-color-workspace)' }}>
      {mode === 'docked' && open && panel}
      <div style={{ flex: 1, padding: 16 }}>
        {children}
        <Button variant="primary" onClick={() => setOpen(true)} isDisabled={open}>Open Document panel</Button>
      </div>
      {mode !== 'docked' && panel}
    </div>
  );
}

function ShellWithPanel() {
  const [open, setOpen] = useState(true);
  return (
    <EditorShell
      panelMode="auto"
      onPanelDismiss={() => setOpen(false)}
      appBar={<div style={{ padding: '0 16px', font: 'var(--mild-type-title-medium)' }}>Untitled design</div>}
      rail={
        <div style={{ display: 'grid', gap: 8, padding: '12px 4px', justifyItems: 'center' }}>
          <Button variant="secondary" aria-pressed={open} onClick={() => setOpen((value) => !value)}>Document</Button>
        </div>
      }
      panel={
        open ? (
          <SidePanel title="Document" onClose={() => setOpen(false)} footer={footer}>
            <BoardRows />
          </SidePanel>
        ) : null
      }
      panelLabel="Document panel"
      workspace={<div style={{ display: 'grid', placeItems: 'center', height: '100%', color: 'var(--mild-color-text-muted)' }}>Workspace</div>}
    />
  );
}

const meta = {
  title: 'Patterns/Editors/SidePanel',
  component: SidePanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'M3 side sheet for editor panels: 320px, a 56px header with the title (title-medium) and a close icon button ("Close panel"), a scrolling body (16px 20px) and an optional footer. Docked and overlay panels are non-modal RAC `Dialog`s labelled by the title: focus is not trapped and Esc closes the panel when focus is inside. Standalone, `mode` picks `docked` (static), `overlay` (fixed at the inline start, elevation 2, closes on Esc or an outside press) or `sheet` (RAC bottom sheet, 60% snap point, swipe down, Esc or scrim press to close). Inside an `EditorShell` the shell region decides the mode and owns placement and dismissal (`onPanelDismiss`); `mode` is ignored there. Swipe-to-dismiss can only be checked here, not in jsdom.',
      },
    },
  },
  args: { title: 'Document', onClose: () => {}, children: null },
} satisfies Meta<typeof SidePanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Docked: Story = { render: () => <Standalone mode="docked" /> };

export const Overlay: Story = {
  parameters: { docs: { description: { story: 'Press outside the panel or Esc to close it. `inset={56}` leaves room for an app bar.' } } },
  render: () => <Standalone mode="overlay" />,
};

export const SheetMode: Story = {
  name: 'Sheet',

  parameters: {
    docs: { description: { story: 'Drag the sheet up to full height, swipe it down, press Esc or tap the scrim to close it.' } }
  },

  render: () => <Standalone mode="sheet" />,

  globals: {
    viewport: {
      value: 'phone390',
      isRotated: false
    }
  }
};

export const InShellTablet: Story = {
  name: 'In EditorShell (auto, 1100px → overlay)',
  render: () => <ShellWithPanel />,
  globals: {
    viewport: {
      value: 'tablet1100',
      isRotated: false
    }
  },
};

export const InShellPhone: Story = {
  name: 'In EditorShell (auto, 390px → sheet)',
  render: () => <ShellWithPanel />,
  globals: {
    viewport: {
      value: 'phone390',
      isRotated: false
    }
  },
};
