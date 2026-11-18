import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import type { Key } from 'react-aria-components';
import { EditorShell } from '../EditorShell';
import { Icon } from '../Icon';
import { demoIcons, type DemoIconName } from '../stories/demoIcons';
import { NavigationRail, NavigationRailDivider, NavigationRailItem, type NavigationRailProps } from './NavigationRail';

const TOOLS: Array<{ id: string; label: string; shortcut: string; icon: DemoIconName; activeIcon?: DemoIconName; lockable?: boolean }> = [
  { id: 'select', label: 'Select', shortcut: 'V', icon: 'select', activeIcon: 'selectFill' },
  { id: 'frame', label: 'Frame', shortcut: 'F', icon: 'grid', activeIcon: 'gridFill' },
  { id: 'hand', label: 'Hand', shortcut: 'H', icon: 'move' },
  { id: 'rect', label: 'Rectangle', shortcut: 'R', icon: 'square', activeIcon: 'squareFill', lockable: true },
  { id: 'ellipse', label: 'Ellipse', shortcut: 'O', icon: 'circle', activeIcon: 'circleFill', lockable: true },
  { id: 'polygon', label: 'Polygon', shortcut: 'Y', icon: 'triangle', activeIcon: 'triangleFill', lockable: true },
  { id: 'gradient', label: 'Gradient', shortcut: 'G', icon: 'gradient' },
];

/** A drawing-tool rail with live state: double-click a lockable tool to lock it. */
function EditorRail({
  variant = 'auto',
  panel: controlledPanel,
  onPanelChange,
}: {
  variant?: NavigationRailProps['variant'];
  panel?: string | null;
  onPanelChange?: (panel: string | null) => void;
}) {
  const [tool, setTool] = useState<Key>('rect');
  const [locked, setLocked] = useState(true);
  const [ownPanel, setOwnPanel] = useState<string | null>(null);
  const panel = controlledPanel !== undefined ? controlledPanel : ownPanel;
  const togglePanel = (name: string) => (open: boolean) => {
    const next = open ? name : null;
    setOwnPanel(next);
    onPanelChange?.(next);
  };
  return (
    <NavigationRail
      aria-label="Tools"
      variant={variant}
      selectedKey={tool}
      onSelectionChange={(key) => { setTool(key); setLocked(false); }}
      footer={
        <>
          <NavigationRailDivider />
          <NavigationRailItem
            icon={<Icon>{demoIcons.palette}</Icon>}
            activeIcon={<Icon>{demoIcons.paletteFill}</Icon>}
            label="Palette"
            shortcut="P"
            isSelected={panel === 'palette'}
            onChange={togglePanel('palette')}
          />
          <NavigationRailItem icon={<Icon>{demoIcons.tune}</Icon>} label="Document" shortcut="D" isSelected={panel === 'document'} onChange={togglePanel('document')} />
        </>
      }
    >
      {TOOLS.slice(0, 3).map((entry) => <ToolEntry key={entry.id} entry={entry} />)}
      <NavigationRailDivider />
      {TOOLS.slice(3).map((entry) => (
        <ToolEntry
          key={entry.id}
          entry={entry}
          badge={entry.lockable && tool === entry.id && locked ? <Icon size={16}>{demoIcons.lock}</Icon> : undefined}
          onDoubleClick={entry.lockable ? () => setLocked((value) => !value) : undefined}
        />
      ))}
    </NavigationRail>
  );
}

function ToolEntry({ entry, badge, onDoubleClick }: { entry: (typeof TOOLS)[number]; badge?: ReactNode; onDoubleClick?: () => void }) {
  return (
    <NavigationRailItem
      id={entry.id}
      icon={<Icon>{demoIcons[entry.icon]}</Icon>}
      activeIcon={entry.activeIcon ? <Icon>{demoIcons[entry.activeIcon]}</Icon> : undefined}
      label={entry.label}
      shortcut={entry.shortcut}
      tooltip={entry.lockable ? `${entry.label} · ${entry.shortcut} — Shift-click or double-click to lock` : undefined}
      badge={badge}
      onDoubleClick={onDoubleClick}
    />
  );
}

const meta = {
  title: 'Patterns/Editors/NavigationRail',
  component: NavigationRail,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'M3 navigation rail for editor tools. Tools are modes in a RAC single-select `ToggleButtonGroup` (radios with `aria-checked`, arrow keys move, exactly one pressed); footer entries are independent toggles (`aria-pressed`) for panels. Active entries swap to their `-fill` glyph and the indicator morphs from pill to rounded square with a small spring (`--mild-motion-expressive-spatial`; none under reduced motion). The lock badge is `aria-hidden`, so its meaning lives in the tooltip. Every entry has a tooltip (right of the rail, above the bar) with its shortcut. `variant="auto"` becomes the M3 navigation bar below 1024px or when `EditorShell` places the rail at the bottom: entries share the width and the overflow opens a bottom sheet from "More".',
      },
    },
  },
  args: { 'aria-label': 'Tools', selectedKey: 'select', onSelectionChange: () => {}, children: null },
} satisfies Meta<typeof NavigationRail>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Editor: Story = {
  render: () => (
    <nav aria-label="Tools" style={{ display: 'flex', width: 80, height: 720, background: 'var(--md-sys-color-surface)', borderRight: '1px solid var(--md-sys-color-outline-variant)' }}>
      <EditorRail variant="rail" />
    </nav>
  ),
};

export const Bar: Story = {
  parameters: {
    layout: 'fullscreen'
  },

  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: '100dvh', background: 'var(--mild-color-workspace)' }}>
      <nav aria-label="Tools">
        <EditorRail variant="bar" />
      </nav>
    </div>
  ),

  globals: {
    viewport: {
      value: 'phone390',
      isRotated: false
    }
  }
};

function ShellDemo() {
  const [panel, setPanel] = useState<string | null>(null);
  return (
    <EditorShell
      appBar={<div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', font: 'var(--mild-type-title-medium)' }}>Sketchpad — Untitled design</div>}
      rail={<EditorRail panel={panel} onPanelChange={setPanel} />}
      panel={panel ? <div style={{ padding: 16, font: 'var(--mild-type-body-medium)' }}><strong style={{ textTransform: 'capitalize' }}>{panel}</strong> panel</div> : null}
      panelLabel={panel ? `${panel} panel` : 'Panel'}
      onPanelDismiss={() => setPanel(null)}
      workspace={<div style={{ display: 'grid', placeItems: 'center', height: '100%', color: 'var(--mild-color-text-muted)' }}>Artboard</div>}
    />
  );
}

/** The rail in `EditorShell`'s 80px region; resize below 1024px to see it become the bottom bar. */
export const InEditorShell: Story = {
  name: 'In EditorShell',
  parameters: { layout: 'fullscreen' },
  render: () => <ShellDemo />,
};
