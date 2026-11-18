import { useState } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe';
import { Dialog } from './Dialog';

function Harness({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Open</button>
      <Dialog
        isOpen={open}
        onOpenChange={(next) => { onOpenChange?.(next); setOpen(next); }}
        title="Stop production run?"
        description="Active agents finish their current step first."
        footer={<button type="button" onClick={() => setOpen(false)}>Cancel</button>}
        className="consumer-class"
        closeLabel="Close"
      >
        <input aria-label="Reason" />
      </Dialog>
    </>
  );
}

describe('Dialog', () => {
  it('is labelled by the title and described by the description', () => {
    render(<Dialog isOpen onOpenChange={() => undefined} title="Rename design" description="Shown in the file list.">Body</Dialog>);
    const dialog = screen.getByRole('dialog');
    const labelledBy = dialog.getAttribute('aria-labelledby') ?? '';
    expect(document.getElementById(labelledBy)?.textContent).toBe('Rename design');
    const describedBy = dialog.getAttribute('aria-describedby') ?? '';
    expect(document.getElementById(describedBy)?.textContent).toBe('Shown in the file list.');
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Rename design');
  });

  it('applies className to the sized modal box and size classes when asked', () => {
    const { rerender } = render(<Dialog isOpen onOpenChange={() => undefined} title="T" className="timeline-dialog">Body</Dialog>);
    const box = document.querySelector('.timeline-dialog');
    expect(box).not.toBeNull();
    expect(box?.contains(screen.getByRole('dialog'))).toBe(true);
    rerender(<Dialog isOpen onOpenChange={() => undefined} title="T" className="timeline-dialog" size="lg">Body</Dialog>);
    expect(document.querySelector('.timeline-dialog')?.className).toMatch(/lg/);
  });

  it('renders nothing when closed', () => {
    render(<Dialog isOpen={false} onOpenChange={() => undefined} title="Hidden">Body</Dialog>);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('traps focus and returns it to the trigger on close', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);
    const dialog = screen.getByRole('dialog');
    expect(dialog.contains(document.activeElement)).toBe(true);
    for (let i = 0; i < 6; i += 1) {
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('Escape calls onOpenChange(false)', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Harness onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('dialog')).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Open' })));
  });

  it('the close button calls onOpenChange(false)', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Dialog isOpen onOpenChange={onOpenChange} title="T" closeLabel="Close">Body</Dialog>);
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('a press on the scrim calls onOpenChange(false)', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Dialog isOpen onOpenChange={onOpenChange} title="T">Body</Dialog>);
    const dialog = screen.getByRole('dialog');
    const overlay = dialog.parentElement?.parentElement as HTMLElement;
    await act(async () => { await user.pointer({ keys: '[MouseLeft]', target: overlay }); });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('has no axe violations', async () => {
    render(<Dialog isOpen onOpenChange={() => undefined} title="Rename design" description="Shown in the file list." footer={<button type="button">Save</button>}><label>Name <input /></label></Dialog>);
    await expectNoAxeViolations(document.body);
  });
});
