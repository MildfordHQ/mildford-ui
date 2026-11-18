import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { demoIcons } from '../stories/demoIcons';
import { Menu, MenuItem, MenuSection, MenuTrigger, SubmenuTrigger } from './Menu';

const meta = {
  title: 'Primitives/Menus and overlays/Menu',
  component: Menu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'M3 menu on RAC `MenuTrigger` / `Menu`: `surface-container`, `corner.medium`, elevation 2, 220px min width, 48px rows (`density="compact"` = 40px), leading 24px icon, trailing `Kbd`, destructive items in `error`. Checkbox and radio items come from `selectionMode` on a `MenuSection`; `SubmenuTrigger` nests menus; `MenuSection layout="grid"` lays items out as cells. Disabled items are inert and skipped by arrow keys (React Aria behaviour) — put the reason in `description`.',
      },
    },
  },
  args: { children: null },
} satisfies Meta<typeof Menu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FileMenu: Story = {
  name: 'File menu',
  render: () => (
    <MenuTrigger>
      <Button>File</Button>
      <Menu aria-label="File" onAction={(key) => console.info('action', key)}>
        <MenuItem id="new" icon={<Icon>{demoIcons.add}</Icon>}>New design</MenuItem>
        <MenuSection aria-label="Copies">
          <MenuItem id="copy" icon={<Icon>{demoIcons.copy}</Icon>} shortcut="Shift+Mod+S">Save a copy</MenuItem>
          <MenuItem id="paste" icon={<Icon>{demoIcons.paste}</Icon>}>Import…</MenuItem>
        </MenuSection>
        <MenuSection aria-label="Export">
          <MenuItem id="export" icon={<Icon>{demoIcons.download}</Icon>} isDisabled description="Add a shape to export">Export PNG</MenuItem>
        </MenuSection>
      </Menu>
    </MenuTrigger>
  ),
};

export const ViewMenu: Story = {
  name: 'View menu (checkbox, radio, submenu)',
  render: () => (
    <MenuTrigger>
      <Button>View</Button>
      <Menu aria-label="View">
        <MenuSection selectionMode="multiple" defaultSelectedKeys={['grid']} aria-label="Display">
          <MenuItem id="grid" shortcut="Shift+G">Show grid</MenuItem>
        </MenuSection>
        <SubmenuTrigger>
          <MenuItem id="theme" icon={<Icon>{demoIcons.darkMode}</Icon>}>Theme</MenuItem>
          <Menu aria-label="Theme">
            <MenuSection selectionMode="single" defaultSelectedKeys={['system']} aria-label="Theme options">
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
  ),
};

const SHAPES = [
  { id: 'rect', name: 'Rectangle', d: 'M4 4h20v20H4z' },
  { id: 'rounded', name: 'Rounded rectangle', d: 'M8 4h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z' },
  { id: 'ellipse', name: 'Ellipse', d: 'M14 4a10 10 0 1 1 0 20 10 10 0 0 1 0-20z' },
  { id: 'triangle', name: 'Triangle', d: 'M14 4l10 20H4z' },
  { id: 'diamond', name: 'Diamond', d: 'M14 4l10 10-10 10L4 14z' },
  { id: 'hexagon', name: 'Hexagon', d: 'M9 5h10l5 9-5 9H9l-5-9z' },
];

export const ShapeGrid: Story = {
  name: 'Grid section (6-up shapes)',
  render: () => (
    <MenuTrigger>
      <IconButton aria-label="Shape" tooltip="Shape"><Icon>{demoIcons.shapes}</Icon></IconButton>
      <Menu aria-label="Change shape">
        <MenuSection layout="grid" columns={6} title="Change shape" aria-label="Change shape">
          {SHAPES.map((shape) => (
            <MenuItem key={shape.id} id={shape.id} textValue={shape.name} icon={<svg viewBox="0 0 28 28" width={28} height={28}><path d={shape.d} fill="var(--mild-color-action)" /></svg>}>
              {shape.name}
            </MenuItem>
          ))}
        </MenuSection>
        <MenuSection aria-label="Object">
          <MenuItem id="delete" destructive icon={<Icon>{demoIcons.delete}</Icon>} shortcut="Backspace">Delete</MenuItem>
        </MenuSection>
      </Menu>
    </MenuTrigger>
  ),
};
