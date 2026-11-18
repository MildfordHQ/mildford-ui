import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe';
import { Button } from '../Button';
import { Menu, MenuItem, MenuSection, MenuTrigger, SubmenuTrigger } from './Menu';

function FileMenu({ onAction = vi.fn() }: { onAction?: (key: React.Key) => void }) {
  return (
    <MenuTrigger>
      <Button>File</Button>
      <Menu aria-label="File" onAction={onAction}>
        <MenuItem id="new" shortcut="Mod+N">New design</MenuItem>
        <MenuItem id="copy" shortcut="Shift+Mod+S">Save a copy</MenuItem>
        <MenuItem id="paste">Import…</MenuItem>
        <MenuItem id="export" isDisabled description="Add a shape to export">Export PNG</MenuItem>
      </Menu>
    </MenuTrigger>
  );
}

describe('Menu', () => {
  it('opens from the trigger, supports typeahead and Enter', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<FileMenu onAction={onAction} />);
    const trigger = screen.getByRole('button', { name: 'File' });
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    const menu = await screen.findByRole('menu', { name: 'File' });
    expect(document.activeElement?.textContent).toContain('New design');
    await user.keyboard('i');
    expect(document.activeElement?.textContent).toContain('Import');
    await user.keyboard('{Enter}');
    expect(onAction.mock.calls[0][0]).toBe('paste');
    expect(menu.isConnected).toBe(false);
  });

  it('selects with Space and closes on Escape, restoring focus', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<FileMenu onAction={onAction} />);
    const trigger = screen.getByRole('button', { name: 'File' });
    await user.click(trigger);
    await screen.findByRole('menu');
    await user.keyboard('{ArrowDown}');
    await user.keyboard(' ');
    expect(onAction).toHaveBeenCalledTimes(1);

    await user.click(trigger);
    await screen.findByRole('menu');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('keeps disabled items inert, labelled and described', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<FileMenu onAction={onAction} />);
    await user.click(screen.getByRole('button', { name: 'File' }));
    const item = await screen.findByRole('menuitem', { name: 'Export PNG' });
    expect(item.getAttribute('aria-disabled')).toBe('true');
    expect(item.getAttribute('aria-describedby')).toBeTruthy();
    expect(document.getElementById(item.getAttribute('aria-describedby')!.split(' ')[0])?.textContent).toBe('Add a shape to export');
    await user.click(item);
    expect(onAction).not.toHaveBeenCalled();
    await expectNoAxeViolations(screen.getByRole('menu'));
  });

  it('renders checkbox and radio sections and a submenu', async () => {
    const user = userEvent.setup();
    render(
      <MenuTrigger>
        <Button>View</Button>
        <Menu aria-label="View">
          <MenuSection selectionMode="multiple" defaultSelectedKeys={['grid']} aria-label="Display">
            <MenuItem id="grid" shortcut="Shift+G">Show grid</MenuItem>
          </MenuSection>
          <SubmenuTrigger>
            <MenuItem id="theme">Theme</MenuItem>
            <Menu aria-label="Theme">
              <MenuSection selectionMode="single" defaultSelectedKeys={['system']} aria-label="Theme options">
                <MenuItem id="light">Light</MenuItem>
                <MenuItem id="dark">Dark</MenuItem>
                <MenuItem id="system">System</MenuItem>
              </MenuSection>
            </Menu>
          </SubmenuTrigger>
        </Menu>
      </MenuTrigger>,
    );
    await user.click(screen.getByRole('button', { name: 'View' }));
    const grid = await screen.findByRole('menuitemcheckbox', { name: 'Show grid' });
    expect(grid.getAttribute('aria-checked')).toBe('true');

    const theme = screen.getByRole('menuitem', { name: 'Theme' });
    expect(theme.getAttribute('aria-haspopup')).toBe('menu');
    theme.focus();
    await user.keyboard('{ArrowRight}');
    const submenu = await screen.findByRole('menu', { name: 'Theme' });
    expect(within(submenu).getByRole('menuitemradio', { name: 'System' }).getAttribute('aria-checked')).toBe('true');
  });

  it('lays out grid sections as menu items', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <MenuTrigger>
        <Button>Shape</Button>
        <Menu aria-label="Change shape" onAction={onAction}>
          <MenuSection layout="grid" columns={3} title="Change shape" aria-label="Change shape">
            {['Square', 'Circle', 'Triangle'].map((name) => <MenuItem key={name} id={name} icon={<span />}>{name}</MenuItem>)}
          </MenuSection>
        </Menu>
      </MenuTrigger>,
    );
    await user.click(screen.getByRole('button', { name: 'Shape' }));
    const items = await screen.findAllByRole('menuitem');
    expect(items).toHaveLength(3);
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onAction.mock.calls[0][0]).toBe('Circle');
  });
});
