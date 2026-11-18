import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../test/axe';
import { EditorShell } from '../EditorShell';
import { IconButton } from '../IconButton';
import { Separator } from '../Separator';
import { ToggleButton } from '../ToggleButton';
import { FloatingToolbar, Toolbar } from './Toolbar';

function ObjectToolbar() {
  return (
    <>
      <button type="button">Before</button>
      <Toolbar aria-label="Object">
        <IconButton aria-label="Fill">F</IconButton>
        <IconButton aria-label="Stroke">C</IconButton>
        <Separator />
        <ToggleButton aria-label="Show grid">G</ToggleButton>
        <IconButton aria-label="Delete">D</IconButton>
      </Toolbar>
      <button type="button">After</button>
    </>
  );
}

describe('Toolbar', () => {
  it('moves focus with arrows and Home/End', async () => {
    const user = userEvent.setup();
    render(<ObjectToolbar />);
    screen.getByRole('button', { name: 'Before' }).focus();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Fill' }));
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Stroke' }));
    await user.keyboard('{End}');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Delete' }));
    await user.keyboard('{Home}');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Fill' }));
  });

  it('is labelled, and its separators are vertical', async () => {
    render(<ObjectToolbar />);
    const toolbar = screen.getByRole('toolbar', { name: 'Object' });
    expect(toolbar.querySelector('[role="separator"]')?.getAttribute('aria-orientation')).toBe('vertical');
    await expectNoAxeViolations(toolbar);
  });

  it('draws its divider only outside EditorShell', () => {
    const { rerender } = render(<Toolbar aria-label="Idle"><IconButton aria-label="Fit">F</IconButton></Toolbar>);
    expect(screen.getByRole('toolbar').hasAttribute('data-divider')).toBe(true);
    rerender(<EditorShell panelMode="docked" appBar={null} workspace={null} toolbar={<Toolbar aria-label="Idle"><IconButton aria-label="Fit">F</IconButton></Toolbar>} />);
    expect(screen.getByRole('toolbar').hasAttribute('data-divider')).toBe(false);
  });
});

describe('FloatingToolbar', () => {
  it('is a labelled toolbar with optional placement', async () => {
    render(
      <FloatingToolbar aria-label="Zoom" position="bottom-end">
        <IconButton size="sm" aria-label="Zoom out">−</IconButton>
        <IconButton size="sm" aria-label="Zoom in">+</IconButton>
      </FloatingToolbar>,
    );
    const toolbar = screen.getByRole('toolbar', { name: 'Zoom' });
    expect(toolbar.getAttribute('data-position')).toBe('bottom-end');
    await expectNoAxeViolations(toolbar);
  });
});
