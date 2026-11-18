import type { ReactElement, ReactNode } from 'react';
import { Select, type SelectItem, type SelectSection } from '../Select';

export interface DropdownItemType {
  label: ReactNode;
  value: string;
  isDisabled?: boolean;
}

export interface DropdownProps {
  /**
   * Label shown on the trigger button
   */
  label?: ReactNode;

  /**
   * Currently selected value
   */
  value?: string;

  /**
   * Items to display in the dropdown
   */
  items: (DropdownItemType | 'separator' | { type: 'label'; text: string })[];

  /**
   * Callback when an item is selected
   */
  onSelect?: (value: string) => void;

  /**
   * Placeholder text when no value is selected
   */
  placeholder?: string;

  /**
   * Whether the dropdown is disabled
   */
  isDisabled?: boolean;

  /**
   * Additional CSS class for the trigger
   */
  className?: string;
}

/** Splits the flat item list at separators and labels into listbox sections. */
function toSections(items: DropdownProps['items']): SelectSection[] {
  const sections: SelectSection[] = [];
  let current: SelectSection = { items: [] };
  const flush = () => {
    if (current.items.length || current.title) sections.push(current);
  };
  for (const item of items) {
    if (item === 'separator') {
      flush();
      current = { items: [] };
    } else if ('type' in item && item.type === 'label') {
      if (current.items.length || current.title) flush();
      current = { title: item.text, items: [] };
    } else {
      const entry = item as DropdownItemType;
      current.items.push({ value: entry.value, label: entry.label, isDisabled: entry.isDisabled } satisfies SelectItem);
    }
  }
  flush();
  return sections;
}

/**
 * @deprecated Use `Select` for value choice or `Menu` for actions. `Dropdown` keeps its flat item-list
 * props as a thin wrapper over `Select` and will be removed in a future release.
 */
export function Dropdown({ label, value, items, onSelect, placeholder = 'Select...', isDisabled = false, className = '' }: DropdownProps): ReactElement {
  return (
    <Select
      aria-label={typeof label === 'string' ? label : placeholder}
      items={toSections(items)}
      value={value ?? null}
      onChange={(next) => onSelect?.(next)}
      placeholder={placeholder}
      isDisabled={isDisabled}
      triggerContent={label}
      triggerClassName={className}
    />
  );
}

export default Dropdown;
