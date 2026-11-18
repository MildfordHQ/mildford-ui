import { axe } from 'vitest-axe';
import { expect } from 'vitest';

/**
 * Runs axe on a rendered container and fails with a readable list of violations.
 * Color contrast is checked in Storybook (real CSS); jsdom computes no styles. `region` (page
 * landmarks) only applies to whole pages, not to an isolated component.
 */
export async function expectNoAxeViolations(container: Element = document.body): Promise<void> {
  const results = await axe(container, { rules: { 'color-contrast': { enabled: false }, region: { enabled: false } } });
  const summary = results.violations.map((violation) => `${violation.id}: ${violation.help} (${violation.nodes.map((node) => node.target.join(' ')).join(', ')})`);
  expect(summary).toEqual([]);
}
