import { forwardRef, type ReactNode } from 'react';
import { Switch as RACSwitch, type SwitchProps as RACSwitchProps } from 'react-aria-components';
import { cx } from '../internal/cx';
import styles from './Switch.module.css';

export interface SwitchProps extends Omit<RACSwitchProps, 'children' | 'className' | 'style'> {
  /** Visible label (body-medium), drawn at the start of the row with the track at the end. Without it pass `aria-label`. */
  children?: ReactNode;
  className?: string;
}

/**
 * M3 switch on RAC `Switch`: 52×32 track; the handle is 16px off,
 * 24px on and grows to 28px while pressed.
 */
export const Switch = forwardRef<HTMLLabelElement, SwitchProps>(function Switch({ children, className, ...props }, ref) {
  return (
    <RACSwitch {...props} ref={ref} className={cx(styles.switch, children != null && styles.withLabel, className)}>
      {children != null && <span className={styles.label}>{children}</span>}
      <span className={styles.track} aria-hidden="true">
        <span className={styles.handle} />
      </span>
    </RACSwitch>
  );
});
