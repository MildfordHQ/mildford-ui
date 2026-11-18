import { useId, type ReactNode } from 'react';
import { Button as RACButton, type PressEvent } from 'react-aria-components';
import { cx } from '../internal/cx';
import { Menu, MenuTrigger } from '../Menu';
import { Tooltip } from '../Tooltip';
import styles from './SplitButton.module.css';

export interface SplitButtonProps {
  /** Main action label. */
  children: ReactNode;
  /** Leading icon of the main action (20px). */
  icon?: ReactNode;
  onPress?: (event: PressEvent) => void;
  /** Disables the main action only; the menu stays available. */
  isDisabled?: boolean;
  /** `MenuItem`s / `MenuSection`s for the trailing menu. */
  menu: ReactNode;
  /** Accessible name of the trailing button. @default "More options" */
  menuLabel?: string;
  onAction?: (key: React.Key) => void;
  isMenuDisabled?: boolean;
  /** @default "filled" */
  variant?: 'filled' | 'tonal' | 'outlined';
  /** Tooltip on the main action (shown while it is enabled). */
  tooltip?: ReactNode;
  className?: string;
}

function Chevron() {
  return (
    <svg className={styles.chevron} viewBox="0 -960 960 960" width={20} height={20} aria-hidden="true">
      <path d="M480-340 240-580l56-56 184 184 184-184 56 56Z" />
    </svg>
  );
}

/**
 * M3 split button: a main action and an attached menu trigger with connected
 * inner corners, exposed as one group named by the main label. The trailing half rounds fully while
 * its menu is open (expressive morph).
 */
export function SplitButton({
  children,
  icon,
  onPress,
  isDisabled,
  menu,
  menuLabel = 'More options',
  onAction,
  isMenuDisabled,
  variant = 'filled',
  tooltip,
  className,
}: SplitButtonProps) {
  const labelId = useId();
  const main = (
    <RACButton className={cx(styles.segment, styles.leading)} onPress={onPress} isDisabled={isDisabled}>
      {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
      <span id={labelId}>{children}</span>
    </RACButton>
  );
  return (
    <div role="group" aria-labelledby={labelId} className={cx(styles.split, styles[variant], className)}>
      {tooltip ? <Tooltip trigger={main} placement="bottom">{tooltip}</Tooltip> : main}
      <MenuTrigger>
        <RACButton className={cx(styles.segment, styles.trailing)} aria-label={menuLabel} isDisabled={isMenuDisabled}>
          <Chevron />
        </RACButton>
        <Menu aria-label={menuLabel} placement="bottom end" onAction={onAction}>
          {menu}
        </Menu>
      </MenuTrigger>
    </div>
  );
}
