import { cloneElement, isValidElement, type ReactElement, type ReactNode, type SVGAttributes } from 'react';
import { cx } from '../internal/cx';
import styles from './Icon.module.css';

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children'> {
  /** Rendered size in px (24 rail/toolbars/menus, 20 chips and dense rows, 16 badges). @default 24 */
  size?: 16 | 20 | 24;
  /**
   * An SVG component (e.g. a Material Symbols import rendered as a component), an `<svg>` element,
   * or bare path content drawn in the Material Symbols viewBox `0 -960 960 960`.
   */
  children: ReactNode;
  /** Accessible name. Without it the icon is decorative (`aria-hidden`). */
  label?: string;
}

/**
 * Sizes and colors an icon. Mildford ships no icons: consumers import Material Symbols SVGs.
 * Color follows `currentColor`.
 */
export function Icon({ size = 24, children, label, className, viewBox, ...props }: IconProps) {
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true as const, focusable: 'false' as const };
  const shared = { ...props, ...a11y, width: size, height: size, className: cx(styles.icon, className), 'data-size': size };

  // An <svg> element or an SVG component: size it in place.
  if (isValidElement(children) && (typeof children.type !== 'string' || children.type === 'svg')) {
    const child = children as ReactElement<{ className?: string }>;
    return cloneElement(child, { ...shared, className: cx(styles.icon, child.props.className, className) });
  }

  return (
    <svg {...shared} viewBox={viewBox ?? '0 -960 960 960'} xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}
