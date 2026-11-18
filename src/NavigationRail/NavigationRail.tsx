import {
  Children,
  createContext,
  forwardRef,
  Fragment,
  isValidElement,
  useContext,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  Button as RACButton,
  Sheet,
  SheetBackdrop,
  SheetContent,
  SheetOverlay,
  ToggleButton as RACToggleButton,
  ToggleButtonGroup as RACToggleButtonGroup,
  type Key,
  type Selection,
  type ToggleButtonProps as RACToggleButtonProps,
} from 'react-aria-components';
import { useEditorShell } from '../EditorShell/EditorShellContext';
import { cx } from '../internal/cx';
import { useBreakpoint } from '../internal/useMediaQuery';
import { Kbd } from '../Kbd';
import { Tooltip } from '../Tooltip';
import styles from './NavigationRail.module.css';

type ResolvedVariant = 'rail' | 'bar' | 'sheet';

interface NavigationRailContextValue {
  variant: ResolvedVariant;
  /** Called after any entry is pressed (the More sheet closes itself with it). */
  onItemPress?: () => void;
}

const NavigationRailContext = createContext<NavigationRailContextValue>({ variant: 'rail' });

export interface NavigationRailItemProps extends Omit<RACToggleButtonProps, 'children' | 'className' | 'style'> {
  /** 24px glyph shown in the indicator, e.g. `<Icon>{arrowSelectorTool}</Icon>`. */
  icon: ReactNode;
  /** Glyph shown while selected (the Material Symbols `-fill` variant). Defaults to `icon`. */
  activeIcon?: ReactNode;
  /** Visible label under the indicator; also the entry's accessible name. */
  label: ReactNode;
  /** Shortcut shown as `Kbd` chips in the tooltip, e.g. `"V"` or `['Shift', 'G']`. */
  shortcut?: string | string[];
  /**
   * Small decoration at the indicator's top-right (16px circle), e.g. a lock `<Icon size={16}>`.
   * It is `aria-hidden`: put its meaning in `tooltip` or `label` too
   * (e.g. `tooltip="Square · 1 — Shift-click or double-click to lock"`).
   */
  badge?: ReactNode;
  /** Tooltip text. @default label */
  tooltip?: ReactNode;
  className?: string;
}

/**
 * One rail / navigation-bar entry: a RAC `ToggleButton` with a 56×32 indicator pill,
 * a 24px icon and a label-medium label. Inside `NavigationRail`'s tool group pass `id`; it becomes
 * a radio in RAC's single-select group. In `footer` it is a standalone toggle (`aria-pressed`)
 * driven by `isSelected` / `onChange`. DOM events such as `onDoubleClick` pass through to the button.
 */
export const NavigationRailItem = forwardRef<HTMLButtonElement, NavigationRailItemProps>(function NavigationRailItem(
  { icon, activeIcon, label, shortcut, badge, tooltip, className, onPress, ...props },
  ref,
) {
  const { variant, onItemPress } = useContext(NavigationRailContext);
  const button = (
    <RACToggleButton
      {...props}
      ref={ref}
      onPress={(event) => {
        onPress?.(event);
        onItemPress?.();
      }}
      className={cx(styles.item, className)}
    >
      {({ isSelected }) => (
        <>
          <span className={styles.indicator}>
            <span className={styles.icon} aria-hidden="true">{isSelected && activeIcon ? activeIcon : icon}</span>
            {badge && <span className={styles.badge} aria-hidden="true">{badge}</span>}
          </span>
          <span className={styles.label}>{label}</span>
        </>
      )}
    </RACToggleButton>
  );
  return (
    <Tooltip trigger={button} placement={variant === 'rail' ? 'right' : 'top'}>
      {tooltip ?? label}
      {shortcut && <Kbd keys={shortcut} />}
    </Tooltip>
  );
});

/** 1px `outline-variant` rule with a 16px inset between rail groups. Not rendered in the bar. */
export function NavigationRailDivider() {
  return <div className={styles.divider} aria-hidden="true" />;
}

export interface NavigationRailProps {
  /** Label of the tool group (a radio group), e.g. "Tools". `EditorShell` labels the surrounding `<nav>` itself. */
  'aria-label': string;
  /** Key (`id`) of the active tool; `null` = none pressed. */
  selectedKey: Key | null;
  /** Called with the pressed tool's key. Pressing the active tool again does not call it. */
  onSelectionChange: (key: Key) => void;
  /** Tool entries (`NavigationRailItem` with `id`; `NavigationRailDivider` allowed): exactly one pressed. */
  children: ReactNode;
  /** Independent toggles after the tools (e.g. panel entries: `NavigationRailItem` with `isSelected` / `onChange`). */
  footer?: ReactNode;
  /**
   * `rail` = vertical M3 navigation rail; `bar` = M3 navigation bar (bottom, horizontal);
   * `auto` = `bar` when the enclosing `EditorShell` places the rail at the bottom, or, outside a
   * shell, below 1024px.
   * @default "auto"
   */
  variant?: 'rail' | 'bar' | 'auto';
  /**
   * Bar only: how many entries fit before the More overflow. When tools + footer entries exceed it,
   * the first `maxBarItems - 1` show plus a More entry that opens a bottom sheet with the rest.
   * Clamped to 1–10.
   * @default 5
   */
  maxBarItems?: number;
  /** Label of the overflow entry and its sheet. @default "More" */
  moreLabel?: string;
  className?: string;
}

type Entry = { kind: 'tool' | 'footer'; element: ReactElement };

/** Flattens fragments; drops dividers and non-elements (the bar and sheet have no dividers). */
function collectEntries(nodes: ReactNode, kind: Entry['kind'], out: Entry[] = []): Entry[] {
  Children.forEach(nodes, (node) => {
    if (!isValidElement(node)) return;
    if (node.type === Fragment) collectEntries((node.props as { children?: ReactNode }).children, kind, out);
    else if (node.type !== NavigationRailDivider) out.push({ kind, element: node });
  });
  return out;
}

function MoreGlyph() {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} focusable="false" aria-hidden="true">
      <circle cx="6" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="18" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

/**
 * M3 navigation rail for editor tools and, at small widths, the M3 navigation bar.
 * Tools are modes, not links: they sit in a RAC `ToggleButtonGroup`
 * (`selectionMode="single"`, `disallowEmptySelection`), so arrow keys move between them and RAC
 * exposes them as `role="radio"` with `aria-checked` inside a labelled `radiogroup`. Footer entries are
 * standalone toggles with `aria-pressed`. Render it in `EditorShell`'s `rail` slot (which provides
 * the `<nav>` landmark) or inside your own `<nav>`.
 */
export function NavigationRail({
  'aria-label': ariaLabel,
  selectedKey,
  onSelectionChange,
  children,
  footer,
  variant = 'auto',
  maxBarItems = 5,
  moreLabel = 'More',
  className,
}: NavigationRailProps) {
  const shell = useEditorShell();
  const breakpoint = useBreakpoint();
  const resolved: 'rail' | 'bar' =
    variant !== 'auto' ? variant : shell ? (shell.railPlacement === 'bottom' ? 'bar' : 'rail') : breakpoint === 'sm' ? 'bar' : 'rail';
  const [isMoreOpen, setMoreOpen] = useState(false);

  const selectedKeys = useMemo(() => (selectedKey === null ? [] : [selectedKey]), [selectedKey]);
  const onGroupChange = (keys: Selection) => {
    if (keys === 'all') return;
    const [key] = [...keys];
    if (key !== undefined && key !== selectedKey) onSelectionChange(key);
  };
  const toolGroup = (items: ReactNode, orientation: 'horizontal' | 'vertical', groupClassName: string) => (
    <RACToggleButtonGroup
      aria-label={ariaLabel}
      selectionMode="single"
      disallowEmptySelection
      orientation={orientation}
      selectedKeys={selectedKeys}
      onSelectionChange={onGroupChange}
      className={groupClassName}
    >
      {items}
    </RACToggleButtonGroup>
  );

  if (resolved === 'rail') {
    return (
      <NavigationRailContext.Provider value={{ variant: 'rail' }}>
        <div className={cx(styles.rail, className)} data-variant="rail">
          {toolGroup(children, 'vertical', styles.railGroup)}
          {footer && <div className={styles.railGroup}>{footer}</div>}
        </div>
      </NavigationRailContext.Provider>
    );
  }

  const entries = [...collectEntries(children, 'tool'), ...collectEntries(footer, 'footer')];
  const limit = Math.min(Math.max(Math.round(maxBarItems), 1), 10);
  const overflowing = entries.length > limit;
  const visible = overflowing ? entries.slice(0, limit - 1) : entries;
  const overflow = overflowing ? entries.slice(limit - 1) : [];
  const visibleTools = visible.filter((entry) => entry.kind === 'tool').map((entry) => entry.element);
  const visibleFooter = visible.filter((entry) => entry.kind === 'footer').map((entry) => entry.element);
  const overflowTools = overflow.filter((entry) => entry.kind === 'tool').map((entry) => entry.element);
  const overflowFooter = overflow.filter((entry) => entry.kind === 'footer').map((entry) => entry.element);
  const selectionInOverflow = overflowTools.some((element) => (element.props as { id?: Key }).id === selectedKey);

  return (
    <NavigationRailContext.Provider value={{ variant: 'bar' }}>
      <div className={cx(styles.bar, className)} data-variant="bar" data-in-shell={shell ? true : undefined}>
        {visibleTools.length > 0 && (
          <div className={styles.barTools} data-count={visibleTools.length}>
            {toolGroup(visibleTools, 'horizontal', styles.barGroup)}
          </div>
        )}
        {visibleFooter}
        {overflowing && (
          <Tooltip
            placement="top"
            trigger={
              <RACButton
                className={styles.item}
                onPress={() => setMoreOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={isMoreOpen}
                data-has-selection={selectionInOverflow || undefined}
              >
                <span className={styles.indicator}>
                  <span className={styles.icon}><MoreGlyph /></span>
                </span>
                <span className={styles.label}>{moreLabel}</span>
              </RACButton>
            }
          >
            {moreLabel}
          </Tooltip>
        )}
      </div>
      {overflowing && (
        <SheetOverlay className={styles.sheetOverlay} isOpen={isMoreOpen} onOpenChange={setMoreOpen} position="bottom">
          <SheetBackdrop className={styles.sheetBackdrop} />
          <Sheet className={styles.sheet}>
            <SheetContent className={styles.sheetContent} aria-label={moreLabel}>
              <div className={styles.sheetHandle} aria-hidden="true" />
              <NavigationRailContext.Provider value={{ variant: 'sheet', onItemPress: () => setMoreOpen(false) }}>
                {overflowTools.length > 0 && toolGroup(overflowTools, 'horizontal', styles.sheetGroup)}
                {overflowFooter.length > 0 && <div className={styles.sheetGroup}>{overflowFooter}</div>}
              </NavigationRailContext.Provider>
            </SheetContent>
          </Sheet>
        </SheetOverlay>
      )}
    </NavigationRailContext.Provider>
  );
}
