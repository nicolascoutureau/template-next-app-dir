import type { CSSProperties, ReactNode } from "react";
import { Shimmer } from "./Shimmer";

/**
 * Props for the `TextShimmer` component.
 * @deprecated Use `<Shimmer mode="text">` instead.
 */
export type TextShimmerProps = {
  /** Text content to apply the shimmer effect to. */
  children: ReactNode;
  /** Frame at which the shimmer animation begins. */
  startFrame?: number;
  /** Duration of a single shimmer pass in frames. */
  durationInFrames?: number;
  /** Number of times the shimmer repeats (0 = infinite loop). */
  repeat?: number;
  /** Base color of the text. Defaults to currentColor. */
  baseColor?: string;
  /** Highlight/shimmer color. Defaults to white. */
  shimmerColor?: string;
  /** Width of the shimmer highlight as a percentage. Defaults to 20. */
  shimmerWidth?: number;
  /** Optional className on the wrapper span. */
  className?: string;
  /** Inline styles for the wrapper span. */
  style?: CSSProperties;
};

/**
 * `TextShimmer` creates a shimmering text effect where the text color itself animates.
 * Uses background-clip: text for a true text gradient shimmer.
 *
 * @deprecated Use `<Shimmer mode="text">` instead for the unified API.
 *
 * @example
 * ```tsx
 * // Deprecated:
 * <TextShimmer baseColor="#666" shimmerColor="#fff">
 *   Shimmering Text
 * </TextShimmer>
 *
 * // Recommended:
 * <Shimmer mode="text" baseColor="#666" shimmerColor="#fff">
 *   Shimmering Text
 * </Shimmer>
 * ```
 */
export const TextShimmer = ({
  children,
  startFrame,
  durationInFrames,
  repeat,
  baseColor,
  shimmerColor,
  shimmerWidth,
  className,
  style,
}: TextShimmerProps) => {
  return (
    <Shimmer
      mode="text"
      startFrame={startFrame}
      durationInFrames={durationInFrames}
      repeat={repeat}
      baseColor={baseColor}
      shimmerColor={shimmerColor}
      shimmerWidth={shimmerWidth}
      className={className}
      style={style}
    >
      {children}
    </Shimmer>
  );
};
