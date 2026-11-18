import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe';
import { ButtonGroup } from '../ButtonGroup';
import { IconButton } from '../IconButton';
import { ToggleButton, ToggleButtonGroup } from './ToggleButton';

describe('ToggleButton', () => {
  it('toggles aria-pressed', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ToggleButton aria-label="Show grid" onChange={onChange}>G</ToggleButton>);
    const button = screen.getByRole('button', { name: 'Show grid' });
    expect(button.getAttribute('aria-pressed')).toBe('false');
    await user.click(button);
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(onChange).toHaveBeenLastCalledWith(true);
    await expectNoAxeViolations();
  });
});

describe('ToggleButtonGroup', () => {
  const renderGroup = (onSelectionChange = vi.fn()) =>
    render(
      <ToggleButtonGroup aria-label="Grid lines" selectionMode="single" disallowEmptySelection defaultSelectedKeys={['blue']} onSelectionChange={onSelectionChange} connected>
        <ToggleButton id="blue">Blue</ToggleButton>
        <ToggleButton id="grey">Grey</ToggleButton>
      </ToggleButtonGroup>,
    );

  it('enforces a single selection', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    renderGroup(onSelectionChange);
    const blue = screen.getByRole('radio', { name: 'Blue' });
    const grey = screen.getByRole('radio', { name: 'Grey' });
    expect(blue.getAttribute('aria-checked')).toBe('true');
    await user.click(grey);
    expect(grey.getAttribute('aria-checked')).toBe('true');
    expect(blue.getAttribute('aria-checked')).toBe('false');
    await user.click(grey);
    expect(grey.getAttribute('aria-checked')).toBe('true');
    expect([...onSelectionChange.mock.calls.at(-1)![0]]).toEqual(['grey']);
    await expectNoAxeViolations();
  });

  it('moves focus with arrow keys', async () => {
    const user = userEvent.setup();
    renderGroup();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'Blue' }));
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'Grey' }));
  });
});

describe('ButtonGroup', () => {
  it('is a labelled group only when labelled', () => {
    const { rerender } = render(
      <ButtonGroup connected>
        <IconButton aria-label="Undo">U</IconButton>
        <IconButton aria-label="Redo">R</IconButton>
      </ButtonGroup>,
    );
    expect(screen.queryByRole('group')).toBeNull();
    rerender(
      <ButtonGroup connected aria-label="History">
        <IconButton aria-label="Undo">U</IconButton>
        <IconButton aria-label="Redo">R</IconButton>
      </ButtonGroup>,
    );
    expect(screen.getByRole('group', { name: 'History' })).toBeTruthy();
  });
});
