import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../test/axe';
import { Kbd, parseKeys } from './Kbd';

describe('Kbd', () => {
  it('parses shortcut strings', () => {
    expect(parseKeys('Mod+Shift+Z')).toEqual(['Mod', 'Shift', 'Z']);
    expect(parseKeys('⇧⌘Z')).toEqual(['⇧', '⌘', 'Z']);
    expect(parseKeys('?')).toEqual(['?']);
    expect(parseKeys('+')).toEqual(['+']);
    expect(parseKeys(['Shift', 'G'])).toEqual(['Shift', 'G']);
  });

  it('renders glyph chips and a spoken label', async () => {
    const { container } = render(<Kbd keys="Mod+Shift+Z" />);
    const chips = [...container.querySelectorAll('kbd kbd')].map((chip) => chip.textContent);
    expect(chips).toEqual(['⌘', '⇧', 'Z']);
    expect(container.textContent).toContain('Command Shift Z');
    await expectNoAxeViolations(container);
  });
});
