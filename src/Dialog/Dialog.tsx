import { useId, type DialogHTMLAttributes, type ReactNode } from 'react';
import {
  Dialog as RACDialog,
  Heading,
  Modal,
  ModalOverlay,
  type DialogProps as RACDialogProps,
} from 'react-aria-components';
import { IconButton } from '../IconButton';
import { cx } from '../internal/cx';
import styles from './Dialog.module.css';

export type DialogSize = 'sm' | 'md' | 'lg';

export interface DialogProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'open' | 'onClose' | 'title'> {
  /** Whether the dialog is open (controlled). */
  isOpen: boolean;
  /** Called with `false` when the close button, Escape or a scrim press dismisses the dialog. */
  onOpenChange: (open: boolean) => void;
  /** Visible heading; labels the dialog. */
  title: ReactNode;
  /** Supporting text under the title; describes the dialog (`aria-describedby`). */
  description?: ReactNode;
  children: ReactNode;
  /** Actions row, usually `Button`s. */
  footer?: ReactNode;
  /** Accessible name of the close button. @default "Close dialog" */
  closeLabel?: string;
  /**
   * Panel width: `sm` 360px, `md` 480px, `lg` 640px (all capped to the viewport).
   * When omitted the panel is 560px wide.
   */
  size?: DialogSize;
}

/**
 * A modal dialog on RAC `ModalOverlay` + `Modal` + `Dialog`: focus is trapped inside and returns
 * to the previously focused element on close; Escape and a press on the scrim call
 * `onOpenChange(false)`; page scroll is locked while open.
 *
 * `className` and `style` go on the sized modal box. Other DOM props (`id`, `role`, `aria-*`, `data-*`, global events) go on the
 * element with `role="dialog"`.
 */
export function Dialog({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
  footer,
  closeLabel = 'Close dialog',
  size,
  className,
  style,
  ...props
}: DialogProps) {
  const descriptionId = useId();
  return (
    <ModalOverlay isOpen={isOpen} onOpenChange={onOpenChange} isDismissable className={styles.overlay}>
      <Modal className={cx(styles.modal, size && styles[size], className)} style={style}>
        <RACDialog
          {...(props as Omit<RACDialogProps, 'children'>)}
          className={styles.panel}
          aria-describedby={cx(props['aria-describedby'], Boolean(description) && descriptionId) || undefined}
        >
          <header className={styles.header}>
            <div className={styles.heading}>
              <Heading slot="title" level={2} className={styles.title}>{title}</Heading>
              {description && <p id={descriptionId} className={styles.description}>{description}</p>}
            </div>
            <IconButton aria-label={closeLabel} className={styles.close} onPress={() => onOpenChange(false)}>
              <svg width={24} height={24} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6L19 6.4 17.6 5 12 10.6Z" fill="currentColor" />
              </svg>
            </IconButton>
          </header>
          <div className={styles.body}>{children}</div>
          {footer && <footer className={styles.footer}>{footer}</footer>}
        </RACDialog>
      </Modal>
    </ModalOverlay>
  );
}
