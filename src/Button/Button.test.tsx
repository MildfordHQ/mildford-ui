import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe';
import { Button } from './Button';

describe('Button', () => {
  it('activates with click and keyboard via onClick and onPress', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onPress = vi.fn();
    render(<Button onClick={onClick} onPress={onPress}>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0].type).toBe('click');
    button.focus();
    await user.keyboard('{Enter}');
    fireEvent.keyDown(button, { key: ' ' });
    fireEvent.keyUp(button, { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(3);
    expect(onPress).toHaveBeenCalledTimes(3);
  });

  it('submits its form', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    render(<form onSubmit={onSubmit}><Button type="submit" variant="primary">Run</Button></form>);
    await user.click(screen.getByRole('button', { name: 'Run' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('keeps native attributes and forwards the ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref} title="Opens the run" data-testid="b" name="action" value="open" isSelected>Open</Button>);
    const button = screen.getByTestId('b');
    expect(ref.current).toBe(button);
    expect(button.getAttribute('title')).toBe('Opens the run');
    expect(button.getAttribute('name')).toBe('action');
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.getAttribute('type')).toBe('button');
  });

  it('isPending sets aria-busy and blocks presses', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onPress = vi.fn();
    render(<Button isPending pendingLabel="Saving" onClick={onClick} onPress={onPress}>Save</Button>);
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.textContent).toContain('Saving');
    await user.click(button);
    expect(onPress).not.toHaveBeenCalled();
    await expectNoAxeViolations();
  });

  it('isDisabled blocks presses', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button isDisabled onClick={onClick}>Delete</Button>);
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button.hasAttribute('disabled')).toBe(true);
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
