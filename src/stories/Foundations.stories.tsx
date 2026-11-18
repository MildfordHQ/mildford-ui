import type { Meta, StoryObj } from '@storybook/react-vite';
import { useLayoutEffect, useRef, useState } from 'react';
import { contrastRatio } from '../../scripts/palette-lib';
import styles from './Stories.module.css';

const meta = { title: 'Foundations/Tokens', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
const colors = ['action', 'accent', 'info', 'success', 'warning', 'error', 'workspace', 'selected'] as const;
export const SemanticColors: Story = { render: () => <section className={styles.foundation}><h1>Semantic color roles</h1><p>Components consume roles rather than reference colors so themes remain coherent.</p><div className={styles.swatches}>{colors.map((color) => <div className={styles.swatch} key={color}><span style={{ background: `var(--mild-color-${color})` }} /><code>--mild-color-{color}</code></div>)}</div></section> };
export const SpacingAndType: Story = { render: () => <section className={styles.foundation}><h1>Spacing and typography</h1><p>Four-pixel spacing steps support dense operational data without sacrificing readable hierarchy.</p><div className={styles.typeSample}><strong>Page title / expressive</strong><span>Section heading / structured</span><small>Supporting metadata / compact</small></div></section> };

const ROLE_GROUPS = [
  ['primary', 'on-primary', 'primary-container', 'on-primary-container'],
  ['secondary', 'on-secondary', 'secondary-container', 'on-secondary-container'],
  ['tertiary', 'on-tertiary', 'tertiary-container', 'on-tertiary-container'],
  ['error', 'on-error', 'error-container', 'on-error-container'],
  ['surface-dim', 'surface', 'surface-bright', 'surface-container-lowest', 'surface-container-low', 'surface-container', 'surface-container-high', 'surface-container-highest'],
  ['on-surface', 'on-surface-variant', 'outline', 'outline-variant', 'inverse-surface', 'inverse-on-surface', 'inverse-primary', 'surface-tint'],
] as const;

/** Contrast pairs: foreground, background, minimum ratio. */
const CONTRAST_PAIRS = [
  ['--md-sys-color-on-surface', '--md-sys-color-surface', 4.5],
  ['--md-sys-color-on-surface-variant', '--mild-color-surface', 4.5],
  ['--md-sys-color-on-primary', '--md-sys-color-primary', 4.5],
  ['--md-sys-color-primary', '--md-sys-color-surface', 4.5],
  ['--md-sys-color-on-primary-container', '--md-sys-color-primary-container', 4.5],
  ['--md-sys-color-on-error', '--md-sys-color-error', 4.5],
  ['--mild-color-on-selected', '--mild-color-selected', 4.5],
  ['--md-sys-color-outline', '--md-sys-color-surface', 3],
  ['--md-sys-color-primary', '--mild-color-workspace', 4.5],
] as const;

const short = (token: string) => token.replace('--md-sys-color-', '').replace('--mild-color-', 'mild ');

function PaletteFrame({ palette, theme }: { palette: 'neutral' | 'cobalt'; theme: 'light' | 'dark' }) {
  const ref = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  useLayoutEffect(() => {
    if (!ref.current) return;
    const style = getComputedStyle(ref.current);
    const read: Record<string, string> = {};
    for (const token of new Set([...ROLE_GROUPS.flat().map((role) => `--md-sys-color-${role}`), ...CONTRAST_PAIRS.flatMap(([fg, bg]) => [fg, bg])])) {
      read[token] = style.getPropertyValue(token).trim();
    }
    setValues(read);
  }, [palette, theme]);

  return (
    <div ref={ref} className={styles.paletteFrame} data-palette={palette} data-theme={theme}>
      <h2>{palette} · {theme}</h2>
      {ROLE_GROUPS.map((group) => (
        <div className={styles.roleRow} key={group[0]}>
          {group.map((role) => (
            <div className={styles.role} key={role}>
              <span style={{ background: `var(--md-sys-color-${role})` }} />
              <code>{role}</code>
              <small>{values[`--md-sys-color-${role}`]}</small>
            </div>
          ))}
        </div>
      ))}
      <table className={styles.contrastTable}>
        <caption>Contrast (WCAG 2.x)</caption>
        <thead><tr><th scope="col">Pair</th><th scope="col">Ratio</th><th scope="col">Result</th></tr></thead>
        <tbody>
          {CONTRAST_PAIRS.map(([fg, bg, min]) => {
            const a = values[fg];
            const b = values[bg];
            const ratio = /^#[0-9a-f]{6}$/i.test(a ?? '') && /^#[0-9a-f]{6}$/i.test(b ?? '') ? contrastRatio(a, b) : undefined;
            const pass = ratio !== undefined && ratio >= min;
            return (
              <tr key={`${fg}-${bg}`}>
                <td>
                  {min === 3
                    ? <span className={styles.boundarySample} style={{ borderColor: `var(${fg})`, background: `var(${bg})` }} aria-hidden="true" />
                    : <span className={styles.pairSample} style={{ color: `var(${fg})`, background: `var(${bg})` }}>Aa</span>}{' '}
                  {short(fg)} on {short(bg)}{min === 3 ? ' (UI boundary)' : ''}
                </td>
                <td>{ratio === undefined ? '—' : `${ratio.toFixed(2)}:1`}</td>
                <td><span className={pass ? styles.pass : styles.fail}>{pass ? `Pass ≥ ${min}` : `Fail < ${min}`}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export const Palettes: Story = {
  render: () => (
    <section className={styles.foundationWide}>
      <h1>Palettes × themes</h1>
      <p>
        Set <code>data-palette</code> (<code>neutral</code> default, <code>cobalt</code> opt-in) next to <code>data-theme</code> on the root.
        Values are generated by <code>pnpm generate:palette</code>; the contrast badges are computed from the rendered CSS.
      </p>
      <div className={styles.paletteGrid}>
        <PaletteFrame palette="neutral" theme="light" />
        <PaletteFrame palette="neutral" theme="dark" />
        <PaletteFrame palette="cobalt" theme="light" />
        <PaletteFrame palette="cobalt" theme="dark" />
      </div>
    </section>
  ),
};

const CORNERS = ['extra-small', 'small', 'medium', 'large', 'extra-large', 'full'] as const;
const ELEVATIONS = ['0', '1', '2', '3', 'artboard'] as const;
const TYPE_ROLES = ['title-medium', 'title-small', 'body-medium', 'body-small', 'label-large', 'label-medium', 'label-small'] as const;
const LAYOUT = ['appbar-height', 'rail-width', 'panel-width', 'toolbar-height', 'nav-bar-height', 'breakpoint-md', 'breakpoint-lg'] as const;
const Z = ['overlay-base', 'toolbar', 'panel', 'rail', 'appbar', 'tooltip', 'popover', 'modal'] as const;
const MOTION = ['motion-fast', 'motion-medium', 'motion-expressive-spatial', 'motion-expressive-effect'] as const;

export const ShapeElevationMotion: Story = {
  name: 'Shape, elevation and motion',
  render: () => (
    <section className={styles.foundationWide}>
      <h1>Shape, elevation and motion</h1>
      <p>Hover a motion sample to play it; reduced motion sets every duration to zero.</p>
      <h2>Corners</h2>
      <div className={styles.sampleRow}>
        {CORNERS.map((corner) => <div className={styles.cornerSample} key={corner} style={{ borderRadius: `var(--md-sys-shape-corner-${corner})` }}><code>{corner}</code></div>)}
      </div>
      <h2>Elevation</h2>
      <div className={styles.sampleRow}>
        {ELEVATIONS.map((level) => <div className={styles.elevationSample} key={level} style={{ boxShadow: `var(--mild-elevation-${level})` }}><code>--mild-elevation-{level}</code></div>)}
      </div>
      <h2>Motion</h2>
      <div className={styles.sampleRow}>
        {MOTION.map((token) => (
          <div className={styles.motionSample} key={token} style={{ ['--sample-motion' as string]: token.startsWith('motion-expressive') ? `var(--mild-${token})` : `var(--mild-${token}) var(--mild-easing-standard)` }}>
            <span />
            <code>--mild-{token}</code>
          </div>
        ))}
      </div>
    </section>
  ),
};

export const TypeLayoutAndZ: Story = {
  name: 'Type roles, layout and z-order',
  render: () => (
    <section className={styles.foundationWide}>
      <h1>Type roles, layout and z-order</h1>
      <p>Editor chrome uses M3 type roles as <code>font</code> shorthands with matching tracking, fixed region sizes and a fixed z ladder.</p>
      <div className={styles.typeRoles}>
        {TYPE_ROLES.map((role) => <div key={role} style={{ font: `var(--mild-type-${role})`, letterSpacing: `var(--mild-tracking-${role})` }}>{role} — Export design as PNG</div>)}
      </div>
      <h2>Layout</h2>
      <dl className={styles.tokenList}>
        {LAYOUT.map((token) => <div key={token}><dt><code>--mild-{token}</code></dt><dd><span className={styles.layoutBar} style={{ width: `min(100%, var(--mild-${token}))` }} /></dd></div>)}
      </dl>
      <h2>Z-order (low → high)</h2>
      <ol className={styles.zList}>
        {Z.map((token) => <li key={token}><code>--mild-z-{token}</code></li>)}
      </ol>
    </section>
  ),
};
