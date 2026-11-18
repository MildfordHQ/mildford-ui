/**
 * Shared editor-chrome demo pieces for stories (placeholder content).
 * Not exported from the package.
 */
import { useState } from 'react';
import { Button } from '../Button';
import { ButtonGroup } from '../ButtonGroup';
import { Chip } from '../Chip';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { Menu, MenuItem, MenuSection, MenuTrigger, SubmenuTrigger } from '../Menu';
import { SplitButton } from '../SplitButton';
import { TopAppBar } from '../TopAppBar';
import { Tooltip } from '../Tooltip';
import { demoIcons } from './demoIcons';

export function BrandMark() {
  return (
    <>
      <svg width={28} height={28} viewBox="0 0 28 28" aria-hidden="true">
        <rect x="2" y="2" width="11" height="11" rx="3" fill="var(--mild-color-action)" />
        <rect x="15" y="2" width="11" height="11" rx="5.5" fill="var(--mild-color-selected)" />
        <rect x="2" y="15" width="11" height="11" rx="5.5" fill="var(--mild-color-selected)" />
        <path d="M15 26V15h11z" fill="var(--mild-color-action)" />
      </svg>
      Sketchpad
    </>
  );
}

export function FileMenu() {
  return (
    <MenuTrigger>
      <Button size="small">File</Button>
      <Menu aria-label="File">
        <MenuItem id="new" icon={<Icon>{demoIcons.add}</Icon>}>New design</MenuItem>
        <MenuSection aria-label="JSON">
          <MenuItem id="copy" icon={<Icon>{demoIcons.copy}</Icon>} shortcut="Shift+Mod+S">Save a copy</MenuItem>
          <MenuItem id="paste" icon={<Icon>{demoIcons.paste}</Icon>}>Import…</MenuItem>
        </MenuSection>
        <MenuSection aria-label="Export">
          <MenuItem id="png" icon={<Icon>{demoIcons.download}</Icon>} isDisabled description="Add a shape to export">Export PNG</MenuItem>
        </MenuSection>
      </Menu>
    </MenuTrigger>
  );
}

export function ViewMenu({ theme, onTheme }: { theme: string; onTheme: (theme: string) => void }) {
  return (
    <MenuTrigger>
      <Button size="small">View</Button>
      <Menu aria-label="View">
        <MenuSection selectionMode="multiple" defaultSelectedKeys={['grid']} aria-label="Display">
          <MenuItem id="grid" icon={<Icon>{demoIcons.grid}</Icon>} shortcut="Shift+G">Show grid</MenuItem>
        </MenuSection>
        <SubmenuTrigger>
          <MenuItem id="theme" icon={<Icon>{demoIcons.darkMode}</Icon>}>Theme</MenuItem>
          <Menu aria-label="Theme">
            <MenuSection selectionMode="single" selectedKeys={[theme]} onSelectionChange={(keys) => { const [key] = [...(keys as Set<string>)]; if (key) onTheme(key); }} aria-label="Theme options">
              <MenuItem id="light">Light</MenuItem>
              <MenuItem id="dark">Dark</MenuItem>
              <MenuItem id="system">System</MenuItem>
            </MenuSection>
          </Menu>
        </SubmenuTrigger>
        <MenuSection aria-label="Zoom">
          <MenuItem id="fit" icon={<Icon>{demoIcons.fitScreen}</Icon>} shortcut="⇧1">Zoom to fit</MenuItem>
          <MenuItem id="in" icon={<Icon>{demoIcons.zoomIn}</Icon>} shortcut="Mod+=">Zoom in</MenuItem>
          <MenuItem id="out" icon={<Icon>{demoIcons.zoomOut}</Icon>} shortcut="Mod+-">Zoom out</MenuItem>
          <MenuItem id="100" shortcut="Mod+0">Zoom to 100%</MenuItem>
        </MenuSection>
        <MenuSection aria-label="Help">
          <MenuItem id="shortcuts" icon={<Icon>{demoIcons.keyboard}</Icon>} shortcut="?">Keyboard shortcuts</MenuItem>
        </MenuSection>
      </Menu>
    </MenuTrigger>
  );
}

const THEMES = ['light', 'dark', 'system'] as const;

/** Top app bar demo for a drawing editor. */
export function EditorAppBar() {
  const [theme, setTheme] = useState<string>('system');
  const next = THEMES[(THEMES.indexOf(theme as (typeof THEMES)[number]) + 1) % THEMES.length];
  return (
    <TopAppBar
      brand={<BrandMark />}
      leading={
        <>
          <FileMenu />
          <ViewMenu theme={theme} onTheme={setTheme} />
          <ButtonGroup connected aria-label="History">
            <IconButton aria-label="Undo" tooltip="Undo" shortcut="Mod+Z"><Icon>{demoIcons.undo}</Icon></IconButton>
            <IconButton aria-label="Redo" tooltip="Redo" shortcut="Shift+Mod+Z" isDisabled><Icon>{demoIcons.redo}</Icon></IconButton>
          </ButtonGroup>
        </>
      }
      status={
        <Tooltip placement="bottom" trigger={<Chip icon={<Icon size={20}>{demoIcons.history}</Icon>}>Saved locally</Chip>}>
          This design is stored in this browser.
        </Tooltip>
      }
      title="Untitled design"
      trailing={
        <>
          <IconButton aria-label={`Theme: ${theme}`} tooltip={`Theme: ${theme} (switch to ${next})`} onPress={() => setTheme(next)}>
            <Icon>{theme === 'dark' ? demoIcons.darkMode : demoIcons.lightMode}</Icon>
          </IconButton>
          <SplitButton
            icon={<Icon size={20}>{demoIcons.share}</Icon>}
            isDisabled
            menuLabel="Export options"
            menu={
              <>
                <MenuItem id="png" isDisabled description="Add a shape to export">Export PNG</MenuItem>
                <MenuItem id="copy" shortcut="Shift+Mod+S">Save a copy</MenuItem>
                <MenuItem id="paste">Import…</MenuItem>
              </>
            }
          >
            Export
          </SplitButton>
        </>
      }
      collapsedMenu={
        <MenuTrigger>
          <IconButton aria-label="Menu" tooltip="Menu"><Icon>{demoIcons.moreVert}</Icon></IconButton>
          <Menu aria-label="Menu">
            <MenuItem id="new">New design</MenuItem>
            <MenuItem id="copy">Save a copy</MenuItem>
            <MenuItem id="fit" shortcut="⇧1">Zoom to fit</MenuItem>
            <MenuItem id="shortcuts" shortcut="?">Keyboard shortcuts</MenuItem>
          </Menu>
        </MenuTrigger>
      }
    />
  );
}
