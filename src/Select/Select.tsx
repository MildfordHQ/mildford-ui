import type { ReactNode } from 'react';
import {
  Button,
  FieldError,
  Header,
  Label,
  ListBox,
  ListBoxItem,
  ListBoxSection,
  Popover,
  Select as RACSelect,
  SelectValue,
  Text,
  type Key,
} from 'react-aria-components';
import { cx } from '../internal/cx';
import styles from './Select.module.css';

export interface SelectItem {
  /** Stable value reported by `onChange`. */
  value: string;
  label: ReactNode;
  /** Plain-text label for typeahead and the accessible name when `label` is not a string. */
  textValue?: string;
  icon?: ReactNode;
  description?: ReactNode;
  isDisabled?: boolean;
}

export interface SelectSection {
  /** Visible section header. */
  title?: ReactNode;
  items: SelectItem[];
}

export interface SelectProps {
  /** Visible field label. Pass `aria-label` instead when the context labels the field. */
  label?: ReactNode;
  'aria-label'?: string;
  /** Items, or sections of items (sections are separated by a divider). */
  items: SelectItem[] | SelectSection[];
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string) => void;
  /** @default "Select…" */
  placeholder?: string;
  description?: ReactNode;
  /** Error message; marks the field invalid. */
  error?: ReactNode;
  isDisabled?: boolean;
  isRequired?: boolean;
  name?: string;
  /** Replaces the selected value in the trigger (e.g. a fixed "Palette" label). */
  triggerContent?: ReactNode;
  className?: string;
  triggerClassName?: string;
}

const isSections = (items: SelectItem[] | SelectSection[]): items is SelectSection[] => items.length > 0 && 'items' in items[0];

function Chevron() {
  return (
    <svg className={styles.chevron} viewBox="0 -960 960 960" width={20} height={20} aria-hidden="true">
      <path d="M480-340 240-580l56-56 184 184 184-184 56 56Z" />
    </svg>
  );
}

function Item({ item }: { item: SelectItem }) {
  const textValue = item.textValue ?? (typeof item.label === 'string' ? item.label : item.value);
  return (
    <ListBoxItem id={item.value} textValue={textValue} isDisabled={item.isDisabled} className={styles.item}>
      {({ isSelected }) => (
        <>
          {item.icon && <span className={styles.icon} aria-hidden="true">{item.icon}</span>}
          <span className={styles.text}>
            <Text slot="label">{item.label}</Text>
            {item.description && <Text slot="description" className={styles.description}>{item.description}</Text>}
          </span>
          {isSelected && (
            <svg className={styles.check} viewBox="0 -960 960 960" width={20} height={20} aria-hidden="true"><path d="M380-250 160-470l56-56 164 164 364-364 56 56Z" /></svg>
          )}
        </>
      )}
    </ListBoxItem>
  );
}

/** Value choice on RAC `Select` + `ListBox` (use `Menu` for actions). */
export function Select({
  label,
  'aria-label': ariaLabel,
  items,
  value,
  defaultValue,
  onChange,
  placeholder = 'Select…',
  description,
  error,
  isDisabled,
  isRequired,
  name,
  triggerContent,
  className,
  triggerClassName,
}: SelectProps) {
  const sections: SelectSection[] = isSections(items) ? items : [{ items }];
  return (
    <RACSelect
      className={cx(styles.field, className)}
      aria-label={ariaLabel}
      value={value}
      defaultValue={defaultValue}
      onChange={(key: Key | null) => { if (key !== null) onChange?.(String(key)); }}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isRequired={isRequired}
      isInvalid={Boolean(error) || undefined}
      name={name}
    >
      {label && <Label className={styles.label}>{label}</Label>}
      <Button className={cx(styles.trigger, triggerClassName)}>
        {triggerContent ? <span className={styles.value}>{triggerContent}</span> : <SelectValue className={styles.value} />}
        <Chevron />
      </Button>
      {description && !error && <Text slot="description" className={styles.helper}>{description}</Text>}
      {error && <FieldError className={styles.error}>{error}</FieldError>}
      <Popover className={styles.popover} offset={4}>
        <ListBox className={styles.listbox}>
          {sections.map((section, index) => (
            <ListBoxSection key={index} className={styles.section} aria-label={typeof section.title === 'string' ? section.title : undefined}>
              {section.title && <Header className={styles.header}>{section.title}</Header>}
              {section.items.map((item) => <Item key={item.value} item={item} />)}
            </ListBoxSection>
          ))}
        </ListBox>
      </Popover>
    </RACSelect>
  );
}
