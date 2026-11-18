import { useState, type ReactElement, type ReactNode } from 'react';
import {
  ColorArea,
  ColorField,
  ColorPicker as RACColorPicker,
  ColorSlider,
  ColorThumb,
  FieldError,
  Input,
  Label,
  SliderTrack,
  type Color,
} from 'react-aria-components';
import { cx } from '../internal/cx';
import { Popover, type PopoverPlacement } from '../Popover';
import { SwatchGrid, type SwatchGridColor } from './SwatchGrid';
import { isCompleteHex, normalizeColor, toHex } from './colorUtils';
import styles from './Color.module.css';

export interface ColorPickerProps {
  /** Controlled color (hex, rgb(a), hsl(a)). */
  value?: string;
  /** @default "#000000" */
  defaultValue?: string;
  /** Called with a lower-case `#rrggbb` (or `transparent` when a transparent swatch is picked). */
  onChange?: (hex: string) => void;
  /** Quick-pick swatches under the fields, e.g. the current palette. */
  swatches?: SwatchGridColor[];
  /** Label of the hex field. @default "Hex" */
  hexLabel?: string;
  /** Label of the swatch grid. @default "Swatches" */
  swatchesLabel?: string;
  className?: string;
}

/**
 * Standalone color editor on RAC `ColorPicker`: saturation/brightness `ColorArea`, hue
 * `ColorSlider`, hex `ColorField` and optional swatches, all kept in sync. Embedded by the Palette
 * editor dialog and by `ColorPickerPopover`.
 */
export function ColorPicker({
  value,
  defaultValue = '#000000',
  onChange,
  swatches,
  hexLabel = 'Hex',
  swatchesLabel = 'Swatches',
  className,
}: ColorPickerProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = normalizeColor(value ?? uncontrolled);
  // The text being typed, while it is not yet a complete hex color; RAC itself drops non-hex keys.
  const [draft, setDraft] = useState<string | null>(null);

  const emit = (hex: string) => {
    if (value === undefined) setUncontrolled(hex);
    onChange?.(hex);
  };

  return (
    <div className={cx(styles.picker, className)}>
      <RACColorPicker value={current} onChange={(color: Color) => emit(toHex(color))}>
        <ColorArea className={styles.area} colorSpace="hsb" xChannel="saturation" yChannel="brightness">
          <ColorThumb className={styles.thumb} />
        </ColorArea>
        <ColorSlider className={styles.slider} colorSpace="hsb" channel="hue">
          <SliderTrack className={styles.sliderTrack}>
            <ColorThumb className={cx(styles.thumb, styles.sliderThumb)} />
          </SliderTrack>
        </ColorSlider>
        <ColorField
          className={styles.field}
          isInvalid={draft !== null && draft !== '' && !isCompleteHex(draft)}
          onBlur={() => setDraft(null)}
        >
          <Label className={styles.fieldLabel}>{hexLabel}</Label>
          <Input className={styles.fieldInput} onChange={(event) => setDraft(event.target.value)} />
          <FieldError className={styles.fieldError}>Enter a 3- or 6-digit hex color</FieldError>
        </ColorField>
      </RACColorPicker>
      {swatches && swatches.length > 0 && (
        <SwatchGrid
          colors={swatches}
          value={value ?? uncontrolled}
          onChange={(color) => emit(color)}
          swatchSize={24}
          columns={Math.min(8, swatches.length)}
          aria-label={swatchesLabel}
        />
      )}
    </div>
  );
}

export interface ColorPickerPopoverProps extends ColorPickerProps {
  /** The pressable that opens the popover, usually a `ColorSwatchButton`. */
  trigger: ReactElement;
  /** Names the popover dialog. @default "Color" */
  label?: string;
  /** @default "bottom" */
  placement?: PopoverPlacement;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /** Rendered above the picker, e.g. a title or a "Clear" action. */
  header?: ReactNode;
}

/** A `ColorPicker` in a `Popover` anchored to `trigger`. */
export function ColorPickerPopover({
  trigger,
  label = 'Color',
  placement = 'bottom',
  isOpen,
  defaultOpen,
  onOpenChange,
  header,
  ...pickerProps
}: ColorPickerPopoverProps) {
  return (
    <Popover
      trigger={trigger}
      aria-label={label}
      placement={placement}
      isOpen={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      {header}
      <ColorPicker {...pickerProps} />
    </Popover>
  );
}
