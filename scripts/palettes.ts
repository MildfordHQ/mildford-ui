/**
 * Palette definitions for `pnpm generate:palette`.
 *
 * - `neutral` is Mildford's default, pinned byte-for-byte to `scripts/__fixtures__/tokens-neutral-baseline.css`.
 *   It has no seed: every role is an explicit value. Roles that complete the M3 set say so in their reason.
 * - `cobalt` is a saturated creative-tool palette: generated with Material Color Utilities
 *   (SchemeVibrant, seed #0064d4, contrast 0), then overridden where its reference table records
 *   a measured value. Every override carries its reason and, where relevant, its contrast.
 */
import type { ContrastCheck, PaletteDefinition, ThemeDefinition } from './palette-lib';

const KEPT = 'baseline value';

/** Pairs every palette must pass (WCAG AA: 4.5 text, 3 UI boundary). */
function baseContrast(): ContrastCheck[] {
  return [
    { fg: 'on-surface', bg: 'surface', min: 4.5 },
    { fg: 'on-surface-variant', bg: '--mild-color-surface', min: 4.5 },
    { fg: 'on-primary', bg: 'primary', min: 4.5 },
    { fg: 'on-primary-container', bg: 'primary-container', min: 4.5 },
    { fg: 'on-error', bg: 'error', min: 4.5 },
    { fg: '--mild-color-on-selected', bg: '--mild-color-selected', min: 4.5 },
    { fg: 'outline', bg: 'surface', min: 3 },
    { fg: 'primary', bg: '--mild-color-workspace', min: 4.5 },
    ...statusContrast(),
  ];
}

/** Status text on its container (Badge, Alert) and on the plain surface (StatusIndicator). */
function statusContrast(): ContrastCheck[] {
  return (['info', 'success', 'warning', 'error'] as const).flatMap((status) => [
    { fg: `--mild-color-${status}`, bg: `--mild-color-${status}-container`, min: 4.5 },
    { fg: `--mild-color-${status}`, bg: '--mild-color-surface', min: 4.5 },
  ]);
}

/**
 * Declared in the palette block (not :root) so a neutral frame nested in a cobalt page gets neutral
 * shadows. 1 and 2 are the baseline values.
 */
const NEUTRAL_ELEVATION = {
  'elevation-1': '0 1px 2px var(--mild-shadow-color), 0 1px 3px var(--mild-shadow-color)',
  'elevation-2': '0 8px 24px var(--mild-shadow-color)',
  'elevation-3': '0 16px 40px var(--mild-shadow-color), 0 4px 10px var(--mild-shadow-color)',
  'elevation-artboard': '0 2px 6px var(--mild-shadow-color), 0 12px 32px var(--mild-shadow-color)',
};

const neutralLight: ThemeDefinition = {
  overrides: {
    primary: { value: '#171717', reason: KEPT },
    'on-primary': { value: '#ffffff', reason: KEPT },
    'primary-container': { value: '#ececec', reason: KEPT },
    'on-primary-container': { value: '#202020', reason: KEPT },
    secondary: { value: '#3f3f3f', reason: 'the baseline accent grey' },
    'on-secondary': { value: '#ffffff', reason: 'completes the M3 role set' },
    'secondary-container': { value: '#ececec', reason: 'the baseline accent container, so --mild-color-accent-container can reference it' },
    'on-secondary-container': { value: '#3f3f3f', reason: 'the baseline accent, so --mild-color-accent can reference it' },
    tertiary: { value: '#4a4a4a', reason: 'completes the M3 role set in the neutral greys' },
    'on-tertiary': { value: '#ffffff', reason: 'completes the M3 role set' },
    'tertiary-container': { value: '#e3e3e3', reason: 'completes the M3 role set' },
    'on-tertiary-container': { value: '#2b2b2b', reason: 'completes the M3 role set' },
    error: { value: '#a32323', reason: KEPT },
    'on-error': { value: '#ffffff', reason: KEPT },
    'error-container': { value: '#fde3e3', reason: KEPT },
    'on-error-container': { value: '#5f1111', reason: KEPT },
    surface: { value: '#f7f7f7', reason: KEPT },
    'surface-dim': { value: '#dcdcdc', reason: 'below surface-container-highest' },
    'surface-bright': { value: '#ffffff', reason: 'completes the M3 role set' },
    'surface-container-lowest': { value: '#ffffff', reason: 'the baseline white card surface' },
    'surface-container-low': { value: '#f3f3f3', reason: 'the baseline subtle surface' },
    'surface-container': { value: '#f2f2f2', reason: KEPT },
    'surface-container-high': { value: '#e7e7e7', reason: KEPT },
    'surface-container-highest': { value: '#e0e0e0', reason: 'one step below surface-container-high' },
    'on-surface': { value: '#171717', reason: KEPT },
    'on-surface-variant': { value: '#5f5f5f', reason: KEPT },
    outline: { value: '#707070', reason: KEPT },
    'outline-variant': { value: '#c9c9c9', reason: KEPT },
    'inverse-surface': { value: '#2b2b2b', reason: KEPT },
    'inverse-on-surface': { value: '#f5f5f5', reason: KEPT },
    'inverse-primary': { value: '#f5f5f5', reason: KEPT },
    'surface-tint': { value: '#171717', reason: 'equals primary' },
    scrim: { value: '#000000', reason: 'completes the M3 role set' },
    shadow: { value: '#000000', reason: 'completes the M3 role set' },
  },
  semantic: {
    'color-canvas': 'role:surface',
    'color-surface': 'role:surface-container-lowest',
    'color-surface-subtle': 'role:surface-container-low',
    'color-surface-raised': 'role:surface-container-lowest',
    'color-text': 'role:on-surface',
    'color-text-muted': 'role:on-surface-variant',
    'color-border': 'role:outline-variant',
    'color-divider': '#dedede',
    'color-border-strong': 'role:outline',
    'color-action': 'role:primary',
    'color-action-on': 'role:on-primary',
    'color-action-container': 'role:primary-container',
    'color-action-on-container': 'role:on-primary-container',
    'color-accent': 'role:on-secondary-container',
    'color-accent-container': 'role:secondary-container',
    'color-info': 'role:on-secondary-container',
    'color-info-container': 'role:secondary-container',
    'color-success': '#246b36',
    'color-success-container': '#dff4e4',
    'color-warning': '#6b4b00',
    'color-warning-container': '#fff0cc',
    'color-error': 'role:error',
    'color-error-container': 'role:error-container',
    'color-overlay': 'rgb(0 0 0 / 0.48)',
    'focus-color': '#2d2d2d',
    'shadow-color': 'rgb(0 0 0 / 0.12)',
    'color-workspace': 'role:surface-container',
    'color-selected': 'role:secondary-container',
    'color-on-selected': 'role:on-secondary-container',
    ...NEUTRAL_ELEVATION,
  },
  contrast: baseContrast(),
};

const neutralDark: ThemeDefinition = {
  overrides: {
    primary: { value: '#f5f5f5', reason: KEPT },
    'on-primary': { value: '#171717', reason: KEPT },
    'primary-container': { value: '#343434', reason: KEPT },
    'on-primary-container': { value: '#f5f5f5', reason: KEPT },
    secondary: { value: '#d4d4d4', reason: 'completes the M3 role set' },
    'on-secondary': { value: '#1c1c1c', reason: 'completes the M3 role set' },
    'secondary-container': { value: '#303030', reason: 'the baseline accent container' },
    'on-secondary-container': { value: '#e5e5e5', reason: 'the baseline accent' },
    tertiary: { value: '#c6c6c6', reason: 'completes the M3 role set' },
    'on-tertiary': { value: '#1c1c1c', reason: 'completes the M3 role set' },
    'tertiary-container': { value: '#383838', reason: 'completes the M3 role set' },
    'on-tertiary-container': { value: '#ededed', reason: 'completes the M3 role set' },
    error: { value: '#ffb4ab', reason: KEPT },
    'on-error': { value: '#690005', reason: KEPT },
    'error-container': { value: '#5f1919', reason: KEPT },
    'on-error-container': { value: '#ffdada', reason: KEPT },
    surface: { value: '#111111', reason: KEPT },
    'surface-dim': { value: '#111111', reason: 'equals surface (M3 dark convention)' },
    'surface-bright': { value: '#373737', reason: 'completes the M3 role set' },
    'surface-container-lowest': { value: '#0b0b0b', reason: 'completes the M3 role set' },
    'surface-container-low': { value: '#191919', reason: 'the baseline dark card surface' },
    'surface-container': { value: '#1d1d1d', reason: KEPT },
    'surface-container-high': { value: '#292929', reason: KEPT },
    'surface-container-highest': { value: '#333333', reason: 'completes the M3 role set' },
    'on-surface': { value: '#f5f5f5', reason: KEPT },
    'on-surface-variant': { value: '#b8b8b8', reason: KEPT },
    outline: { value: '#b0b0b0', reason: KEPT },
    'outline-variant': { value: '#737373', reason: KEPT },
    'inverse-surface': { value: '#f5f5f5', reason: KEPT },
    'inverse-on-surface': { value: '#1c1c1c', reason: KEPT },
    'inverse-primary': { value: '#1c1c1c', reason: KEPT },
    'surface-tint': { value: '#f5f5f5', reason: 'equals primary' },
    scrim: { value: '#000000', reason: 'completes the M3 role set' },
    shadow: { value: '#000000', reason: 'completes the M3 role set' },
  },
  semantic: {
    'color-canvas': 'role:surface',
    'color-surface': 'role:surface-container-low',
    'color-surface-subtle': '#242424',
    'color-surface-raised': '#262626',
    'color-text': 'role:on-surface',
    'color-text-muted': 'role:on-surface-variant',
    'color-border': 'role:outline-variant',
    'color-divider': '#3a3a3a',
    'color-border-strong': 'role:outline',
    'color-action': 'role:primary',
    'color-action-on': 'role:on-primary',
    'color-action-container': 'role:primary-container',
    'color-action-on-container': 'role:on-primary-container',
    'color-accent': 'role:on-secondary-container',
    'color-accent-container': 'role:secondary-container',
    'color-info': 'role:on-secondary-container',
    'color-info-container': 'role:secondary-container',
    'color-success': '#a8e5b4',
    'color-success-container': '#1f4628',
    'color-warning': '#ffd88a',
    'color-warning-container': '#493500',
    'color-error': 'role:error',
    'color-error-container': 'role:error-container',
    'color-overlay': 'rgb(0 0 0 / 0.72)',
    'focus-color': 'role:primary',
    'shadow-color': 'rgb(0 0 0 / 0.56)',
    'color-workspace': 'role:surface-container-lowest',
    'color-selected': 'role:secondary-container',
    'color-on-selected': 'role:on-secondary-container',
    ...NEUTRAL_ELEVATION,
  },
  contrast: baseContrast(),
};

export const neutral: PaletteDefinition = {
  name: 'neutral',
  description: 'Default operational palette: black actions, white surfaces, grey hierarchy.',
  // Explicit `data-palette="neutral"` frames win over an inherited cobalt palette (see cobalt.selectors).
  selectors: {
    light: [':root', '[data-theme="light"]', '[data-palette="neutral"]', '[data-palette="neutral"][data-theme="light"]'],
    dark: ['[data-theme="dark"]', '[data-palette="neutral"][data-theme="dark"]', '[data-theme="dark"] [data-palette="neutral"]'],
  },
  preamble: { light: ['color-scheme: light;'], dark: ['color-scheme: dark;'] },
  light: neutralLight,
  dark: neutralDark,
};

/** Shared by both cobalt themes: the semantic mapping. */
function cobaltSemantic(theme: 'light' | 'dark'): ThemeDefinition['semantic'] {
  const light = theme === 'light';
  // The reference table asks for ~16% of the hue over surface-container; over surface-container-lowest instead,
  // because error text on the former is 4.0:1 (fails AA). Success 5.63, warning 8.07, error 4.86.
  const mixStatus = (hue: string) => `color-mix(in srgb, ${hue} 16%, var(--md-sys-color-surface-container-lowest))`;
  return {
    'color-canvas': 'role:surface',
    'color-surface': light ? 'role:surface-container-lowest' : 'role:surface-container-low',
    'color-surface-subtle': 'role:surface-container',
    'color-surface-raised': 'role:surface-container-high',
    'color-text': 'role:on-surface',
    'color-text-muted': 'role:on-surface-variant',
    'color-border': 'role:outline-variant',
    'color-divider': 'role:outline-variant',
    'color-border-strong': 'role:outline',
    'color-action': 'role:primary',
    'color-action-on': 'role:on-primary',
    'color-action-container': 'role:primary-container',
    'color-action-on-container': 'role:on-primary-container',
    'color-accent': 'role:on-secondary-container',
    'color-accent-container': 'role:secondary-container',
    // Status text sits on its container (Badge, Alert): primary on primary-container is 4.30 light /
    // 3.07 dark, so info text uses on-primary-container (7.20 on its container in both themes).
    'color-info': 'role:on-primary-container',
    'color-info-container': 'role:primary-container',
    // The reference #008200 is 4.33:1 on its container; #007a00 is 4.80 (5.55 on white).
    'color-success': light ? '#007a00' : '#07b123',
    'color-success-container': light ? '#dcf5df' : mixStatus('#07b123'),
    'color-warning': light ? '#8a6100' : '#f3b628',
    'color-warning-container': light ? '#fff1c2' : mixStatus('#f3b628'),
    'color-error': 'role:error',
    // error on the M3 error-container is 4.06 light / 2.72 dark; a wash of the error hue keeps the
    // vivid error color readable (4.65 light, 4.86 dark).
    'color-error-container': light ? 'color-mix(in srgb, #cf263e 8%, var(--md-sys-color-surface-container-lowest))' : mixStatus('#fa4758'),
    'color-overlay': light ? 'rgb(0 0 0 / 0.48)' : 'rgb(0 0 0 / 0.72)',
    'focus-color': 'role:primary',
    'shadow-color': light ? 'rgb(17 17 18 / 0.08)' : 'rgb(0 0 0 / 0.48)',
    'color-workspace': light ? 'role:surface-container-low' : 'role:surface-container-lowest',
    'color-selected': 'role:secondary-container',
    'color-on-selected': 'role:on-secondary-container',
    // Soft diffuse shadows; dark multiplies alphas ×3 on pure black.
    'elevation-1': light
      ? '0 1px 2px rgb(17 17 18 / 0.06), 0 1px 3px rgb(17 17 18 / 0.04)'
      : '0 1px 2px rgb(0 0 0 / 0.18), 0 1px 3px rgb(0 0 0 / 0.12)',
    'elevation-2': light
      ? '0 4px 12px rgb(17 17 18 / 0.08), 0 2px 4px rgb(17 17 18 / 0.04)'
      : '0 4px 12px rgb(0 0 0 / 0.24), 0 2px 4px rgb(0 0 0 / 0.12)',
    'elevation-3': light
      ? '0 18px 40px rgb(17 17 18 / 0.14), 0 4px 10px rgb(17 17 18 / 0.06)'
      : '0 18px 40px rgb(0 0 0 / 0.42), 0 4px 10px rgb(0 0 0 / 0.18)',
    'elevation-artboard': light
      ? '0 2px 6px rgb(17 17 18 / 0.10), 0 12px 32px rgb(17 17 18 / 0.10)'
      : '0 2px 6px rgb(0 0 0 / 0.30), 0 12px 32px rgb(0 0 0 / 0.30)',
  };
}

/**
 * The cobalt contrast table, with the recorded ratios. One correction: the reference records 18.87 for dark on-surface on
 * surface, but dark uses the same pair as light (#fafafa / #111112, swapped) and the WCAG ratio is
 * symmetric, so both are 18.08.
 */
function cobaltContrast(theme: 'light' | 'dark'): ContrastCheck[] {
  const light = theme === 'light';
  return [
    { fg: 'on-surface', bg: 'surface', min: 4.5, expect: 18.08 },
    light
      ? { fg: 'on-surface-variant', bg: 'surface-container-lowest', min: 4.5, expect: 6.5 }
      : { fg: 'on-surface-variant', bg: 'surface-container-low', min: 4.5, expect: 8.83 },
    { fg: 'on-primary', bg: 'primary', min: 4.5, expect: light ? 5.57 : 5.46 },
    { fg: 'primary', bg: 'surface', min: 4.5, expect: light ? 5.33 : 6.22 },
    { fg: 'on-primary-container', bg: 'primary-container', min: 4.5, expect: 7.2 },
    { fg: 'on-error', bg: 'error', min: 4.5, expect: light ? 5.25 : 5.76 },
    { fg: '--mild-color-on-selected', bg: '--mild-color-selected', min: 4.5, expect: 7.25 },
    { fg: 'outline', bg: 'surface', min: 3, expect: light ? 3.6 : 5.02 },
    { fg: 'primary', bg: '--mild-color-workspace', min: 4.5, expect: light ? 5.05 : 6.44 },
    ...statusContrast(),
  ];
}

const GRAY = 'neutral grey scale (the generated surfaces are blue-tinted)';

export const cobalt: PaletteDefinition = {
  name: 'cobalt',
  description: 'Creative-tool palette: neutral cool greys, one cobalt accent, pale-blue selected state.',
  seed: { hex: '#0064d4', scheme: 'vibrant', contrastLevel: 0, specVersion: '2021' },
  // The palette and theme may sit on the same element or on nested ones. `:where()` keeps an
  // inherited cobalt ancestor weaker than an explicit `data-palette="neutral"` frame.
  selectors: {
    light: ['[data-palette="cobalt"]', ':where([data-palette="cobalt"]) [data-theme="light"]'],
    dark: ['[data-palette="cobalt"][data-theme="dark"]', '[data-theme="dark"] [data-palette="cobalt"]', ':where([data-palette="cobalt"]) [data-theme="dark"]'],
  },
  preamble: { light: ['color-scheme: light;'], dark: ['color-scheme: dark;'] },
  light: {
    overrides: {
      primary: { value: '#0064d4', reason: 'cobalt accent; white on it 5.57:1' },
      error: { value: '#cf263e', reason: 'vivid red; white on it 5.25:1' },
      surface: { value: '#fafafa', reason: `near-white; ${GRAY}` },
      'surface-dim': { value: '#e0e2e4', reason: 'neutral grey; equals surface-container-highest' },
      'surface-bright': { value: '#ffffff', reason: 'pure white' },
      'surface-container-low': { value: '#f3f4f5', reason: 'neutral grey' },
      'surface-container': { value: '#eeeff0', reason: 'neutral grey' },
      'surface-container-high': { value: '#e9eaeb', reason: 'neutral grey' },
      'surface-container-highest': { value: '#e0e2e4', reason: 'neutral grey' },
      'on-surface': { value: '#111112', reason: 'near-black; 18.08:1 on surface' },
      'on-surface-variant': { value: '#5c5e61', reason: 'neutral grey; 6.50:1 on white' },
      outline: { value: '#818487', reason: 'neutral grey; 3.60:1 on surface (one step lighter is 2.99:1 and fails the 3:1 UI boundary)' },
      'outline-variant': { value: '#d1d3d5', reason: 'neutral grey; dividers (decorative)' },
      'inverse-surface': { value: '#28292b', reason: 'near-black grey' },
      'inverse-on-surface': { value: '#fafafa', reason: 'near-white' },
      'inverse-primary': { value: '#4b93ff', reason: 'equals the dark primary' },
      'surface-tint': { value: '#0064d4', reason: 'follows the primary override' },
    },
    semantic: cobaltSemantic('light'),
    contrast: cobaltContrast('light'),
  },
  dark: {
    overrides: {
      primary: { value: '#4b93ff', reason: 'saturated cobalt; 6.22:1 on surface (generated #adc6ff is a pastel; the accent stays saturated)' },
      'on-primary': { value: '#001d47', reason: 'deep navy; 5.46:1 on primary (white would be 3.0:1)' },
      error: { value: '#fa4758', reason: 'vivid red for dark surfaces' },
      'on-error': { value: '#1f0004', reason: '5.76:1 on error (white would be 3.44:1)' },
      surface: { value: '#111112', reason: `near-black; ${GRAY}` },
      'surface-dim': { value: '#111112', reason: 'near-black; equals surface (M3 dark convention)' },
      'surface-bright': { value: '#383b3d', reason: 'neutral grey' },
      'surface-container-lowest': { value: '#0c0c0d', reason: 'near-black below surface' },
      'surface-container-low': { value: '#181819', reason: 'neutral grey' },
      'surface-container': { value: '#1f1f20', reason: 'neutral grey' },
      'surface-container-high': { value: '#28292b', reason: 'neutral grey' },
      'surface-container-highest': { value: '#323435', reason: 'neutral grey' },
      'on-surface': { value: '#fafafa', reason: 'near-white; 18.08:1 on surface' },
      'on-surface-variant': { value: '#b5b7bb', reason: 'neutral grey; 8.83:1 on surface-container-low' },
      outline: { value: '#818487', reason: 'neutral grey; 5.02:1 on surface' },
      'outline-variant': { value: '#383b3d', reason: 'neutral grey; dividers (decorative)' },
      'inverse-surface': { value: '#fafafa', reason: 'near-white' },
      'inverse-on-surface': { value: '#111112', reason: 'near-black' },
      'inverse-primary': { value: '#0064d4', reason: 'equals the light primary' },
      'surface-tint': { value: '#4b93ff', reason: 'follows the primary override' },
    },
    semantic: cobaltSemantic('dark'),
    contrast: cobaltContrast('dark'),
  },
};

export const palettes: PaletteDefinition[] = [neutral, cobalt];
