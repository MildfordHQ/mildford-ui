/**
 * Generates the palette blocks of src/tokens.css from scripts/palettes.ts.
 *
 *   pnpm generate:palette            rewrite the fenced regions in src/tokens.css
 *   pnpm generate:palette --check    fail if src/tokens.css is out of date (CI)
 *   pnpm generate:palette --print    print the CSS and the contrast tables only
 *
 * Every run asserts the contrast tables (WCAG 2.x) and fails on a regression.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { replaceFence } from './palette-lib';
import { buildPalette } from './palette-build';
import { palettes } from './palettes';

function main(argv: string[]): number {
  const check = argv.includes('--check');
  const print = argv.includes('--print');
  const tokensPath = resolve(__dirname, '../src/tokens.css');
  const current = readFileSync(tokensPath, 'utf8');
  let next = current;
  const failures: string[] = [];

  for (const palette of palettes) {
    const built = buildPalette(palette);
    failures.push(...built.failures);
    if (print) console.log(`/* ${palette.name} */\n${built.css}\n`);
    console.log(built.report.join('\n'));
    if (!print) next = replaceFence(next, palette.name, built.css);
  }

  if (failures.length) {
    console.error(`\nContrast regressions:\n${failures.map((f) => `  - ${f}`).join('\n')}`);
    return 1;
  }
  if (print) return 0;
  if (check) {
    if (next !== current) {
      console.error('\nsrc/tokens.css is out of date. Run `pnpm generate:palette`.');
      return 1;
    }
    console.log('\nsrc/tokens.css is up to date.');
    return 0;
  }
  if (next !== current) {
    writeFileSync(tokensPath, next);
    console.log('\nWrote src/tokens.css.');
  } else {
    console.log('\nsrc/tokens.css unchanged.');
  }
  return 0;
}

process.exitCode = main(process.argv.slice(2));
