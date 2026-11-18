# Contributing to Mildford UI

Thanks for your interest in Mildford UI. Bug reports, accessibility findings and focused pull requests are all welcome. For a new component or a change to a public API or token, please open an issue first so the design can be agreed before the work starts.

## Setup

- Node.js 24 (the version in `.nvmrc`; run `nvm use`)
- pnpm 10 (`corepack enable` picks up the version in `package.json`)

```sh
pnpm install
pnpm storybook   # http://localhost:6006
```

The README lists every script.

## Before you open a pull request

Run the same checks as CI:

```sh
pnpm typecheck
pnpm test
pnpm generate:palette --check
pnpm build
pnpm build-storybook
```

Then review your change in Storybook:

- the Accessibility panel shows no violations;
- light and dark themes, with both the neutral and cobalt palettes (toolbar);
- keyboard-only use, with a visible focus ring at every step;
- reduced motion;
- narrow viewports and long, realistic labels;
- status that is not conveyed by color alone.

## Adding or changing a component

1. Start from a need shared by more than one product, and check whether composing existing components already solves it.
2. Define semantics, keyboard behavior, responsive behavior and content guidance before visual variants.
3. Ship these together: strictly typed props, a colocated CSS Module, the export from the component folder and from `src/index.ts`, realistic CSF3 stories with `tags: ['autodocs']`, and a Vitest + Testing Library test that covers behavior and calls `expectNoAxeViolations`.
4. Prefer an additive variant over a near-duplicate component.

### Behavior

Every interactive component is built on `react-aria-components`, or on `react-aria` hooks where React Aria has no component. Do not add another behavior library or hand-roll focus management. Where React Aria has a gap, compose the smallest addition on top and document it in the component's JSDoc. Consumers never import React Aria directly; Mildford re-exports only prop types.

Components forward refs where direct focus or control is expected (buttons and form controls). Form controls pass native `onChange` events and refs through to the element.

### Prop names

Props follow React Aria's naming:

- state booleans start with `is`: `isDisabled`, `isOpen`, `isSelected`, `isRequired`, `isReadOnly`, `isPending`, `isCurrent`;
- initial state for uncontrolled use starts with `default`: `defaultSelected`, `defaultOpen`;
- appearance flags are plain adjectives: `elevated`, `fullWidth`, `connected`.

Avoid convenience props that encode one product's domain, such as a workflow status enum. Consumers map their own values to `BadgeTone` or `StatusIndicatorState`.

### Styling

- Style React Aria's `data-*` state attributes (`data-hovered`, `data-pressed`, `data-focus-visible`, `data-selected`, `data-disabled`, …) and the module's own class names. No global selectors on React Aria class names.
- Use tokens: no raw color, radius, shadow, duration or z-index values in a module.
- Inline styles may only set a component's own custom properties from props (for example `--menu-min-width`).

### Editor patterns

Only `EditorShell` stops pointer propagation, at its region roots, so a host's stage never sees presses on chrome. Individual components never stop propagation. Overlays portal to `document.body`.

### Scope

Mildford does not own routing, icons (consumers pass Material Symbols SVGs to `Icon`), data fetching, validation frameworks, charts or domain models.

## Tokens and palettes

The palette blocks of `src/tokens.css` are generated; do not edit them by hand. Change `scripts/palettes.ts` and run `pnpm generate:palette`. Every override needs a `reason`, and the generator fails if a palette breaks the WCAG contrast table. Semantic tokens (`--mild-color-*`) reference M3 roles (`--md-sys-color-*`); a literal value is allowed only where no role fits, such as status hues and shadows.

## Changelog and compatibility

Add an entry under `## Unreleased` in `CHANGELOG.md` (create the heading if it is missing) for every user-visible change. Mildford is pre-1.0, so a minor release may break the API, but every breaking change to a prop, default or token needs a rationale and migration steps in the pull request and the changelog.

## Pull requests

- Keep each pull request to one concern.
- Describe what changed and why, and how you checked it.
- Include screenshots for visual changes, in light and dark.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE.md).
