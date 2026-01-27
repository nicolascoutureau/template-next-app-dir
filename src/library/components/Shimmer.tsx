import type { CSSProperties, ReactNode } from "react";
import { useFrameProgress } from "../hooks/useFrameProgress";

/**
 * Props for the `Shimmer` component.
 */
export type ShimmerProps = {
  /** Content to apply the shimmer effect to. */
  children: ReactNode;
  /** Frame at which the shimmer animation begins. */
  startFrame?: number;
  /** Duration of a single shimmer pass in frames. */
  durationInFrames?: number;
  /** Number of times the shimmer repeats (0 = infinite loop). */
  repeat?: number;
  /** Angle of the shimmer gradient in degrees. Defaults to 120. */
  angle?: number;
  /** Width of the shimmer highlight in pixels. Defaults to 100. */
  shimmerWidth?: number;
  /** Color of the shimmer highlight. */
  shimmerColor?: string;
  /** Opacity of the shimmer highlight (0..1). Defaults to 0.3. */
  shimmerOpacity?: number;
  /** Optional className on the wrapper div. */
  className?: string;
  /** Inline styles for the wrapper div. */
  style?: CSSProperties;
};

/**
 * `Shimmer` adds a glossy shine/sweep effect that passes over content.
 * Perfect for highlighting products, cards, or buttons in promotional videos.
 *
 * @example
 * ```tsx
 * <Shimmer
 *   durationInFrames={45}
 *   shimmerColor="#ffffff"
 *   shimmerWidth={150}
 * >
 *   <ProductImage />
 * </Shimmer>
 * ```
 */
export const Shimmer = ({
  children,
  startFrame = 0,
  durationInFrames = 40,
  repeat = 1,
  angle = 120,
  shimmerWidth = 100,
  shimmerColor = "#ffffff",
  shimmerOpacity = 0.3,
  className,
  style,
}: ShimmerProps) => {
  // Calculate total duration based on repeats
  const totalDuration = repeat === 0 ? durationInFrames : durationInFrames * repeat;
  
  const progress = useFrameProgress({
    startFrame,
    durationInFrames: totalDuration,
    clamp: repeat !== 0,
  });

  // For infinite repeat, use modulo to create loop
  const cycleProgress = repeat === 0
    ? progress % 1
    : repeat === 1
      ? progress
      : (progress * repeat) % 1;

  // Calculate shimmer position (-150% to 250% to ensure full coverage)
  const shimmerPosition = -150 + cycleProgress * 400;

  // Convert angle to gradient direction
  const gradientAngle = angle;

  // Build the shimmer gradient
  const shimmerGradient = `linear-gradient(
    ${gradientAngle}deg,
    transparent ${shimmerPosition - shimmerWidth / 2}%,
    ${shimmerColor}${Math.round(shimmerOpacity * 255).toString(16).padStart(2, "0")} ${shimmerPosition}%,
    transparent ${shimmerPosition + shimmerWidth / 2}%
  )`;

  const wrapperStyle: CSSProperties = {
    ...style,
    position: "relative",
    display: "inline-block",
    overflow: "hidden",
  };

  const shimmerOverlayStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    background: shimmerGradient,
    pointerEvents: "none",
    zIndex: 1,
  };

  return (
    <div className={className} style={wrapperStyle}>
      {children}
      <div style={shimmerOverlayStyle} />
    </div>
  );
};
