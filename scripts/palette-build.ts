/**
 * Builds palette CSS from a definition: MCU generation, overrides, validation and contrast report.
 */
import { Hct, SchemeVibrant, argbFromHex, hexFromArgb } from '@material/material-color-utilities';
import {
  ROLES,
  checkContrast,
  paletteCss,
  resolveTheme,
  validateSemantic,
  type PaletteDefinition,
  type ResolvedRoles,
  type ResolvedTheme,
  type Role,
  type Theme,
} from './palette-lib';

const camel = (role: Role) => role.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

export function generateRoles(palette: PaletteDefinition, theme: Theme): Partial<ResolvedRoles> {
  if (!palette.seed) return {};
  const { hex, contrastLevel, specVersion } = palette.seed;
  const scheme = new SchemeVibrant(Hct.fromInt(argbFromHex(hex)), theme === 'dark', contrastLevel, specVersion) as unknown as Record<string, number>;
  const roles: Partial<ResolvedRoles> = {};
  for (const role of ROLES) {
    const argb = scheme[camel(role)];
    if (typeof argb === 'number') roles[role] = hexFromArgb(argb);
  }
  return roles;
}

export function buildPalette(palette: PaletteDefinition): { css: string; resolved: Record<Theme, ResolvedTheme>; report: string[]; failures: string[] } {
  const resolved = {} as Record<Theme, ResolvedTheme>;
  const report: string[] = [];
  const failures: string[] = [];
  for (const theme of ['light', 'dark'] as const) {
    const label = `${palette.name}/${theme}`;
    resolved[theme] = resolveTheme(generateRoles(palette, theme), palette[theme], label);
    validateSemantic(resolved[theme].roles, palette[theme], label);
    report.push(`\n${label}`);
    for (const result of checkContrast(resolved[theme].roles, palette[theme])) {
      const line = `  ${result.ok ? 'ok  ' : 'FAIL'} ${result.fg} on ${result.bg}: ${result.ratio}:1 (min ${result.min}${result.expect ? `, spec ${result.expect}` : ''})`;
      report.push(line);
      if (!result.ok) failures.push(`${label}: ${result.fg} on ${result.bg} — ${result.problem}`);
    }
    if (palette.seed) {
      for (const [role, override] of Object.entries(resolved[theme].overridden)) {
        report.push(`  ◆ ${role}: ${override?.generated ?? '—'} → ${override?.value} (${override?.reason})`);
      }
    }
  }
  return { css: paletteCss(palette, resolved), resolved, report, failures };
}
