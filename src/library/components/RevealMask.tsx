import type { CSSProperties, ReactNode } from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

/**
 * Reveal mask type.
 */
export type RevealType = 
  | "circle" 
  | "wipe" 
  | "diagonal" 
  | "iris" 
  | "diamond"
  | "custom";

/**
 * Direction for wipe reveals.
 */
export type RevealDirection = "left" | "right" | "up" | "down";

/**
 * Props for the `RevealMask` component.
 */
export type RevealMaskProps = {
  /** Content to reveal. */
  children: ReactNode;
  /** Type of reveal animation. */
  type?: RevealType;
  /** Origin point for circle/iris reveals (0-1 normalized). */
  origin?: { x: number; y: number };
  /** Direction for wipe reveals. */
  direction?: RevealDirection;
  /** Frame at which reveal starts. */
  startFrame?: number;
  /** Duration of the reveal in frames. */
  durationInFrames?: number;
  /** Easing function. */
  easing?: (t: number) => number;
  /** Invert the mask (hide instead of reveal). */
  invert?: boolean;
  /** Custom clip-path function receiving progress (0-1). */
  customPath?: (progress: number) => string;
  /** Optional className. */
  className?: string;
  /** Additional styles. */
  style?: CSSProperties;
};

/**
 * Generates clip-path string based on reveal type and progress.
 */
function getClipPath(
  type: RevealType,
  progress: number,
  origin: { x: number; y: number },
  direction: RevealDirection,
  invert: boolean,
  customPath?: (progress: number) => string
): string {
  const p = invert ? 1 - progress : progress;

  switch (type) {
    case "circle": {
      // Circle reveal from origin, expanding to cover full frame
      // Max radius needs to reach corners: ~150% of diagonal
      const maxRadius = 150;
      const radius = p * maxRadius;
      return `circle(${radius}% at ${origin.x * 100}% ${origin.y * 100}%)`;
    }

    case "wipe": {
      // Linear wipe in specified direction
      switch (direction) {
        case "left":
          return `inset(0 ${(1 - p) * 100}% 0 0)`;
        case "right":
          return `inset(0 0 0 ${(1 - p) * 100}%)`;
        case "up":
          return `inset(0 0 ${(1 - p) * 100}% 0)`;
        case "down":
          return `inset(${(1 - p) * 100}% 0 0 0)`;
      }
      break;
    }

    case "diagonal": {
      // Diagonal wipe from top-left to bottom-right
      // Creates a diagonal line that sweeps across the frame
      const size = p * 200; // 0 to 200 to ensure full coverage
      return `polygon(0% 0%, ${size}% 0%, 0% ${size}%)`;
    }

    case "iris": {
      // Iris/aperture style reveal (circle with soft edge simulation)
      const maxRadius = 150;
      const radius = p * maxRadius;
      return `circle(${radius}% at ${origin.x * 100}% ${origin.y * 100}%)`;
    }

    case "diamond": {
      // Diamond/rhombus shape reveal
      const size = p * 150;
      const cx = origin.x * 100;
      const cy = origin.y * 100;
      return `polygon(${cx}% ${cy - size}%, ${cx + size}% ${cy}%, ${cx}% ${cy + size}%, ${cx - size}% ${cy}%)`;
    }

    case "custom": {
      if (customPath) {
        return customPath(p);
      }
      return "none";
    }

    default:
      return "none";
  }
  
  return "none";
}

/**
 * `RevealMask` reveals content through an animated clip-path.
 * The most fundamental transition in motion design — circle reveals,
 * wipe reveals, diagonal reveals are in every professional video.
 *
 * By default, uses `position: "relative"` so it stays in document flow
 * and sizes to its content. For full-screen overlays, pass absolute
 * positioning via the `style` prop.
 *
 * @example
 * ```tsx
 * // Circle reveal from center (stays in flow)
 * <RevealMask type="circle" durationInFrames={30}>
 *   <Content />
 * </RevealMask>
 *
 * // Works correctly in flex/grid layouts
 * <div style={{ display: "flex", gap: 20 }}>
 *   <RevealMask type="circle">
 *     <Card />
 *   </RevealMask>
 *   <Card />
 * </div>
 *
 * // Full-screen overlay (opt-in)
 * <RevealMask type="circle" style={{ position: "absolute", inset: 0 }}>
 *   <FullScreenContent />
 * </RevealMask>
 *
 * // Wipe from left
 * <RevealMask type="wipe" direction="left" durationInFrames={20}>
 *   <Content />
 * </RevealMask>
 *
 * // Circle reveal from top-left corner
 * <RevealMask type="circle" origin={{ x: 0, y: 0 }} durationInFrames={45}>
 *   <Content />
 * </RevealMask>
 *
 * // Inverted (hide instead of reveal)
 * <RevealMask type="circle" invert startFrame={60} durationInFrames={30}>
 *   <Content />
 * </RevealMask>
 *
 * // Custom clip-path
 * <RevealMask
 *   type="custom"
 *   customPath={(p) => `inset(${(1-p) * 50}% round ${p * 20}px)`}
 * >
 *   <Content />
 * </RevealMask>
 * ```
 */
export const RevealMask = ({
  children,
  type = "circle",
  origin = { x: 0.5, y: 0.5 },
  direction = "left",
  startFrame = 0,
  durationInFrames = 30,
  easing = Easing.out(Easing.cubic),
  invert = false,
  customPath,
  className,
  style,
}: RevealMaskProps) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const easedProgress = easing(progress);
  const clipPath = getClipPath(type, easedProgress, origin, direction, invert, customPath);

  const maskStyle: CSSProperties = {
    position: "relative",
    clipPath,
    WebkitClipPath: clipPath,
    ...style,
  };

  return (
    <div className={className} style={maskStyle}>
      {children}
    </div>
  );
};
