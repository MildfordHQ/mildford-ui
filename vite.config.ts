/// <reference types="vitest/config" />
import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import pkg from './package.json';

// Runtime dependencies stay external so consumers' bundlers resolve and tree-shake them once.
const externalPackages = [...Object.keys(pkg.peerDependencies), ...Object.keys(pkg.dependencies)];
const isExternal = (id: string) => externalPackages.some((name) => id === name || id.startsWith(`${name}/`));

const copyTokens = (): Plugin => ({
  name: 'copy-mildford-tokens',
  writeBundle() {
    copyFileSync(resolve(__dirname, 'src/tokens.css'), resolve(__dirname, 'dist/tokens.css'));
  },
});

export default defineConfig({
  plugins: [
    react(),
    copyTokens(),
    dts({
      insertTypesEntry: true,
      exclude: ['**/*.stories.tsx', '**/*.test.tsx', '**/*.test.ts', 'src/test/**', 'src/stories/**'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MildfordUI',
      formats: ['es'],
      // One module per source file: with "sideEffects" in package.json, consumers drop whole unused
      // components (and the React Aria code they pull in) instead of keeping every top-level call.
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: 'ui',
    },
    rollupOptions: {
      external: isExternal,
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    cssCodeSplit: false,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
    server: { deps: { inline: ['@material/material-color-utilities'] } },
    passWithNoTests: true,
    // React Aria overlays and user-event keyboard paths are slow in jsdom under a full parallel run.
    testTimeout: 15000,
  },
});
