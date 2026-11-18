import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('controlled: click toggles and onChange receives event.target.checked', async () => {
    const user = userEvent.setup();
    const seen: boolean[] = [];
    function Controlled() {
      const [force, setForce] = useState(false);
      return <Checkbox isSelected={force} className="submit-form__checkbox" label="Force re-analyze" onChange={(event) => { seen.push(event.target.checked); setForce(event.target.checked); }} />;
    }
    render(<Controlled />);
    const input = screen.getByRole('checkbox', { name: 'Force re-analyze' }) as HTMLInputElement;
    expect(input.checked).toBe(false);
    await user.click(input);
    expect(seen).toEqual([true]);
    expect(input.checked).toBe(true);
    await user.click(screen.getByText('Force re-analyze'));
    expect(seen).toEqual([true, false]);
    expect(input.checked).toBe(false);
  });

  it('controlled: the DOM stays in sync when the owner rejects the change', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn((event: { target: HTMLInputElement }) => event.target.checked);
    render(<Checkbox isSelected={false} label="Locked" onChange={onChange} />);
    const input = screen.getByRole('checkbox', { name: 'Locked' }) as HTMLInputElement;
    await user.click(input);
    expect(onChange).toHaveReturnedWith(true);
    expect(input.checked).toBe(false);
  });

  it('uncontrolled: defaultSelected, click and keyboard toggle', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn((event: { target: HTMLInputElement; currentTarget: HTMLInputElement }) => [event.target.checked, event.currentTarget === event.target]);
    render(<Checkbox defaultSelected label="Require approval" name="approval" value="yes" onChange={onChange} />);
    const input = screen.getByRole('checkbox', { name: 'Require approval' }) as HTMLInputElement;
    expect(input.checked).toBe(true);
    expect(input.name).toBe('approval');
    expect(input.value).toBe('yes');
    await user.click(input);
    expect(input.checked).toBe(false);
    expect(onChange).toHaveLastReturnedWith([false, true]);
    input.focus();
    await user.keyboard(' ');
    expect(input.checked).toBe(true);
    expect(onChange).toHaveLastReturnedWith([true, true]);
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('forwards the ref to the <input> and honours id and isDisabled', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    render(<Checkbox ref={ref} id="force" isDisabled label="Force" onChange={onChange} />);
    expect(ref.current?.tagName).toBe('INPUT');
    expect(ref.current?.type).toBe('checkbox');
    expect(ref.current?.id).toBe('force');
    expect(ref.current?.disabled).toBe(true);
    await user.click(screen.getByText('Force'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('wires description and error through aria-describedby and sets aria-invalid', () => {
    const { rerender } = render(<Checkbox id="gate" label="Gate" description="Pauses the workflow." aria-describedby="external" isRequired />);
    const input = screen.getByRole('checkbox', { name: 'Gate' }) as HTMLInputElement;
    expect(input.required).toBe(true);
    expect(input.getAttribute('aria-describedby')?.split(' ')).toEqual(expect.arrayContaining(['external', 'gate-description']));
    expect(document.getElementById('gate-description')?.textContent).toBe('Pauses the workflow.');
    rerender(<Checkbox id="gate" label="Gate" description="Pauses the workflow." error="Approval is required." isRequired />);
    expect(input.getAttribute('aria-describedby')).toBe('gate-error');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByRole('alert').textContent).toBe('Approval is required.');
  });

  it('has no axe violations', async () => {
    const { container } = render(<><Checkbox label="Plain" /><Checkbox label="Described" description="Help" defaultSelected /><Checkbox label="Broken" error="Required" /></>);
    await expectNoAxeViolations(container);
  });
});
