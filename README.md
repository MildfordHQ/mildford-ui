# Mildford UI

Material 3 Expressive design-system primitives for operational control planes and creative tools. Mildford uses strict TypeScript, CSS Modules, CSS custom-property tokens, React Aria Components for behaviour and accessibility, and Storybook.

## Quick start

Build Mildford, then link it from a sibling consumer with pnpm (adjust the relative path if the consumer package is nested):

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm --dir ../consumer add @mildford/ui@link:../mildford-ui
```

Import tokens and compiled component styles once at the application root:

```tsx
import '@mildford/ui/tokens.css';
import '@mildford/ui/style.css';
import { Button, StatusIndicator } from '@mildford/ui';
```

Set `data-theme="light"` or `data-theme="dark"` on a root element (light is the default). Creative tools add `data-palette="cobalt"` on the same element for the cobalt palette; `neutral` is the default and needs no attribute.

```html
<html data-theme="dark" data-palette="cobalt">
```

Mildford's font stack starts with Inter but does not load it. Self-host it in the consumer, for example with `@fontsource-variable/inter` (`import '@fontsource-variable/inter'`); for a closer creative-tool feel also set `font-feature-settings: var(--mild-font-features)` on the root.

Mildford ships no icons. Pass Material Symbols SVGs (or any SVG component) to `Icon`, `IconButton`, `MenuItem icon`, and the rail.

## Catalog

**Primitives**

- **Actions:** `Button`, `IconButton`, `ToggleButton`, `ToggleButtonGroup`, `ButtonGroup`, `Chip`, `SplitButton`
- **Menus and overlays:** `Menu`, `MenuTrigger`, `MenuItem`, `MenuSection`, `SubmenuTrigger`, `ContextMenu`, `Popover`, `Tooltip`, `Dialog`
- **Inputs:** `FormField`, `TextField`, `TextArea`, `Checkbox`, `Switch`, `Slider`, `Select`, `Dropdown` (deprecated — use `Select` or `Menu`)
- **Color:** `ColorSwatch`, `ColorSwatchButton`, `SwatchGrid`, `ColorPicker`, `ColorPickerPopover`, `DualSwatch`
- **Status and feedback:** `Badge`, `StatusIndicator`, `Alert`, `EmptyState`, `Spinner`
- **Display:** `Card` (optional `elevated` shadow), `MetricCard`, `Table`, `ProgressStepper`, `Icon`, `Kbd`, `Separator`

**Patterns**

- **Control planes:** `AppShell`, `PageHeader`, `SectionHeader`, `SegmentedNavigation`
- **Editors:** `EditorShell` (+ `useWorkspaceViewport`, `useEditorShell`), `TopAppBar`, `NavigationRail` (+ `NavigationRailItem`, `NavigationRailDivider`; bar variant below 1024px), `SidePanel`, `Toolbar`, `FloatingToolbar`

All navigation APIs accept real `href` values. Consumers own routing integration and domain-specific status mapping. Consumers never import `react-aria-components` directly.

Prop names follow React Aria: state booleans start with `is` (`isDisabled`, `isOpen`, `isSelected`, `isRequired`, `isReadOnly`, `isPending`, `isCurrent`), initial state for uncontrolled use starts with `default` (`defaultSelected`, `defaultOpen`), and appearance flags are plain adjectives (`elevated`, `fullWidth`, `connected`).

## Development

- `pnpm typecheck` — strict TypeScript validation (library and scripts)
- `pnpm test` — vitest + Testing Library + axe
- `pnpm build` — package and declaration build (one module per component, tree-shakeable)
- `pnpm storybook` — local component workbench (toolbar: Theme and Palette; Accessibility panel)
- `pnpm build-storybook` — static Storybook validation
- `pnpm generate:palette` — regenerate the palette blocks of `src/tokens.css` from `scripts/palettes.ts` (`--check` in CI)

See [CHANGELOG.md](CHANGELOG.md) for release notes.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, checks and component conventions.

## License

[MIT](LICENSE.md)
