import type { Preview } from '@storybook/react-vite';
import { createElement } from 'react';
import '../src/tokens.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Mildford color theme',
      defaultValue: 'light',
      toolbar: { icon: 'paintbrush', items: [{ value: 'light', title: 'Light' }, { value: 'dark', title: 'Dark' }] },
    },
    palette: {
      description: 'Mildford palette',
      defaultValue: 'neutral',
      toolbar: { icon: 'paintbrush', title: 'Palette', items: [{ value: 'neutral', title: 'Neutral' }, { value: 'cobalt', title: 'Cobalt' }] },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme === 'dark' ? 'dark' : 'light';
      const palette = context.globals.palette === 'cobalt' ? 'cobalt' : 'neutral';
      if (typeof document !== 'undefined') {
        document.documentElement.dataset.theme = theme;
        document.documentElement.dataset.palette = palette;
        document.body.style.background = 'var(--mild-color-canvas)';
        document.body.style.color = 'var(--mild-color-text)';
      }
      return createElement(Story);
    },
  ],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    // Sidebar order follows the README catalog.
    options: {
      storySort: {
        order: [
          'Overview',
          'Foundations',
          'Primitives',
          ['Actions', 'Menus and overlays', 'Inputs', 'Color', 'Status and feedback', 'Display'],
          'Patterns',
          ['Control planes', 'Editors'],
        ],
      },
    },
    // Widths on both sides of the EditorShell breakpoints (1024px and 1280px).
    viewport: {
      options: {
        desktop1440: { name: 'Desktop 1440', styles: { width: '1440px', height: '900px' } },
        desktop1280: { name: 'Desktop 1280', styles: { width: '1280px', height: '800px' } },
        tablet1100: { name: 'Tablet 1100', styles: { width: '1100px', height: '800px' } },
        tablet900: { name: 'Tablet 900', styles: { width: '900px', height: '1200px' } },
        phone390: { name: 'Phone 390', styles: { width: '390px', height: '844px' } },
      },
    },
  },
};

export default preview;
