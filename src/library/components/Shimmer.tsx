import type { CSSProperties, ReactNode } from "react";
import { useFrameProgress } from "../hooks/useFrameProgress";

/**
 * Shimmer mode determines how the effect is rendered.
 */
export type ShimmerMode = "overlay" | "text";

/**
 * Direction of the shimmer sweep.
 */
export type ShimmerDirection = "left" | "right" | "up" | "down" | "diagonal";

/**
 * Base props shared by all shimmer modes.
 */
interface ShimmerBaseProps {
  /** Content to apply the shimmer effect to. */
  children: ReactNode;
  /** Frame at which the shimmer animation begins. */
  startFrame?: number;
  /** Duration of a single shimmer pass in frames. */
  durationInFrames?: number;
  /** Number of times the shimmer repeats (0 = infinite loop). */
  repeat?: number;
  /** Direction of the shimmer sweep. Defaults to "right". */
  direction?: ShimmerDirection;
  /** Width of the shimmer highlight (in % for overlay, in % of text for text mode). */
  shimmerWidth?: number;
  /** Color of the shimmer highlight. */
  shimmerColor?: string;
  /** Optional className on the wrapper. */
  className?: string;
  /** Inline styles for the wrapper. */
  style?: CSSProperties;
}

/**
 * Props specific to overlay mode.
 */
interface ShimmerOverlayProps extends ShimmerBaseProps {
  /** Render shimmer as an overlay on children. */
  mode?: "overlay";
  /** Opacity of the shimmer highlight (0..1). Defaults to 0.3. */
  shimmerOpacity?: number;
  /** Border radius to clip the shimmer effect. */
  borderRadius?: number | string;
  /** Not used in overlay mode */
  baseColor?: never;
}

/**
 * Props specific to text mode (background-clip: text).
 */
interface ShimmerTextProps extends ShimmerBaseProps {
  /** Render shimmer directly on text using background-clip. */
  mode: "text";
  /** Base color of the text. Defaults to currentColor. */
  baseColor?: string;
  /** Not used in text mode */
  shimmerOpacity?: never;
  /** Not used in text mode */
  borderRadius?: never;
}

/**
 * Props for the `Shimmer` component.
 */
export type ShimmerProps = ShimmerOverlayProps | ShimmerTextProps;

/**
 * Converts direction to gradient angle.
 */
function getGradientAngle(direction: ShimmerDirection): number {
  switch (direction) {
    case "left": return 270;
    case "right": return 90;
    case "up": return 0;
    case "down": return 180;
    case "diagonal": return 120;
    default: return 90;
  }
}

/**
 * `Shimmer` creates a shimmering sweep effect on content.
 * 
 * Two modes:
 * - **overlay**: Renders a semi-transparent shimmer over children (default)
 * - **text**: Renders shimmer directly on text using background-clip
 *
 * @example
 * ```tsx
 * // Overlay mode (default) - shimmer passes over content
 * <Shimmer durationInFrames={45} shimmerColor="#ffffff" shimmerWidth={150}>
 *   <ProductImage />
 * </Shimmer>
 *
 * // Text mode - text color itself shimmers
 * <Shimmer mode="text" baseColor="#666" shimmerColor="#fff" durationInFrames={45}>
 *   Premium Quality
 * </Shimmer>
 *
 * // With direction
 * <Shimmer direction="diagonal" durationInFrames={60}>
 *   <Card />
 * </Shimmer>
 * ```
 */
export const Shimmer = (props: ShimmerProps) => {
  const {
    children,
    startFrame = 0,
    durationInFrames = 40,
    repeat = 1,
    direction = "right",
    shimmerWidth = props.mode === "text" ? 20 : 100,
    shimmerColor = "#ffffff",
    className,
    style,
  } = props;

  const mode = props.mode ?? "overlay";

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

  const angle = getGradientAngle(direction);

  if (mode === "text") {
    const textProps = props as ShimmerTextProps;
    const baseColor = textProps.baseColor ?? "currentColor";
    
    // Calculate gradient position (-100% to 200% for full sweep)
    const position = -100 + cycleProgress * 300;

    const gradientStyle: CSSProperties = {
      ...style,
      backgroundImage: `linear-gradient(
        ${angle}deg,
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
  }

  // Overlay mode
  const overlayProps = props as ShimmerOverlayProps;
  const shimmerOpacity = overlayProps.shimmerOpacity ?? 0.3;
  const borderRadius = overlayProps.borderRadius ?? 0;

  // Calculate shimmer position (-150% to 250% to ensure full coverage)
  const shimmerPosition = -150 + cycleProgress * 400;

  // Build the shimmer gradient
  const shimmerGradient = `linear-gradient(
    ${angle}deg,
    transparent ${shimmerPosition - shimmerWidth / 2}%,
    ${shimmerColor}${Math.round(shimmerOpacity * 255).toString(16).padStart(2, "0")} ${shimmerPosition}%,
    transparent ${shimmerPosition + shimmerWidth / 2}%
  )`;

  const wrapperStyle: CSSProperties = {
    ...style,
    position: "relative",
    display: "inline-block",
    overflow: "hidden",
    borderRadius,
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
