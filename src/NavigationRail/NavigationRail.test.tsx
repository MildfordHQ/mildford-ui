import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import type { Key } from 'react-aria-components';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EditorShell } from '../EditorShell';
import { expectNoAxeViolations } from '../test/axe';
import { NavigationRail, NavigationRailDivider, NavigationRailItem, type NavigationRailProps } from './NavigationRail';

const glyph = (name: string) => <svg data-glyph={name} viewBox="0 0 24 24"><rect width="24" height="24" /></svg>;

const TOOLS = [
  { id: 'select', label: 'Select', shortcut: 'V' },
  { id: 'split', label: 'Split', shortcut: 'S' },
  { id: 'pan', label: 'Pan', shortcut: 'H' },
  { id: 'square', label: 'Square', shortcut: '1' },
  { id: 'circle', label: 'Circle', shortcut: '2' },
  { id: 'triangle', label: 'Triangle', shortcut: '3' },
  { id: 'gradient', label: 'Gradient', shortcut: 'G' },
];

function Rail({
  onSelectionChange = () => {},
  onPaletteChange = () => {},
  onDoubleClick,
  ...props
}: Partial<Omit<NavigationRailProps, 'onSelectionChange'>> & {
  onSelectionChange?: (key: Key) => void;
  onPaletteChange?: (selected: boolean) => void;
  onDoubleClick?: () => void;
}) {
  const [tool, setTool] = useState<Key | null>('select');
  const [palette, setPalette] = useState(false);
  const [doc, setDoc] = useState(false);
  return (
    <NavigationRail
      aria-label="Tools"
      selectedKey={tool}
      onSelectionChange={(key) => { setTool(key); onSelectionChange(key); }}
      footer={
        <>
          <NavigationRailDivider />
          <NavigationRailItem
            icon={glyph('palette')}
            label="Palette"
            shortcut="P"
            isSelected={palette}
            onChange={(selected) => { setPalette(selected); onPaletteChange(selected); }}
          />
          <NavigationRailItem icon={glyph('tune')} label="Document" shortcut="D" isSelected={doc} onChange={setDoc} />
        </>
      }
      {...props}
    >
      {TOOLS.map((tool) => (
        <NavigationRailItem
          key={tool.id}
          id={tool.id}
          icon={glyph(tool.id)}
          activeIcon={glyph(`${tool.id}-fill`)}
          label={tool.label}
          shortcut={tool.shortcut}
          badge={tool.id === 'square' ? glyph('lock') : undefined}
          tooltip={tool.id === 'square' ? 'Square · 1 — Shift-click or double-click to lock' : undefined}
          onDoubleClick={tool.id === 'square' ? onDoubleClick : undefined}
        />
      ))}
    </NavigationRail>
  );
}

describe('NavigationRail (rail)', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('exposes tools as a single-select radio group driven by selectedKey', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<Rail variant="rail" onSelectionChange={onSelectionChange} />);
    const group = screen.getByRole('radiogroup', { name: 'Tools' });
    expect(within(group).getAllByRole('radio')).toHaveLength(7);
    const select = screen.getByRole('radio', { name: 'Select' });
    const pan = screen.getByRole('radio', { name: 'Pan' });
    expect(select.getAttribute('aria-checked')).toBe('true');
    await user.click(pan);
    expect(onSelectionChange).toHaveBeenLastCalledWith('pan');
    expect(pan.getAttribute('aria-checked')).toBe('true');
    expect(select.getAttribute('aria-checked')).toBe('false');
    // Pressing the active tool keeps exactly one pressed and does not re-notify.
    await user.click(pan);
    expect(pan.getAttribute('aria-checked')).toBe('true');
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    await expectNoAxeViolations();
  });

  it('moves focus between tools with arrow keys', async () => {
    const user = userEvent.setup();
    render(<Rail variant="rail" />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'Select' }));
    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'Split' }));
    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'Pan' }));
    await user.keyboard('{ArrowUp}');
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'Split' }));
  });

  it('keeps footer toggles independent (aria-pressed)', async () => {
    const user = userEvent.setup();
    const onPaletteChange = vi.fn();
    render(<Rail variant="rail" onPaletteChange={onPaletteChange} />);
    const palette = screen.getByRole('button', { name: 'Palette' });
    const doc = screen.getByRole('button', { name: 'Document' });
    expect(palette.getAttribute('aria-pressed')).toBe('false');
    await user.click(palette);
    await user.click(doc);
    expect(onPaletteChange).toHaveBeenLastCalledWith(true);
    expect(palette.getAttribute('aria-pressed')).toBe('true');
    expect(doc.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('radio', { name: 'Select' }).getAttribute('aria-checked')).toBe('true');
    await user.click(palette);
    expect(palette.getAttribute('aria-pressed')).toBe('false');
    expect(doc.getAttribute('aria-pressed')).toBe('true');
  });

  it('swaps to activeIcon when selected', async () => {
    const user = userEvent.setup();
    render(<Rail variant="rail" />);
    const circle = screen.getByRole('radio', { name: 'Circle' });
    expect(circle.querySelector('[data-glyph="circle"]')).not.toBeNull();
    await user.click(circle);
    expect(circle.querySelector('[data-glyph="circle-fill"]')).not.toBeNull();
    expect(circle.querySelector('[data-glyph="circle"]')).toBeNull();
    expect(screen.getByRole('radio', { name: 'Select' }).querySelector('[data-glyph="select"]')).not.toBeNull();
  });

  it('renders the badge aria-hidden and passes double-click through', async () => {
    const user = userEvent.setup();
    const onDoubleClick = vi.fn();
    render(<Rail variant="rail" onDoubleClick={onDoubleClick} />);
    const square = screen.getByRole('radio', { name: 'Square' });
    const badge = square.querySelector('[data-glyph="lock"]')?.parentElement;
    expect(badge?.getAttribute('aria-hidden')).toBe('true');
    expect(screen.getByRole('radio', { name: 'Circle' }).querySelector('[data-glyph="lock"]')).toBeNull();
    await user.dblClick(square);
    expect(onDoubleClick).toHaveBeenCalledTimes(1);
    expect(square.getAttribute('aria-checked')).toBe('true');
  });

  it('shows the tooltip with the shortcut on keyboard focus', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Rail variant="rail" />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'Select' }));
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip.textContent).toContain('Select');
    expect(tooltip.querySelector('kbd kbd')?.textContent).toBe('V');
    expect(tooltip.getAttribute('data-placement')).toBe('right');

    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'Square' }));
    act(() => { vi.advanceTimersByTime(1000); });
    const next = await screen.findByRole('tooltip');
    expect(next.textContent).toContain('Square · 1 — Shift-click or double-click to lock');
    expect(next.querySelector('kbd kbd')?.textContent).toBe('1');
  });
});

describe('NavigationRail (bar)', () => {
  it('shows maxBarItems entries including More, and More opens a sheet with the rest', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<Rail variant="bar" onSelectionChange={onSelectionChange} />);
    expect(screen.getAllByRole('radio').map((radio) => radio.textContent)).toEqual(['Select', 'Split', 'Pan', 'Square']);
    expect(screen.queryByRole('button', { name: 'Palette' })).toBeNull();
    const more = screen.getByRole('button', { name: 'More' });
    await expectNoAxeViolations();

    await user.click(more);
    const sheet = await screen.findByRole('dialog', { name: 'More' });
    expect(within(sheet).getAllByRole('radio').map((radio) => radio.textContent)).toEqual(['Circle', 'Triangle', 'Gradient']);
    expect(within(sheet).getByRole('button', { name: 'Palette' })).toBeTruthy();
    expect(within(sheet).getByRole('button', { name: 'Document' })).toBeTruthy();
    await expectNoAxeViolations();

    await user.click(within(sheet).getByRole('radio', { name: 'Triangle' }));
    expect(onSelectionChange).toHaveBeenLastCalledWith('triangle');
    await vi.waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(more.getAttribute('data-has-selection')).toBe('true');
  });

  it('toggles a footer entry from the sheet', async () => {
    const user = userEvent.setup();
    const onPaletteChange = vi.fn();
    render(<Rail variant="bar" onPaletteChange={onPaletteChange} />);
    await user.click(screen.getByRole('button', { name: 'More' }));
    const sheet = await screen.findByRole('dialog', { name: 'More' });
    await user.click(within(sheet).getByRole('button', { name: 'Palette' }));
    expect(onPaletteChange).toHaveBeenLastCalledWith(true);
    await vi.waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('shows every entry without More when they fit', () => {
    render(<Rail variant="bar" maxBarItems={9} />);
    expect(screen.getAllByRole('radio')).toHaveLength(7);
    expect(screen.getByRole('button', { name: 'Palette' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'More' })).toBeNull();
  });

  it('auto variant follows the EditorShell rail placement', async () => {
    const { rerender } = render(
      <EditorShell railPlacement="bottom" appBar={<span>App</span>} rail={<Rail />} workspace={<div />} />,
    );
    expect(screen.getByRole('button', { name: 'More' })).toBeTruthy();
    await expectNoAxeViolations();
    rerender(<EditorShell railPlacement="start" appBar={<span>App</span>} rail={<Rail />} workspace={<div />} />);
    expect(screen.queryByRole('button', { name: 'More' })).toBeNull();
    expect(screen.getAllByRole('radio')).toHaveLength(7);
    await expectNoAxeViolations();
  });
});
