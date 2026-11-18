import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

// Mildford mark: two arches (a lowercase "m", and a bridge) over a ford, on a cobalt tile.
const LOGO = `<svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true" style="flex:none">
  <rect width="32" height="32" rx="9" fill="#0064d4"/>
  <path d="M9 20v-6.5a3.5 3.5 0 0 1 7 0V20M16 13.5a3.5 3.5 0 0 1 7 0V20" fill="none" stroke="#fff" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M8 24.5q2-1.5 4 0t4 0 4 0 4 0" fill="none" stroke="#a8c7ff" stroke-width="2" stroke-linecap="round"/>
</svg>`;

// With a title and no brandImage, Storybook renders the title as HTML, so the caption inherits the
// sidebar's font and its light/dark text color.
const BRAND = `<span style="display:inline-flex;align-items:center;gap:10px;font-size:15px;font-weight:700;letter-spacing:-0.01em">${LOGO}<span>Mildford UI</span></span>`;

const dark = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;

addons.setConfig({
  theme: create({
    base: dark ? 'dark' : 'light',
    brandTitle: BRAND,
    brandUrl: './',
    brandTarget: '_self',
  }),
});
