import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Icon } from './Icon';

describe('Icon', () => {
  it('is decorative by default and labelled when asked', () => {
    const { container, rerender } = render(<Icon><path d="M0 0h10v10H0z" /></Icon>);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('width')).toBe('24');
    expect(svg.getAttribute('viewBox')).toBe('0 -960 960 960');

    rerender(<Icon size={16} label="Locked"><path d="M0 0h10v10H0z" /></Icon>);
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-label')).toBe('Locked');
    expect(svg.getAttribute('width')).toBe('16');
  });

  it('sizes an SVG component in place', () => {
    const Glyph = (props: Record<string, unknown>) => <svg data-glyph viewBox="0 0 24 24" {...props}><path d="M0 0h24v24H0z" /></svg>;
    const { container } = render(<Icon size={20}><Glyph /></Icon>);
    const svgs = container.querySelectorAll('svg');
    expect(svgs).toHaveLength(1);
    expect(svgs[0].getAttribute('width')).toBe('20');
    expect(svgs[0].hasAttribute('data-glyph')).toBe(true);
  });
});
