import type { CSSProperties } from "react";
import { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useFrameProgress } from "../hooks/useFrameProgress";

/**
 * Counter display mode.
 */
export type CounterMode = "default" | "rolling";

/**
 * Built-in easing presets for Counter.
 */
export type CounterEasing = "linear" | "easeOut" | "easeInOut" | "spring";

const easingFunctions: Record<CounterEasing, (t: number) => number> = {
  linear: (t) => t,
  easeOut: (t) => 1 - Math.pow(1 - t, 3),
  easeInOut: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  spring: (t) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};

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
  /** Easing applied to the progress. Can be a preset name or custom function. */
  easing?: CounterEasing | ((t: number) => number);
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
  /** 
   * Display mode. "rolling" creates slot-machine style rolling digits.
   * Note: rolling mode only works with integer values and ignores precision/format.
   */
  mode?: CounterMode;
  /** 
   * Height of each digit for rolling mode (in pixels or CSS unit).
   * Must match your font size for proper alignment.
   */
  digitHeight?: number | string;
  /**
   * Enable scale punch effect when counter completes.
   * The number will briefly scale up then back down.
   */
  scalePunch?: boolean;
  /** Scale punch intensity (1.0 = no effect, 1.1 = 10% overshoot). Defaults to 1.05. */
  scalePunchIntensity?: number;
  /** Duration of the scale punch in frames. Defaults to 10. */
  scalePunchDuration?: number;
  /** Optional className for the wrapper span. */
  className?: string;
  /** Optional inline styles for the wrapper span. */
  style?: CSSProperties;
};

/**
 * Single rolling digit component for slot-machine effect.
 */
const RollingDigit = ({
  targetDigit,
  progress,
  digitHeight,
  style,
}: {
  targetDigit: number;
  progress: number;
  digitHeight: number | string;
  style?: CSSProperties;
}) => {
  // Create digits 0-9 for rolling
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  // Calculate the offset based on progress and target digit
  // We want to roll through multiple cycles before landing on the target
  const cycles = 2; // Number of full rotations before settling
  const totalRotation = cycles + targetDigit / 10;
  const currentRotation = totalRotation * progress;
  const currentDigitPosition = (currentRotation * 10) % 10;
  
  const heightValue = typeof digitHeight === "number" ? digitHeight : parseInt(digitHeight, 10) || 40;
  const translateY = -currentDigitPosition * heightValue;

  const containerStyle: CSSProperties = {
    display: "inline-block",
    height: digitHeight,
    overflow: "hidden",
    position: "relative",
    ...style,
  };

  const stripStyle: CSSProperties = {
    transform: `translateY(${translateY}px)`,
    display: "flex",
    flexDirection: "column",
  };

  const digitStyle: CSSProperties = {
    height: digitHeight,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <span style={containerStyle}>
      <span style={stripStyle}>
        {digits.map((digit) => (
          <span key={digit} style={digitStyle}>
            {digit}
          </span>
        ))}
      </span>
    </span>
  );
};

/**
 * A ready-to-use animated counter for numbers. Use it for stats, metrics,
 * or dashboards inside Remotion compositions.
 *
 * @example
 * ```tsx
 * // Basic counter with easing
 * <Counter from={0} to={1000} easing="easeOut" durationInFrames={60} />
 *
 * // Rolling digits (slot machine style)
 * <Counter from={0} to={999} mode="rolling" digitHeight={48} />
 *
 * // With scale punch on completion
 * <Counter from={0} to={100} scalePunch scalePunchIntensity={1.1} />
 * ```
 */
export const Counter = ({
  from = 0,
  to = 100,
  startFrame = 0,
  durationInFrames = 30,
  easing = "easeOut",
  clamp = true,
  precision = 0,
  padStart,
  locale,
  useGrouping = true,
  prefix,
  suffix,
  format,
  mode = "default",
  digitHeight = 40,
  scalePunch = false,
  scalePunchIntensity = 1.05,
  scalePunchDuration = 10,
  className,
  style,
}: CounterProps) => {
  const frame = useCurrentFrame();
  
  // Resolve easing function
  const easingFn = typeof easing === "function" 
    ? easing 
    : easingFunctions[easing] ?? easingFunctions.easeOut;

  const progress = useFrameProgress({
    startFrame,
    durationInFrames,
    easing: easingFn,
    clamp,
  });

  const value = from + (to - from) * progress;
  const safePrecision = Math.max(0, precision);

  // Calculate padStart from the largest absolute value if not provided
  const maxAbsValue = Math.max(Math.abs(from), Math.abs(to));
  const autoDigits = Math.floor(maxAbsValue).toString().length;
  const minIntegerDigits = padStart ?? autoDigits;

  // Calculate scale punch
  const punchStartFrame = startFrame + durationInFrames;
  const punchScale = scalePunch
    ? interpolate(
        frame,
        [punchStartFrame, punchStartFrame + scalePunchDuration / 2, punchStartFrame + scalePunchDuration],
        [1, scalePunchIntensity, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 1;

  // Base styles
  const mergedStyle: CSSProperties = {
    fontVariantNumeric: "tabular-nums",
    display: "inline-flex",
    alignItems: "center",
    transform: punchScale !== 1 ? `scale(${punchScale})` : undefined,
    transformOrigin: "center",
    ...style,
  };

  // Rolling mode
  if (mode === "rolling") {
    const intValue = Math.round(to);
    const digits = intValue.toString().padStart(minIntegerDigits, "0").split("").map(Number);

    return (
      <span className={className} style={mergedStyle}>
        {prefix}
        {digits.map((digit, index) => (
          <RollingDigit
            key={index}
            targetDigit={digit}
            progress={progress}
            digitHeight={digitHeight}
          />
        ))}
        {suffix}
      </span>
    );
  }

  // Default mode
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

  return (
    <span className={className} style={mergedStyle}>
      {output}
    </span>
  );
};
