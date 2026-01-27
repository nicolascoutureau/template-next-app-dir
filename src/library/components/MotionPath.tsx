import type { CSSProperties, ReactNode } from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

/**
 * Props for the `MotionPath` component.
 */
export type MotionPathProps = {
  /** Content to move along the path. */
  children: ReactNode;
  /** SVG path definition (d attribute). */
  path: string;
  /** Frame at which motion starts. */
  startFrame?: number;
  /** Duration of the motion in frames. */
  durationInFrames?: number;
  /** Easing function. */
  easing?: (t: number) => number;
  /** Whether to auto-rotate content to follow path tangent. */
  autoRotate?: boolean;
  /** Starting position on path (0-1). */
  offset?: number;
  /** Additional rotation offset in degrees. */
  rotationOffset?: number;
  /** Optional className. */
  className?: string;
  /** Additional styles. */
  style?: CSSProperties;
};

/**
 * Parses an SVG path and returns a function to get point at t (0-1).
 * Uses browser's SVGPathElement for accurate path interpolation.
 */
function createPathInterpolator(pathData: string) {
  // Create an off-screen SVG path element
  if (typeof document === "undefined") {
    // SSR fallback - return dummy function
    return {
      getPointAtProgress: () => ({ x: 0, y: 0 }),
      getAngleAtProgress: () => 0,
    };
  }

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathData);
  svg.appendChild(path);
  
  // Temporarily add to DOM to get measurements
  svg.style.position = "absolute";
  svg.style.visibility = "hidden";
  document.body.appendChild(svg);
  
  const totalLength = path.getTotalLength();
  
  const getPointAtProgress = (progress: number): { x: number; y: number } => {
    const length = progress * totalLength;
    const point = path.getPointAtLength(length);
    return { x: point.x, y: point.y };
  };

  const getAngleAtProgress = (progress: number): number => {
    const delta = 0.001;
    const p1 = getPointAtProgress(Math.max(0, progress - delta));
    const p2 = getPointAtProgress(Math.min(1, progress + delta));
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
  };

  // Clean up
  document.body.removeChild(svg);

  return { getPointAtProgress, getAngleAtProgress };
}

/**
 * `MotionPath` moves children along an SVG path definition.
 * Moving elements along curved paths (not just straight lines) is what
 * makes motion feel organic. AE has motion paths as a core feature.
 *
 * @example
 * ```tsx
 * // Simple curved motion
 * <MotionPath
 *   path="M 0,100 Q 150,0 300,100 T 600,100"
 *   durationInFrames={60}
 * >
 *   <Circle />
 * </MotionPath>
 *
 * // Auto-rotate to follow path
 * <MotionPath
 *   path="M 0,0 C 100,0 100,100 200,100"
 *   autoRotate
 *   durationInFrames={45}
 * >
 *   <Arrow />
 * </MotionPath>
 *
 * // Start from middle of path
 * <MotionPath path="M 0,0 L 500,500" offset={0.5}>
 *   <Dot />
 * </MotionPath>
 * ```
 */
export const MotionPath = ({
  children,
  path,
  startFrame = 0,
  durationInFrames = 30,
  easing = Easing.inOut(Easing.cubic),
  autoRotate = false,
  offset = 0,
  rotationOffset = 0,
  className,
  style,
}: MotionPathProps) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const easedProgress = easing(progress);
  const pathProgress = (easedProgress + offset) % 1;

  // Get path interpolator
  const { getPointAtProgress, getAngleAtProgress } = createPathInterpolator(path);
  
  const point = getPointAtProgress(pathProgress);
  const angle = autoRotate ? getAngleAtProgress(pathProgress) + rotationOffset : rotationOffset;

  const containerStyle: CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    transform: `translate(${point.x}px, ${point.y}px) rotate(${angle}deg)`,
    ...style,
  };

  // Inner wrapper centers the children at the path point
  const centerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: "translate(-50%, -50%)",
  };

  return (
    <div className={className} style={containerStyle}>
      <div style={centerStyle}>{children}</div>
    </div>
  );
};
