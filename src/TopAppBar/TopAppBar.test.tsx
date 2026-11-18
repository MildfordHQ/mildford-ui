import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe';
import { Button } from '../Button';
import { EditorShell } from '../EditorShell';
import { IconButton } from '../IconButton';
import { TopAppBar } from './TopAppBar';

function mockWidth(width: number) {
  vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => {
    const min = Number(/min-width:\s*(\d+)px/.exec(query)?.[1] ?? 0);
    return { matches: width >= min, media: query, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false } as MediaQueryList;
  });
}

const bar = (
  <TopAppBar
    brand={<span>Sketchpad</span>}
    leading={<><Button>File</Button><Button>View</Button></>}
    title="Untitled design"
    trailing={<IconButton aria-label="Theme">T</IconButton>}
    collapsedMenu={<IconButton aria-label="More">M</IconButton>}
  />
);

describe('TopAppBar', () => {
  afterEach(() => vi.restoreAllMocks());

  it('is a banner with one toolbar and arrow-key navigation', async () => {
    mockWidth(1440);
    const user = userEvent.setup();
    render(bar);
    expect(screen.getByRole('banner')).toBeTruthy();
    expect(screen.getByRole('toolbar', { name: 'Document' })).toBeTruthy();
    expect(screen.getByText('Untitled design')).toBeTruthy();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'File' }));
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'View' }));
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Theme' }));
    await expectNoAxeViolations();
  });

  it('collapses the title and leading menus below 1024px', () => {
    mockWidth(900);
    render(bar);
    expect(screen.queryByText('Untitled design')).toBeNull();
    expect(screen.queryByRole('button', { name: 'File' })).toBeNull();
    expect(screen.getByRole('button', { name: 'More' })).toBeTruthy();
  });

  it('does not nest a second banner inside EditorShell', () => {
    mockWidth(1440);
    render(<EditorShell panelMode="docked" appBar={bar} workspace={null} />);
    expect(screen.getAllByRole('banner')).toHaveLength(1);
    expect(screen.getByRole('toolbar', { name: 'Document' })).toBeTruthy();
  });
});
