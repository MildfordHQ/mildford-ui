import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { EditorShell } from './EditorShell';
import { useWorkspaceViewport } from './EditorShellContext';
import styles from './EditorShell.stories.module.css';

/** Placeholder stage that prints the workspace box it receives. */
function Stage() {
  const { width, height } = useWorkspaceViewport();
  return (
    <div className={styles.stage}>
      <div className={styles.paper}>Artboard</div>
      <output className={styles.readout}>workspace {Math.round(width)} × {Math.round(height)} px</output>
    </div>
  );
}

function Slot({ label, children }: { label: string; children?: ReactNode }) {
  return <div className={styles.slot}>{children ?? label}</div>;
}

function ShellDemo({ panelMode, initialPanel = true }: { panelMode: 'docked' | 'overlay' | 'sheet' | 'auto'; initialPanel?: boolean }) {
  const [open, setOpen] = useState(initialPanel);
  return (
    <EditorShell
      panelMode={panelMode}
      onPanelDismiss={() => setOpen(false)}
      appBar={<Slot label="App bar">Sketchpad · File · View — Untitled design</Slot>}
      rail={
        <div className={styles.railDemo}>
          {['Select', 'Frame', 'Hand', 'Rectangle'].map((tool) => <span key={tool} className={styles.railEntry}>{tool}</span>)}
          <button type="button" className={styles.toggle} aria-pressed={open} onClick={() => setOpen((value) => !value)}>Palette</button>
        </div>
      }
      panel={open ? <Slot label="Palette panel"><strong>Palette</strong><p>Panel content scrolls independently of the workspace.</p></Slot> : null}
      panelLabel="Palette panel"
      toolbar={<Slot label="Contextual toolbar" />}
      workspace={<Stage />}
      overlays={<div className={styles.zoomPill}>− ──●── + 100%</div>}
    />
  );
}

const meta = {
  title: 'Patterns/Editors/EditorShell',
  component: EditorShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The fixed editor frame: app bar, rail, optional panel, contextual toolbar, workspace and workspace overlays. Regions stop pointer propagation so the host stage never sees presses on chrome. `useWorkspaceViewport()` gives the stage its box. Slots below are placeholders; see the Patterns stories for the real chrome.',
      },
    },
  },
  args: { appBar: null, workspace: null },
} satisfies Meta<typeof EditorShell>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = { render: () => <ShellDemo panelMode="docked" /> };
export const OverlayPanel: Story = { name: 'Overlay panel', render: () => <ShellDemo panelMode="overlay" />, globals: {
  viewport: {
    value: 'tablet1100',
    isRotated: false
  }
} };
export const Mobile: Story = { render: () => <ShellDemo panelMode="auto" initialPanel={false} />, globals: {
  viewport: {
    value: 'phone390',
    isRotated: false
  }
} };
