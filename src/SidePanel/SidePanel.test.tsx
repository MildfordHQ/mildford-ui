import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createPortal } from 'react-dom';
import { describe, expect, it, vi } from 'vitest';
import { EditorShell } from '../EditorShell';
import { expectNoAxeViolations } from '../test/axe';
import { SidePanel } from './SidePanel';

/** Lets the overlay's deferred outside-press decision run. */
const flushTask = () => act(() => new Promise<void>((resolve) => setTimeout(resolve, 0)));

function DocumentPanel(props: Partial<React.ComponentProps<typeof SidePanel>>) {
  return (
    <SidePanel title="Document" onClose={() => {}} footer={<span>1920 × 1080 px · 12 layers</span>} {...props}>
      <label>
        Design name <input defaultValue="Untitled design" />
      </label>
    </SidePanel>
  );
}

function shell(panelMode: 'docked' | 'overlay' | 'sheet', panel: React.ReactNode, onPanelDismiss = () => {}) {
  return (
    <EditorShell
      panelMode={panelMode}
      appBar={<span>Sketchpad</span>}
      panel={panel}
      panelLabel="Document panel"
      onPanelDismiss={onPanelDismiss}
      workspace={<div>Stage</div>}
    />
  );
}

describe('SidePanel standalone', () => {
  it('docked: is a dialog labelled by its title, with header, body and footer', async () => {
    const { container } = render(<DocumentPanel />);
    const dialog = screen.getByRole('dialog', { name: 'Document' });
    expect(dialog.getAttribute('aria-modal')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Document' })).toBeTruthy();
    expect(dialog.textContent).toContain('1920 × 1080 px');
    await expectNoAxeViolations(container);
  });

  it('close button calls onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<DocumentPanel onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: 'Close panel' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('uses a custom close label', () => {
    render(<DocumentPanel closeLabel="Close document settings" />);
    expect(screen.getByRole('button', { name: 'Close document settings' })).toBeTruthy();
  });

  it('docked: Escape with focus inside calls onClose without trapping focus', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <>
        <DocumentPanel onClose={onClose} />
        <button type="button">Stage control</button>
      </>,
    );
    await user.click(screen.getByRole('textbox', { name: 'Design name' }));
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);

    // Non-modal: Tab leaves the panel.
    screen.getByRole('button', { name: 'Close panel' }).focus();
    await user.tab();
    await user.tab();
    expect(document.activeElement?.textContent).toBe('Stage control');
  });

  it('isOpen={false} renders nothing', () => {
    render(<DocumentPanel isOpen={false} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('overlay: outside pointerdown calls onClose, inside does not', async () => {
    const onClose = vi.fn();
    render(
      <>
        <DocumentPanel mode="overlay" onClose={onClose} />
        <div>Stage</div>
      </>,
    );
    fireEvent.pointerDown(screen.getByRole('textbox', { name: 'Design name' }));
    await flushTask();
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.pointerDown(screen.getByText('Stage'));
    await flushTask();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('overlay: a press inside an overlay the panel portaled out does not close it', async () => {
    const onClose = vi.fn();
    render(
      <SidePanel title="Document" mode="overlay" onClose={onClose}>
        {createPortal(<div>Color picker popover</div>, document.body)}
      </SidePanel>,
    );
    fireEvent.pointerDown(screen.getByText('Color picker popover'));
    await flushTask();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('overlay: Escape calls onClose; axe clean', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container } = render(<DocumentPanel mode="overlay" onClose={onClose} />);
    await user.click(screen.getByRole('textbox', { name: 'Design name' }));
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
    await expectNoAxeViolations(container);
  });

  it('sheet: renders one dialog labelled by the title with the drag handle', async () => {
    render(<DocumentPanel mode="sheet" />);
    const dialogs = screen.getAllByRole('dialog');
    expect(dialogs).toHaveLength(1);
    expect(dialogs[0].getAttribute('aria-labelledby')).toBe(screen.getByRole('heading', { name: 'Document' }).id);
    expect(screen.getByRole('dialog', { name: 'Document' })).toBeTruthy();
    await expectNoAxeViolations(document.body);
  });

  it('sheet: Escape closes through onOpenChange', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<DocumentPanel mode="sheet" onClose={onClose} />);
    await user.click(screen.getByRole('textbox', { name: 'Design name' }));
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
    // Swipe-to-dismiss cannot be exercised in jsdom; the Storybook story is the real check.
  });
});

describe('SidePanel inside EditorShell', () => {
  it('overlay region: Escape dismisses once through the shell, not through onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onPanelDismiss = vi.fn();
    render(shell('overlay', <DocumentPanel onClose={onClose} mode="docked" />, onPanelDismiss));
    await user.click(screen.getByRole('textbox', { name: 'Design name' }));
    await user.keyboard('{Escape}');
    expect(onPanelDismiss).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('overlay region: the close button still calls onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onPanelDismiss = vi.fn();
    render(shell('overlay', <DocumentPanel onClose={onClose} />, onPanelDismiss));
    await user.click(screen.getByRole('button', { name: 'Close panel' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onPanelDismiss).not.toHaveBeenCalled();
  });

  it('docked region: Escape calls onClose once; the panel sits in the shell landmark', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onPanelDismiss = vi.fn();
    render(shell('docked', <DocumentPanel onClose={onClose} mode="overlay" />, onPanelDismiss));
    const aside = screen.getByRole('complementary', { name: 'Document panel' });
    expect(aside.contains(screen.getByRole('dialog', { name: 'Document' }))).toBe(true);
    await user.click(screen.getByRole('textbox', { name: 'Design name' }));
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onPanelDismiss).not.toHaveBeenCalled();
    await expectNoAxeViolations();
  });

  it('docked region: ignores the standalone mode (no fixed overlay, no outside-press listener)', async () => {
    const onClose = vi.fn();
    render(shell('docked', <DocumentPanel onClose={onClose} mode="overlay" />));
    expect(screen.getByRole('dialog', { name: 'Document' }).closest('[data-mode]')?.getAttribute('data-mode')).toBe('docked');
    fireEvent.pointerDown(screen.getByText('Stage'));
    await flushTask();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('sheet region: does not nest a dialog; the title heading is rendered', async () => {
    render(shell('sheet', <DocumentPanel mode="docked" />));
    const dialogs = screen.getAllByRole('dialog');
    expect(dialogs).toHaveLength(1);
    expect(dialogs[0].contains(screen.getByRole('heading', { name: 'Document' }))).toBe(true);
    // The shell's SheetContent carries aria-label={panelLabel}, which RAC prefers over the title slot.
    expect(dialogs[0].getAttribute('aria-label')).toBe('Document panel');
    await expectNoAxeViolations(document.body);
  });
});
