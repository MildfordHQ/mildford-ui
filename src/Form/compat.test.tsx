/**
 * Compatibility check: call shapes written for native form elements (native `onChange` events,
 * `ref` on the element, `className`) must still type-check (`pnpm typecheck`) and behave.
 */
import { useState, type ChangeEvent, type ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Dialog, type DialogProps } from '../Dialog';
import { Checkbox, TextArea, TextField, type CheckboxProps, type TextAreaProps, type TextFieldProps } from '.';

// Exported prop interfaces keep extending the native attribute sets.
const textFieldProps: TextFieldProps = { label: 'L', onChange: (event: ChangeEvent<HTMLInputElement>) => event.target.value, inputMode: 'numeric', min: 1, max: 64, type: 'number' };
const textAreaProps: TextAreaProps = { label: 'L', onChange: (event: ChangeEvent<HTMLTextAreaElement>) => event.target.value, rows: 2 };
const checkboxProps: CheckboxProps = { label: 'L', isSelected: true, onChange: (event: ChangeEvent<HTMLInputElement>) => event.target.checked };
const dialogProps: DialogProps = { isOpen: true, onOpenChange: () => undefined, title: 'T', children: 'B', className: 'c', closeLabel: 'Close' };
const fieldProps: ComponentProps<typeof TextField> = { label: 'L', ref: { current: null as HTMLInputElement | null } };

function ConsumerForms() {
  const [prUrl, setPrUrl] = useState('');
  const [force, setForce] = useState(false);
  const [adjustment, setAdjustment] = useState('');
  const [promptChars, setPromptChars] = useState('8000');
  const promptCharsError: string | null = Number(promptChars) < 1 ? 'Must be at least 1.' : null;
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <TextField
        label="Pull request URL"
        onChange={(event) => setPrUrl(event.target.value)}
        placeholder="https://github.com/org/repo/pull/123"
        isRequired
        type="url"
        value={prUrl}
      />
      <Checkbox
        isSelected={force}
        className="submit-form__checkbox"
        label="Force re-analyze"
        onChange={(event) => setForce(event.target.checked)}
      />
      <TextArea
        label="Adjustment for “Resume with adjustment”"
        onChange={(event) => setAdjustment(event.target.value)}
        placeholder="Add conditions or revised instructions"
        rows={2}
        value={adjustment}
      />
      <TextField
        description="Characters of evidence allowed into one analyzer prompt."
        error={promptCharsError}
        inputMode="numeric"
        label="Prompt budget"
        min={1}
        max={1_000_000}
        onChange={(event) => setPromptChars(event.target.value)}
        type="number"
        value={promptChars}
      />
      <output data-testid="state">{JSON.stringify({ prUrl, force, adjustment, promptChars })}</output>
    </form>
  );
}

function ConsumerModal({ open, onClose, title }: { open: boolean; onClose: () => void; title: string }) {
  return (
    <Dialog
      className="timeline-dialog"
      closeLabel="Close"
      onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}
      isOpen={open}
      title={title}
    >
      <p>Timeline</p>
    </Dialog>
  );
}

describe('consumer compatibility', () => {
  it('keeps the prop interfaces assignable', () => {
    expect([textFieldProps, textAreaProps, checkboxProps, dialogProps, fieldProps].length).toBe(5);
  });

  it('drives the consumer forms through native change events', async () => {
    const user = userEvent.setup();
    render(<ConsumerForms />);
    await user.type(screen.getByRole('textbox', { name: /Pull request URL/ }), 'u');
    await user.click(screen.getByRole('checkbox', { name: 'Force re-analyze' }));
    await user.type(screen.getByRole('textbox', { name: /Adjustment/ }), 'a');
    const budget = screen.getByRole('spinbutton', { name: 'Prompt budget' });
    await user.clear(budget);
    await user.type(budget, '0');
    expect(JSON.parse(screen.getByTestId('state').textContent ?? '{}')).toEqual({ prUrl: 'u', force: true, adjustment: 'a', promptChars: '0' });
    expect(budget.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByRole('alert').textContent).toBe('Must be at least 1.');
  });

  it('renders the consumer modal and closes it through onOpenChange', async () => {
    const user = userEvent.setup();
    let closed = 0;
    render(<ConsumerModal open title="Run timeline" onClose={() => { closed += 1; }} />);
    expect(screen.getByRole('dialog', { name: 'Run timeline' })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(closed).toBe(1);
  });
});
