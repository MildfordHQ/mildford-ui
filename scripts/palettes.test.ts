// @vitest-environment node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildPalette } from './palette-build';
import { contrastRatio, replaceFence, resolveTheme, semanticCss, validateSemantic, type ResolvedRoles, type ThemeDefinition } from './palette-lib';
import { cobalt, neutral } from './palettes';

/** The cobalt reference role tables, verbatim. */
const REFERENCE_COBALT = {
  light: {
    primary: '#0064d4', 'on-primary': '#ffffff', 'primary-container': '#d8e2ff', 'on-primary-container': '#004494',
    secondary: '#595c7e', 'on-secondary': '#ffffff', 'secondary-container': '#dfe0ff', 'on-secondary-container': '#414465',
    tertiary: '#625789', 'on-tertiary': '#ffffff', 'tertiary-container': '#e7deff', 'on-tertiary-container': '#4a4070',
    error: '#cf263e', 'on-error': '#ffffff', 'error-container': '#ffdad6', 'on-error-container': '#93000a',
    surface: '#fafafa', 'surface-dim': '#e0e2e4', 'surface-bright': '#ffffff', 'surface-container-lowest': '#ffffff',
    'surface-container-low': '#f3f4f5', 'surface-container': '#eeeff0', 'surface-container-high': '#e9eaeb',
    'surface-container-highest': '#e0e2e4', 'on-surface': '#111112', 'on-surface-variant': '#5c5e61', outline: '#818487',
    'outline-variant': '#d1d3d5', 'inverse-surface': '#28292b', 'inverse-on-surface': '#fafafa', 'inverse-primary': '#4b93ff',
    'surface-tint': '#0064d4', scrim: '#000000', shadow: '#000000',
  },
  dark: {
    primary: '#4b93ff', 'on-primary': '#001d47', 'primary-container': '#004494', 'on-primary-container': '#d8e2ff',
    secondary: '#c1c4eb', 'on-secondary': '#2a2e4d', 'secondary-container': '#414465', 'on-secondary-container': '#dfe0ff',
    tertiary: '#ccbff8', 'on-tertiary': '#332958', 'tertiary-container': '#4a4070', 'on-tertiary-container': '#e7deff',
    error: '#fa4758', 'on-error': '#1f0004', 'error-container': '#93000a', 'on-error-container': '#ffdad6',
    surface: '#111112', 'surface-dim': '#111112', 'surface-bright': '#383b3d', 'surface-container-lowest': '#0c0c0d',
    'surface-container-low': '#181819', 'surface-container': '#1f1f20', 'surface-container-high': '#28292b',
    'surface-container-highest': '#323435', 'on-surface': '#fafafa', 'on-surface-variant': '#b5b7bb', outline: '#818487',
    'outline-variant': '#383b3d', 'inverse-surface': '#fafafa', 'inverse-on-surface': '#111112', 'inverse-primary': '#0064d4',
    'surface-tint': '#4b93ff', scrim: '#000000', shadow: '#000000',
  },
} as const;

function declarations(block: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const match of block.matchAll(/(--[\w-]+):\s*([^;]+);/g)) map.set(match[1], match[2].trim());
  return map;
}

/** Resolves `var(--x)` one level against the same block (enough for the baseline file). */
function resolveValue(value: string, decls: Map<string, string>): string {
  const ref = value.match(/^var\((--[\w-]+)\)$/);
  return ref ? resolveValue(decls.get(ref[1]) ?? value, decls) : value;
}

describe('cobalt palette', () => {
  const built = buildPalette(cobalt);

  it.each(['light', 'dark'] as const)('reproduces the cobalt reference %s table', (theme) => {
    expect(built.resolved[theme].roles).toEqual(REFERENCE_COBALT[theme]);
  });

  it('passes the cobalt contrast table', () => {
    expect(built.failures).toEqual([]);
  });

  it('marks every override with a reason', () => {
    for (const theme of ['light', 'dark'] as const) {
      for (const override of Object.values(built.resolved[theme].overridden)) expect(override?.reason.length).toBeGreaterThan(0);
    }
  });
});

describe('neutral palette', () => {
  const legacy = readFileSync(resolve(__dirname, '__fixtures__/tokens-neutral-baseline.css'), 'utf8');
  const legacyBlocks = {
    light: declarations(legacy.slice(legacy.indexOf(':root,'), legacy.indexOf('[data-theme="dark"] {'))),
    dark: declarations(legacy.slice(legacy.indexOf('[data-theme="dark"] {'), legacy.indexOf(':root {'))),
  };
  const built = buildPalette(neutral);
  const generatedBlocks = {
    light: declarations(built.css.slice(0, built.css.indexOf('[data-theme="dark"]'))),
    dark: declarations(built.css.slice(built.css.indexOf('[data-theme="dark"]'))),
  };

  it.each(['light', 'dark'] as const)('resolves every baseline %s token to its baseline value', (theme) => {
    const old = legacyBlocks[theme];
    const next = generatedBlocks[theme];
    expect(old.size).toBeGreaterThan(40);
    for (const [name, value] of old) {
      expect({ name, value: resolveValue(next.get(name) ?? 'missing', next) }).toEqual({ name, value: resolveValue(value, old) });
    }
  });

  it('passes the AA contrast floor', () => {
    expect(built.failures).toEqual([]);
  });
});

describe('palette-lib', () => {
  it('computes WCAG contrast', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#ffffff', '#0064d4')).toBeCloseTo(5.57, 2);
  });

  it('rejects an override equal to the generated value and an override without a reason', () => {
    const definition: ThemeDefinition = { overrides: { primary: { value: '#123456', reason: '' } }, semantic: {}, contrast: [] };
    expect(() => resolveTheme({ primary: '#123456' }, definition, 't')).toThrow(/no reason[\s\S]*equals the generated value/);
  });

  it('rejects a semantic hex that duplicates a role', () => {
    const roles = { primary: '#0064d4' } as ResolvedRoles;
    expect(() => validateSemantic(roles, { overrides: {}, semantic: { 'color-action': '#0064d4' }, contrast: [] }, 't')).toThrow(/use "role:primary"/);
    expect(semanticCss('role:primary')).toBe('var(--md-sys-color-primary)');
  });

  it('replaces only the fenced region', () => {
    const source = 'a\n/* @generated palette:x start — do not edit; run `pnpm generate:palette` (scripts/palettes.ts) */\nold\n/* @generated palette:x end */\nb';
    expect(replaceFence(source, 'x', 'new')).toContain('\nnew\n/* @generated palette:x end */\nb');
    expect(() => replaceFence('nothing', 'x', 'new')).toThrow(/not found/);
  });
});
