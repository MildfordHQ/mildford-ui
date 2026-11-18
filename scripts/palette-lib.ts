/**
 * Pure helpers for the palette generator: the M3 role set, WCAG contrast, validation and CSS output.
 * Kept free of file-system access so it can be unit tested.
 */

export const ROLES = [
  'primary',
  'on-primary',
  'primary-container',
  'on-primary-container',
  'secondary',
  'on-secondary',
  'secondary-container',
  'on-secondary-container',
  'tertiary',
  'on-tertiary',
  'tertiary-container',
  'on-tertiary-container',
  'error',
  'on-error',
  'error-container',
  'on-error-container',
  'surface',
  'surface-dim',
  'surface-bright',
  'surface-container-lowest',
  'surface-container-low',
  'surface-container',
  'surface-container-high',
  'surface-container-highest',
  'on-surface',
  'on-surface-variant',
  'outline',
  'outline-variant',
  'inverse-surface',
  'inverse-on-surface',
  'inverse-primary',
  'surface-tint',
  'scrim',
  'shadow',
] as const;

export type Role = (typeof ROLES)[number];
export type Theme = 'light' | 'dark';

export interface Override {
  value: string;
  /** Why the generated value is replaced. Required: an override without a reason fails the script. */
  reason: string;
}

/** A semantic token value: a role reference (`role:surface`) or a literal CSS value. */
export type SemanticValue = `role:${Role}` | string;

export interface ContrastCheck {
  /** Role name (`on-surface`) or semantic token (`--mild-color-workspace`). */
  fg: string;
  bg: string;
  /** WCAG minimum: 4.5 for text, 3 for UI boundaries. */
  min: number;
  /** Ratio recorded in the spec (two decimals). A drift of 0.01 or more is a regression. */
  expect?: number;
}

export interface ThemeDefinition {
  overrides: Partial<Record<Role, Override>>;
  /** Tokens emitted as `--mild-<key>`, in order. */
  semantic: Record<string, SemanticValue>;
  contrast: ContrastCheck[];
}

export interface PaletteDefinition {
  name: string;
  description: string;
  /** Material Color Utilities input. Without a seed every role must be an override. */
  seed?: { hex: string; scheme: 'vibrant'; contrastLevel: number; specVersion: '2021' };
  selectors: Record<Theme, string[]>;
  /** Declarations emitted before the roles (e.g. `color-scheme`). */
  preamble?: Partial<Record<Theme, string[]>>;
  light: ThemeDefinition;
  dark: ThemeDefinition;
}

export type ResolvedRoles = Record<Role, string>;

export interface ResolvedTheme {
  roles: ResolvedRoles;
  /** Roles whose value differs from the generated one, with the reason. */
  overridden: Partial<Record<Role, Override & { generated?: string }>>;
}

const HEX = /^#[0-9a-f]{6}$/;

export function normalizeHex(value: string): string {
  const hex = value.trim().toLowerCase();
  if (!HEX.test(hex)) throw new Error(`Expected a #rrggbb color, got "${value}"`);
  return hex;
}

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const n = normalizeHex(hex);
  const r = parseInt(n.slice(1, 3), 16);
  const g = parseInt(n.slice(3, 5), 16);
  const b = parseInt(n.slice(5, 7), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG 2.x contrast ratio. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Merges generated roles with overrides; every role must end up defined. */
export function resolveTheme(generated: Partial<ResolvedRoles>, definition: ThemeDefinition, label: string): ResolvedTheme {
  const roles = {} as ResolvedRoles;
  const overridden: ResolvedTheme['overridden'] = {};
  const errors: string[] = [];
  for (const role of ROLES) {
    const override = definition.overrides[role];
    const base = generated[role];
    if (override) {
      if (!override.reason.trim()) errors.push(`${label}: override for ${role} has no reason`);
      const value = normalizeHex(override.value);
      if (base !== undefined && normalizeHex(base) === value) {
        errors.push(`${label}: override for ${role} equals the generated value ${value}; remove it`);
      }
      roles[role] = value;
      overridden[role] = { ...override, value, generated: base };
    } else if (base !== undefined) {
      roles[role] = normalizeHex(base);
    } else {
      errors.push(`${label}: role ${role} is neither generated nor overridden`);
    }
  }
  for (const key of Object.keys(definition.overrides)) {
    if (!(ROLES as readonly string[]).includes(key)) errors.push(`${label}: unknown role "${key}" in overrides`);
  }
  if (errors.length) throw new Error(errors.join('\n'));
  return { roles, overridden };
}

export function semanticCss(value: SemanticValue): string {
  return value.startsWith('role:') ? `var(--md-sys-color-${value.slice(5)})` : value;
}

/**
 * Semantic tokens reference roles. A literal hex that equals a role value is an error: it would
 * silently stop following the palette.
 */
export function validateSemantic(roles: ResolvedRoles, definition: ThemeDefinition, label: string): void {
  const errors: string[] = [];
  for (const [key, value] of Object.entries(definition.semantic)) {
    if (value.startsWith('role:')) {
      if (!(ROLES as readonly string[]).includes(value.slice(5))) errors.push(`${label}: --mild-${key} references unknown role ${value}`);
      continue;
    }
    if (HEX.test(value.toLowerCase())) {
      const match = ROLES.find((role) => roles[role] === value.toLowerCase());
      if (match) errors.push(`${label}: --mild-${key} is ${value}, the value of ${match}; use "role:${match}"`);
    }
  }
  if (errors.length) throw new Error(errors.join('\n'));
}

const MIX = /^color-mix\(in srgb, (#[0-9a-f]{6}) (\d+(?:\.\d+)?)%, var\(--md-sys-color-([a-z-]+)\)\)$/i;

/** `color-mix(in srgb, …)` as the browser computes it: a linear mix of the sRGB-encoded channels. */
export function mixSrgb(a: string, percentA: number, b: string): string {
  const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(normalizeHex(hex).slice(i, i + 2), 16));
  const [ca, cb] = [channels(a), channels(b)];
  const t = percentA / 100;
  return `#${ca.map((value, i) => Math.round(value * t + cb[i] * (1 - t)).toString(16).padStart(2, '0')).join('')}`;
}

/** Resolves a role or semantic token name to a hex color for contrast checks. */
export function resolveColor(name: string, roles: ResolvedRoles, semantic: Record<string, SemanticValue>): string {
  if ((ROLES as readonly string[]).includes(name)) return roles[name as Role];
  const key = name.replace(/^--mild-/, '');
  const value = semantic[key];
  if (value === undefined) throw new Error(`Unknown color "${name}" in contrast table`);
  if (value.startsWith('role:')) return roles[value.slice(5) as Role];
  const mix = MIX.exec(value);
  if (mix) return mixSrgb(mix[1], Number(mix[2]), roles[mix[3] as Role]);
  return normalizeHex(value);
}

export interface ContrastResult extends ContrastCheck {
  ratio: number;
  ok: boolean;
  problem?: string;
}

export function checkContrast(roles: ResolvedRoles, definition: ThemeDefinition): ContrastResult[] {
  return definition.contrast.map((check) => {
    const ratio = contrastRatio(resolveColor(check.fg, roles, definition.semantic), resolveColor(check.bg, roles, definition.semantic));
    const rounded = Math.round(ratio * 100) / 100;
    let problem: string | undefined;
    if (ratio < check.min) problem = `${rounded} is below the minimum ${check.min}`;
    else if (check.expect !== undefined && Math.abs(rounded - check.expect) >= 0.01) problem = `${rounded} differs from the recorded ${check.expect}`;
    return { ...check, ratio: rounded, ok: !problem, problem };
  });
}

function block(selectors: string[], lines: string[]): string {
  return `${selectors.join(',\n')} {\n${lines.map((line) => (line ? `  ${line}` : '')).join('\n')}\n}`;
}

export function themeCss(palette: PaletteDefinition, theme: Theme, resolved: ResolvedTheme): string {
  const definition = palette[theme];
  const lines: string[] = [...(palette.preamble?.[theme] ?? [])];
  if (lines.length) lines.push('');
  lines.push(palette.seed ? `/* Roles: MCU ${palette.seed.scheme} seed ${palette.seed.hex}; ◆ = override (reason in scripts/palettes.ts). */` : '/* Roles: explicit values (no seed). */');
  for (const role of ROLES) {
    const mark = palette.seed && resolved.overridden[role] ? ' /* ◆ */' : '';
    lines.push(`--md-sys-color-${role}: ${resolved.roles[role]};${mark}`);
  }
  lines.push('', '/* Semantic roles. */');
  for (const [key, value] of Object.entries(definition.semantic)) lines.push(`--mild-${key}: ${semanticCss(value)};`);
  return block(palette.selectors[theme], lines);
}

export function paletteCss(palette: PaletteDefinition, resolved: Record<Theme, ResolvedTheme>): string {
  return `${themeCss(palette, 'light', resolved.light)}\n\n${themeCss(palette, 'dark', resolved.dark)}`;
}

export function fenceMarkers(name: string): { start: string; end: string } {
  return {
    start: `/* @generated palette:${name} start — do not edit; run \`pnpm generate:palette\` (scripts/palettes.ts) */`,
    end: `/* @generated palette:${name} end */`,
  };
}

/** Replaces the fenced region for `name` in `source`. Throws when the fence is missing. */
export function replaceFence(source: string, name: string, css: string): string {
  const { start, end } = fenceMarkers(name);
  const from = source.indexOf(start);
  const to = source.indexOf(end);
  if (from === -1 || to === -1 || to < from) throw new Error(`Fence for palette "${name}" not found in tokens.css`);
  return `${source.slice(0, from + start.length)}\n${css}\n${source.slice(to)}`;
}
