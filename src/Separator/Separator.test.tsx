import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../test/axe';
import { Separator } from './Separator';

describe('Separator', () => {
  it('exposes orientation', async () => {
    const { container } = render(<div><Separator /><Separator orientation="vertical" /></div>);
    expect(container.querySelector('[aria-orientation="vertical"]')?.getAttribute('role')).toBe('separator');
    await expectNoAxeViolations(container);
  });
});
