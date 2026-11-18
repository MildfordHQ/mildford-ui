import { createRef, useState, type ChangeEvent } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe';
import { TextArea } from './TextArea';
import { TextField } from './TextField';

function describedText(element: HTMLElement): string[] {
  return (element.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean).map((id) => document.getElementById(id)?.textContent ?? `#${id}`);
}

describe('TextField', () => {
  it('passes the native ChangeEvent to onChange (controlled)', async () => {
    const user = userEvent.setup();
    const seen: string[] = [];
    function Controlled() {
      const [value, setValue] = useState('');
      return <TextField label="Pull request URL" value={value} onChange={(event) => { seen.push(event.target.value); setValue(event.target.value); }} />;
    }
    render(<Controlled />);
    const input = screen.getByRole('textbox', { name: 'Pull request URL' }) as HTMLInputElement;
    await user.type(input, 'abc');
    expect(seen).toEqual(['a', 'ab', 'abc']);
    expect(input.value).toBe('abc');
  });

  it('supports defaultValue (uncontrolled) and forwards the ref to the <input>', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn((event: ChangeEvent<HTMLInputElement>) => event.target.value);
    render(<TextField ref={ref} label="Name" defaultValue="Design" name="title" id="design-name" onChange={onChange} />);
    expect(ref.current?.tagName).toBe('INPUT');
    expect(ref.current?.id).toBe('design-name');
    expect(ref.current?.name).toBe('title');
    expect(ref.current?.value).toBe('Design');
    await user.type(ref.current as HTMLInputElement, '!');
    expect(onChange).toHaveReturnedWith('Design!');
    expect(onChange.mock.calls[0][0].target).toBe(ref.current);
  });

  it('passes native input props through', () => {
    render(<TextField label="Prompt budget" type="number" inputMode="numeric" min={1} max={64} placeholder="8" isRequired isDisabled className="extra" />);
    const input = screen.getByRole('spinbutton', { name: /Prompt budget/ }) as HTMLInputElement;
    expect(input.type).toBe('number');
    expect(input.getAttribute('inputmode')).toBe('numeric');
    expect(input.min).toBe('1');
    expect(input.max).toBe('64');
    expect(input.placeholder).toBe('8');
    expect(input.required).toBe(true);
    expect(input.disabled).toBe(true);
    expect(input.className).toContain('extra');
  });

  it('wires description, error and a consumer aria-describedby', () => {
    const { rerender } = render(<TextField label="Name" description="Use a unique name." aria-describedby="external" />);
    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(describedText(input)).toEqual(expect.arrayContaining(['Use a unique name.', '#external']));
    expect(input.getAttribute('aria-invalid')).toBeNull();

    rerender(<TextField label="Name" description="Use a unique name." error="Name is taken." aria-describedby="external" />);
    expect(describedText(input)).toEqual(expect.arrayContaining(['Name is taken.', '#external']));
    expect(describedText(input)).not.toContain('Use a unique name.');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByRole('alert').textContent).toBe('Name is taken.');
  });

  it('error does not block form submission', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    render(<form onSubmit={onSubmit}><TextField label="Name" defaultValue="x" error="Server says no." /><button type="submit">Go</button></form>);
    await user.click(screen.getByRole('button', { name: 'Go' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('has no axe violations', async () => {
    const { container } = render(<><TextField label="Name" description="Help" isRequired /><TextField label="Other" error="Bad" /></>);
    await expectNoAxeViolations(container);
  });
});

describe('TextArea', () => {
  it('passes the native ChangeEvent to onChange and forwards the ref to the <textarea>', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLTextAreaElement>();
    const seen: string[] = [];
    function Controlled() {
      const [value, setValue] = useState('');
      return <TextArea ref={ref} label="Adjustment" rows={2} placeholder="Add conditions" value={value} onChange={(event) => { seen.push(event.target.value); setValue(event.target.value); }} />;
    }
    render(<Controlled />);
    expect(ref.current?.tagName).toBe('TEXTAREA');
    expect(ref.current?.rows).toBe(2);
    await user.type(screen.getByRole('textbox', { name: 'Adjustment' }), 'ok');
    expect(seen).toEqual(['o', 'ok']);
    expect(ref.current?.value).toBe('ok');
  });

  it('supports defaultValue', () => {
    render(<TextArea label="Notes" defaultValue="Draft" />);
    expect((screen.getByRole('textbox', { name: 'Notes' }) as HTMLTextAreaElement).value).toBe('Draft');
  });

  it('wires description and error through aria-describedby', () => {
    const { rerender } = render(<TextArea label="Instructions" description="Describe the goal." />);
    const textarea = screen.getByRole('textbox', { name: 'Instructions' });
    expect(describedText(textarea)).toEqual(['Describe the goal.']);
    rerender(<TextArea label="Instructions" description="Describe the goal." error="Too short." />);
    expect(describedText(textarea)).toEqual(['Too short.']);
    expect(textarea.getAttribute('aria-invalid')).toBe('true');
  });

  it('has no axe violations', async () => {
    const { container } = render(<TextArea label="Instructions" description="Describe the goal." error="Too short." />);
    await expectNoAxeViolations(container);
  });
});
