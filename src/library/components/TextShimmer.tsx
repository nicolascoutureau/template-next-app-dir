import type { CSSProperties, ReactNode } from "react";
import { useFrameProgress } from "../hooks/useFrameProgress";

/**
 * Props for the `TextShimmer` component.
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
 * @example
 * ```tsx
 * <TextShimmer
 *   durationInFrames={45}
 *   baseColor="#666"
 *   shimmerColor="#fff"
 * >
 *   Shimmering Text
 * </TextShimmer>
 * ```
 */
export const TextShimmer = ({
  children,
  startFrame = 0,
  durationInFrames = 40,
  repeat = 1,
  baseColor = "currentColor",
  shimmerColor = "#ffffff",
  shimmerWidth = 20,
  className,
  style,
}: TextShimmerProps) => {
  const totalDuration = repeat === 0 ? durationInFrames : durationInFrames * repeat;

  const progress = useFrameProgress({
    startFrame,
    durationInFrames: totalDuration,
    clamp: repeat !== 0,
  });

  const cycleProgress =
    repeat === 0 ? progress % 1 : repeat === 1 ? progress : (progress * repeat) % 1;

  // Calculate gradient position (-100% to 200% for full sweep)
  const position = -100 + cycleProgress * 300;

  const gradientStyle: CSSProperties = {
    ...style,
    backgroundImage: `linear-gradient(
      90deg,
      ${baseColor} ${position}%,
      ${shimmerColor} ${position + shimmerWidth / 2}%,
      ${baseColor} ${position + shimmerWidth}%
    )`,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    display: "inline-block",
  };

  return (
    <span className={className} style={gradientStyle}>
      {children}
    </span>
  );
};
