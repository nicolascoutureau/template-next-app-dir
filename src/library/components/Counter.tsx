import type { CSSProperties } from "react";
import { useMemo } from "react";
import { useFrameProgress } from "../hooks/useFrameProgress";

/**
 * Props for the `Counter` component.
 */
export type CounterProps = {
  /** Starting value. */
  from?: number;
  /** Ending value. */
  to?: number;
  /** Frame where the counter starts ticking. */
  startFrame?: number;
  /** Length of the count animation in frames. */
  durationInFrames?: number;
  /** Optional easing applied to the progress. */
  easing?: (t: number) => number;
  /** When true, clamps progress to 0..1. */
  clamp?: boolean;
  /** Number of decimal places to show (defaults to 0). */
  precision?: number;
  /** Minimum number of integer digits (pads with leading zeros). */
  padStart?: number;
  /** Locale passed to Intl.NumberFormat. */
  locale?: string | string[];
  /** Grouping separator (defaults to true). */
  useGrouping?: boolean;
  /** Prefix string rendered before the number. */
  prefix?: string;
  /** Suffix string rendered after the number. */
  suffix?: string;
  /**
   * Optional formatter that receives the raw numeric value. When provided, the
   * locale/precision settings are ignored and the formatter output is used.
   */
  format?: (value: number) => string;
  /** Optional className for the wrapper span. */
  className?: string;
  /** Optional inline styles for the wrapper span. */
  style?: CSSProperties;
};

/**
 * A ready-to-use animated counter for numbers. Use it for stats, metrics,
 * or dashboards inside Remotion compositions.
 */
export const Counter = ({
  from = 0,
  to = 100,
  startFrame = 0,
  durationInFrames = 30,
  easing,
  clamp = true,
  precision = 0,
  padStart,
  locale,
  useGrouping = true,
  prefix,
  suffix,
  format,
  className,
  style,
}: CounterProps) => {
  const progress = useFrameProgress({
    startFrame,
    durationInFrames,
    easing,
    clamp,
  });

  const value = from + (to - from) * progress;
  const safePrecision = Math.max(0, precision);

  // Calculate padStart from the largest absolute value if not provided
  const maxAbsValue = Math.max(Math.abs(from), Math.abs(to));
  const autoDigits = Math.floor(maxAbsValue).toString().length;
  const minIntegerDigits = padStart ?? autoDigits;

  const numberFormatter = useMemo(() => {
    if (format) return null;
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: safePrecision,
      maximumFractionDigits: safePrecision,
      minimumIntegerDigits: minIntegerDigits,
      useGrouping,
    });
  }, [format, locale, safePrecision, minIntegerDigits, useGrouping]);

  const formattedValue = format
    ? format(value)
    : numberFormatter?.format(value) ?? String(value);

  const output = `${prefix ?? ""}${formattedValue}${suffix ?? ""}`;

  // Use tabular-nums for consistent digit widths (prevents layout shift)
  const mergedStyle: CSSProperties = {
    fontVariantNumeric: "tabular-nums",
    ...style,
  };

  return (
    <span className={className} style={mergedStyle}>
      {output}
    </span>
  );
};
