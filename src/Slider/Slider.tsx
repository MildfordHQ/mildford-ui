import { forwardRef, useCallback, useMemo, type ReactNode } from 'react';
import {
  Label,
  Slider as RACSlider,
  SliderFill,
  SliderOutput,
  SliderThumb,
  SliderTrack,
  type SliderRenderProps,
} from 'react-aria-components';
import { cx } from '../internal/cx';
import styles from './Slider.module.css';

export type SliderScale = 'linear' | 'log';

export interface SliderProps {
  /** Visible label. Without it pass `aria-label` or `aria-labelledby`. */
  label?: ReactNode;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  id?: string;
  /**
   * Formats a value (in your units) for the visible output and for `aria-valuetext`,
   * e.g. `(v) => \`${Math.round(v * 100)}%\`` announces "128%" for a zoom of 1.28.
   */
  formatValue?: (value: number) => string;
  /**
   * `log` maps the track logarithmically between `minValue` and `maxValue` (both must be > 0), so
   * 0.1–10 puts 1 at the midpoint. All values and callbacks stay in your units. @default "linear"
   */
  scale?: SliderScale;
  /** @default 0 (linear), 0.1 (log) */
  minValue?: number;
  /** @default 100 (linear), 10 (log) */
  maxValue?: number;
  /** Linear scale only; a log slider moves in 1% steps of the track. @default 1 */
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  /** Called when the user stops dragging or after a keyboard change. */
  onChangeEnd?: (value: number) => void;
  isDisabled?: boolean;
  /** Shows the formatted value next to the label. @default false */
  showOutput?: boolean;
  /** The slider fills its container; size it through this class (e.g. `width: 120px` in the zoom pill). */
  className?: string;
}

/** Internal track resolution for `scale="log"`. */
const LOG_POSITIONS = 1000;
/** Keyboard/drag granularity on the internal log track: 100 stops. */
const LOG_STEP = 10;

function logMapping(min: number, max: number) {
  const ratio = Math.log(max / min);
  return {
    toPosition: (value: number) => {
      if (value <= min) return 0;
      if (value >= max) return LOG_POSITIONS;
      return Math.round((Math.log(value / min) / ratio) * LOG_POSITIONS);
    },
    toValue: (position: number) => {
      if (position <= 0) return min;
      if (position >= LOG_POSITIONS) return max;
      return min * Math.exp((position / LOG_POSITIONS) * ratio);
    },
  };
}

const defaultFormat = (value: number) => String(Math.round(value * 100) / 100);

/**
 * M3 slider on RAC `Slider`: 4px track, 16px `primary` thumb, active track
 * `primary`. `formatValue` drives both the output text and `aria-valuetext`; `scale="log"` runs the
 * RAC slider on an internal 0..1000 position and maps it to your units.
 */
export const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
  {
    label,
    formatValue = defaultFormat,
    scale = 'linear',
    minValue,
    maxValue,
    step = 1,
    value,
    defaultValue,
    onChange,
    onChangeEnd,
    showOutput = false,
    className,
    ...props
  },
  ref,
) {
  const isLog = scale === 'log';
  const min = minValue ?? (isLog ? 0.1 : 0);
  const max = maxValue ?? (isLog ? 10 : 100);

  const mapping = useMemo(
    () => (isLog ? logMapping(min, max) : { toPosition: (v: number) => v, toValue: (p: number) => p }),
    [isLog, min, max],
  );

  /**
   * Consumer value for an internal position. A controlled value wins when RAC snapped it to this
   * position, so a zoom of 1.28 set by a button still reads "128%" although the track has 100 stops.
   */
  const valueAt = useCallback(
    (position: number) => {
      if (value === undefined) return mapping.toValue(position);
      const snapStep = isLog ? LOG_STEP : step;
      const snapped = Math.round(mapping.toPosition(value) / snapStep) * snapStep;
      return Math.abs(snapped - position) < snapStep / 2 ? value : mapping.toValue(position);
    },
    [mapping, value, isLog, step],
  );

  const handleChange = onChange && ((position: number) => onChange(mapping.toValue(position)));
  const handleChangeEnd = onChangeEnd && ((position: number) => onChangeEnd(mapping.toValue(position)));

  return (
    <RACSlider<number>
      {...props}
      ref={ref}
      minValue={isLog ? 0 : min}
      maxValue={isLog ? LOG_POSITIONS : max}
      step={isLog ? LOG_STEP : step}
      value={value === undefined ? undefined : mapping.toPosition(value)}
      defaultValue={defaultValue === undefined ? undefined : mapping.toPosition(defaultValue)}
      onChange={handleChange}
      onChangeEnd={handleChangeEnd}
      className={cx(styles.slider, className)}
    >
      {({ state }) => {
        applyFormat(state, (position) => formatValue(valueAt(position)));
        return (
          <>
            {(label != null || showOutput) && (
              <div className={styles.header}>
                {label != null && <Label className={styles.label}>{label}</Label>}
                {showOutput && <SliderOutput className={styles.output} />}
              </div>
            )}
            <SliderTrack className={styles.track}>
              <SliderFill className={styles.fill} />
              <SliderThumb className={styles.thumb} />
            </SliderTrack>
          </>
        );
      }}
    </RACSlider>
  );
});

type SliderState = SliderRenderProps['state'];

/**
 * RAC derives `aria-valuetext` and the output text from `state.getThumbValueLabel` /
 * `getFormattedValue`, which only honour `Intl.NumberFormatOptions`, and it has no hook for a
 * custom label. The state object cannot be copied (react-aria keys its internal slider data by
 * state identity), but `useSliderState` returns a fresh object on every render, so swapping those
 * two readers on it from the render-props callback (before any part renders) is idempotent and
 * lets `formatValue` and the log mapping drive what users see and hear while RAC keeps all behaviour.
 */
function applyFormat(state: SliderState, format: (position: number) => string): void {
  state.getThumbValueLabel = (index: number) => format(state.getThumbValue(index));
  state.getFormattedValue = (position?: number | number[]) => {
    const positions = position === undefined ? state.values : Array.isArray(position) ? position : [position];
    return positions.map(format).join(' – ');
  };
}
