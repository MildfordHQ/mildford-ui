import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../test/axe';
import { IconButton } from '../IconButton';
import { Popover } from './Popover';

describe('Popover', () => {
  it('moves focus in on open, returns it on Escape', async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={<IconButton aria-label="Corners">C</IconButton>} aria-label="Corner options">
        <button type="button">Rounded</button>
      </Popover>,
    );
    const trigger = screen.getByRole('button', { name: 'Corners' });
    await user.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Corner options' });
    expect(dialog.contains(document.activeElement)).toBe(true);
    await expectNoAxeViolations(dialog);

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('closes on outside press', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button type="button">Elsewhere</button>
        <Popover trigger={<IconButton aria-label="Fill">F</IconButton>} aria-label="Fill color">
          <p>Swatches</p>
        </Popover>
      </div>,
    );
    await user.click(screen.getByRole('button', { name: 'Fill' }));
    expect(screen.getByRole('dialog')).toBeTruthy();
    await user.click(document.body);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('anchors to an arbitrary element with triggerRef', async () => {
    function Anchored() {
      const anchor = useRef<HTMLDivElement>(null);
      const [open, setOpen] = useState(true);
      return (
        <>
          <div ref={anchor}>Selection</div>
          <Popover triggerRef={anchor} isOpen={open} onOpenChange={setOpen} aria-label="Selection actions">
            {(close) => <button type="button" onClick={close}>Done</button>}
          </Popover>
        </>
      );
    }
    const user = userEvent.setup();
    render(<Anchored />);
    expect(screen.getByRole('dialog', { name: 'Selection actions' })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
