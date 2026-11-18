import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '../Icon';
import { MenuItem, MenuSection } from '../Menu';
import { demoIcons } from '../stories/demoIcons';
import { SplitButton } from './SplitButton';

const exportMenu = (
  <>
    <MenuSection aria-label="Export">
      <MenuItem id="png" icon={<Icon>{demoIcons.download}</Icon>} isDisabled description="Add a shape to export">Export PNG</MenuItem>
    </MenuSection>
    <MenuSection aria-label="JSON">
      <MenuItem id="copy" icon={<Icon>{demoIcons.copy}</Icon>} shortcut="Shift+Mod+S">Save a copy</MenuItem>
      <MenuItem id="paste" icon={<Icon>{demoIcons.paste}</Icon>}>Import…</MenuItem>
    </MenuSection>
  </>
);

const meta = {
  title: 'Primitives/Actions/SplitButton',
  component: SplitButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'M3 split button: a main action and an attached menu trigger, connected inner corners, one group named by the main label. Disabling the main action leaves the menu available. The trailing half rounds fully while its menu is open.' } },
  },
  args: { children: 'Export', icon: <Icon size={20}>{demoIcons.share}</Icon>, menu: exportMenu, menuLabel: 'Export options' },
} satisfies Meta<typeof SplitButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ExportDisabled: Story = { name: 'Export (main action disabled)', args: { isDisabled: true } };
export const Enabled: Story = { args: { tooltip: 'Export PNG' } };
export const Tonal: Story = { args: { variant: 'tonal' } };
export const Outlined: Story = { args: { variant: 'outlined' } };
