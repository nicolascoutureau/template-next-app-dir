import type { CSSProperties, ReactNode } from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

/**
 * Advanced mask shapes.
 */
export type MaskShape = 
  | "blinds-horizontal"
  | "blinds-vertical"
  | "grid"
  | "spiral"
  | "star"
  | "hexagon"
  | "heart"
  | "angular"
  | "radial-bars"
  | "checkerboard";

/**
 * Props for the `MaskTransition` component.
 */
export type MaskTransitionProps = {
  /** Content to reveal/hide. */
  children: ReactNode;
  /** Shape of the mask. */
  shape?: MaskShape;
  /** Frame at which transition starts. */
  startFrame?: number;
  /** Duration of the transition in frames. */
  durationInFrames?: number;
  /** Easing function. */
  easing?: (t: number) => number;
  /** Whether this is a reveal or hide. */
  mode?: "in" | "out";
  /** Number of segments (for blinds, grid, etc). */
  segments?: number;
  /** Origin point (0-1 normalized). */
  origin?: { x: number; y: number };
  /** Stagger delay between segments (0-1). */
  stagger?: number;
  /** Optional className. */
  className?: string;
  /** Additional styles. */
  style?: CSSProperties;
};

/**
 * Generate clip-path for advanced mask shapes.
 */
function getMaskClipPath(
  shape: MaskShape,
  progress: number,
  segments: number,
  origin: { x: number; y: number },
  stagger: number,
): string {
  const p = progress;
  
  switch (shape) {
    case "blinds-horizontal": {
      const paths: string[] = [];
      for (let i = 0; i < segments; i++) {
        const segmentProgress = Math.min(1, Math.max(0, (p - i * stagger / segments) / (1 - stagger)));
        const y = (i / segments) * 100;
        const h = (1 / segments) * 100;
        if (segmentProgress > 0) {
          paths.push(`${0}% ${y}%, ${segmentProgress * 100}% ${y}%, ${segmentProgress * 100}% ${y + h}%, 0% ${y + h}%`);
        }
      }
      return paths.length > 0 ? `polygon(${paths.join(", ")})` : "polygon(0 0, 0 0)";
    }

    case "blinds-vertical": {
      const paths: string[] = [];
      for (let i = 0; i < segments; i++) {
        const segmentProgress = Math.min(1, Math.max(0, (p - i * stagger / segments) / (1 - stagger)));
        const x = (i / segments) * 100;
        const w = (1 / segments) * 100;
        if (segmentProgress > 0) {
          paths.push(`${x}% 0%, ${x + w}% 0%, ${x + w}% ${segmentProgress * 100}%, ${x}% ${segmentProgress * 100}%`);
        }
      }
      return paths.length > 0 ? `polygon(${paths.join(", ")})` : "polygon(0 0, 0 0)";
    }

    case "spiral": {
      const turns = 2;
      const maxRadius = 150;
      const points: string[] = [];
      const cx = origin.x * 100;
      const cy = origin.y * 100;
      
      for (let i = 0; i <= 60; i++) {
        const angle = (i / 60) * Math.PI * 2 * turns;
        const radius = (i / 60) * maxRadius * p;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        points.push(`${x}% ${y}%`);
      }
      // Close the spiral with center
      points.push(`${cx}% ${cy}%`);
      
      return `polygon(${points.join(", ")})`;
    }

    case "star": {
      const points: string[] = [];
      const cx = origin.x * 100;
      const cy = origin.y * 100;
      const outerRadius = p * 150;
      const innerRadius = outerRadius * 0.4;
      const numPoints = 5;
      
      for (let i = 0; i < numPoints * 2; i++) {
        const angle = (i * Math.PI) / numPoints - Math.PI / 2;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        points.push(`${x}% ${y}%`);
      }
      
      return `polygon(${points.join(", ")})`;
    }

    case "hexagon": {
      const cx = origin.x * 100;
      const cy = origin.y * 100;
      const radius = p * 150;
      const points: string[] = [];
      
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3 - Math.PI / 6;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        points.push(`${x}% ${y}%`);
      }
      
      return `polygon(${points.join(", ")})`;
    }

    case "heart": {
      const cx = origin.x * 100;
      const cy = origin.y * 100;
      const size = p * 150;
      
      // Simplified heart shape using polygon
      return `polygon(
        ${cx}% ${cy + size * 0.3}%,
        ${cx + size * 0.5}% ${cy - size * 0.2}%,
        ${cx + size * 0.5}% ${cy - size * 0.5}%,
        ${cx + size * 0.25}% ${cy - size * 0.6}%,
        ${cx}% ${cy - size * 0.35}%,
        ${cx - size * 0.25}% ${cy - size * 0.6}%,
        ${cx - size * 0.5}% ${cy - size * 0.5}%,
        ${cx - size * 0.5}% ${cy - size * 0.2}%
      )`;
    }

    case "angular": {
      const cx = origin.x * 100;
      const cy = origin.y * 100;
      const radius = 200;
      const sweepAngle = p * 360;
      const points: string[] = [`${cx}% ${cy}%`];
      
      for (let angle = -90; angle <= -90 + sweepAngle; angle += 5) {
        const rad = (angle * Math.PI) / 180;
        const x = cx + Math.cos(rad) * radius;
        const y = cy + Math.sin(rad) * radius;
        points.push(`${x}% ${y}%`);
      }
      
      return `polygon(${points.join(", ")})`;
    }

    case "radial-bars": {
      const cx = origin.x * 100;
      const cy = origin.y * 100;
      const numBars = segments;
      const points: string[] = [];
      const radius = 200;
      
      for (let i = 0; i < numBars; i++) {
        const barProgress = Math.min(1, Math.max(0, (p - i * stagger / numBars) / (1 - stagger)));
        const startAngle = (i / numBars) * Math.PI * 2 - Math.PI / 2;
        const endAngle = ((i + 0.8) / numBars) * Math.PI * 2 - Math.PI / 2;
        const barRadius = radius * barProgress;
        
        if (barProgress > 0) {
          points.push(`${cx}% ${cy}%`);
          points.push(`${cx + Math.cos(startAngle) * barRadius}% ${cy + Math.sin(startAngle) * barRadius}%`);
          points.push(`${cx + Math.cos(endAngle) * barRadius}% ${cy + Math.sin(endAngle) * barRadius}%`);
        }
      }
      
      return points.length > 0 ? `polygon(${points.join(", ")})` : "polygon(0 0, 0 0)";
    }

    case "grid": {
      // Grid is handled separately with multiple divs
      return "none";
    }

    case "checkerboard": {
      // Checkerboard is handled separately with multiple divs
      return "none";
    }

    default:
      return `inset(0 ${(1 - p) * 100}% 0 0)`;
  }
}

/**
 * `MaskTransition` provides advanced mask-based reveals.
 * Goes beyond basic shapes with creative patterns like blinds,
 * spirals, stars, and radial bars.
 *
 * @example
 * ```tsx
 * // Horizontal blinds reveal
 * <MaskTransition shape="blinds-horizontal" segments={8}>
 *   <Content />
 * </MaskTransition>
 *
 * // Star burst from center
 * <MaskTransition shape="star" origin={{ x: 0.5, y: 0.5 }}>
 *   <Content />
 * </MaskTransition>
 *
 * // Spiral reveal
 * <MaskTransition shape="spiral" durationInFrames={60}>
 *   <Content />
 * </MaskTransition>
 *
 * // Staggered vertical blinds
 * <MaskTransition shape="blinds-vertical" segments={12} stagger={0.5}>
 *   <Content />
 * </MaskTransition>
 * ```
 */
export const MaskTransition = ({
  children,
  shape = "blinds-horizontal",
  startFrame = 0,
  durationInFrames = 30,
  easing = Easing.out(Easing.cubic),
  mode = "in",
  segments = 6,
  origin = { x: 0.5, y: 0.5 },
  stagger = 0.3,
  className,
  style,
}: MaskTransitionProps) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const easedProgress = easing(progress);
  const effectProgress = mode === "in" ? easedProgress : 1 - easedProgress;

  // Handle grid and checkerboard separately
  if (shape === "grid" || shape === "checkerboard") {
    const gridSize = Math.ceil(Math.sqrt(segments));
    const cells: { x: number; y: number; delay: number }[] = [];
    
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const delay = shape === "checkerboard" 
          ? ((row + col) % 2) * 0.3 + (row + col) * 0.05
          : Math.sqrt(Math.pow(col - gridSize/2, 2) + Math.pow(row - gridSize/2, 2)) * 0.1;
        cells.push({ x: col, y: row, delay });
      }
    }

    const maxDelay = Math.max(...cells.map(c => c.delay));

    return (
      <div className={className} style={{ position: "relative", overflow: "hidden", ...style }}>
        <div style={{ visibility: "hidden" }}>{children}</div>
        {cells.map((cell, i) => {
          const cellProgress = Math.min(1, Math.max(0, (effectProgress - cell.delay * stagger / maxDelay) / (1 - stagger)));
          const cellSize = 100 / gridSize;
          
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${cell.x * cellSize}%`,
                top: `${cell.y * cellSize}%`,
                width: `${cellSize}%`,
                height: `${cellSize}%`,
                overflow: "hidden",
                transform: `scale(${cellProgress})`,
                opacity: cellProgress,
              }}
            >
              <div style={{
                position: "absolute",
                left: `-${cell.x * 100}%`,
                top: `-${cell.y * 100}%`,
                width: `${gridSize * 100}%`,
                height: `${gridSize * 100}%`,
              }}>
                {children}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  const clipPath = getMaskClipPath(shape, effectProgress, segments, origin, stagger);

  const maskStyle: CSSProperties = {
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
