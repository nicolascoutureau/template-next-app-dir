import type { CSSProperties } from "react";
import { useMemo } from "react";
import { useFrameProgress } from "../hooks/useFrameProgress";

/**
 * Gradient type preset.
 */
export type GradientType = "linear" | "radial" | "conic" | "mesh";

/**
 * A single color stop in the gradient.
 */
export type GradientStop = {
  /** Color value (hex, rgb, hsl, etc.). */
  color: string;
  /** Position of the stop (0-100). */
  position?: number;
};

/**
 * Mesh gradient point for "mesh" type.
 */
export type MeshPoint = {
  /** X position (0-100). */
  x: number;
  /** Y position (0-100). */
  y: number;
  /** Color at this point. */
  color: string;
  /** Blur radius of the color (in %). Defaults to 30. */
  blur?: number;
};

/**
 * Props for the `GradientBackground` component.
 */
export type GradientBackgroundProps = {
  /** Gradient type. Defaults to "linear". */
  type?: GradientType;
  /** Color stops for linear/radial/conic gradients. */
  colors?: GradientStop[] | string[];
  /** Mesh points for "mesh" type gradient. */
  meshPoints?: MeshPoint[];
  /** Angle for linear gradient (degrees). Defaults to 180. */
  angle?: number;
  /** Center position for radial/conic (0-100). Defaults to [50, 50]. */
  center?: [number, number];
  /** Whether to animate the gradient. */
  animate?: boolean;
  /** Animation type. */
  animationType?: "rotate" | "shift" | "breathe" | "aurora";
  /** Frame at which animation begins. */
  startFrame?: number;
  /** Duration of one animation cycle in frames. */
  durationInFrames?: number;
  /** Animation speed multiplier. */
  speed?: number;
  /** Whether the animation loops. */
  loop?: boolean;
  /** Width in pixels. Defaults to "100%". */
  width?: number | string;
  /** Height in pixels. Defaults to "100%". */
  height?: number | string;
  /** Optional className. */
  className?: string;
  /** Additional styles. */
  style?: CSSProperties;
};

/**
 * Converts color array to GradientStop array.
 */
function normalizeColors(colors: GradientStop[] | string[]): GradientStop[] {
  return colors.map((c, i, arr) => {
    if (typeof c === "string") {
      return { color: c, position: (i / (arr.length - 1)) * 100 };
    }
    return { ...c, position: c.position ?? (i / (arr.length - 1)) * 100 };
  });
}

/**
 * `GradientBackground` creates animated gradient backgrounds for video compositions.
 * Supports linear, radial, conic, and mesh gradient types with various animation modes.
 *
 * @example
 * ```tsx
 * // Simple linear gradient
 * <GradientBackground
 *   colors={["#667eea", "#764ba2"]}
 *   angle={135}
 * />
 *
 * // Animated aurora effect
 * <GradientBackground
 *   type="mesh"
 *   meshPoints={[
 *     { x: 0, y: 0, color: "#667eea", blur: 40 },
 *     { x: 100, y: 0, color: "#764ba2", blur: 40 },
 *     { x: 50, y: 100, color: "#f093fb", blur: 40 },
 *   ]}
 *   animate
 *   animationType="aurora"
 *   durationInFrames={120}
 * />
 *
 * // Rotating conic gradient
 * <GradientBackground
 *   type="conic"
 *   colors={["#ff0080", "#7928ca", "#ff0080"]}
 *   animate
 *   animationType="rotate"
 * />
 * ```
 */
export const GradientBackground = ({
  type = "linear",
  colors = ["#667eea", "#764ba2"],
  meshPoints,
  angle = 180,
  center = [50, 50],
  animate = false,
  animationType = "rotate",
  startFrame = 0,
  durationInFrames = 60,
  speed = 1,
  loop = true,
  width = "100%",
  height = "100%",
  className,
  style,
}: GradientBackgroundProps) => {
  const progress = useFrameProgress({
    startFrame,
    durationInFrames: durationInFrames / speed,
    clamp: !loop,
  });

  const cycleProgress = loop ? progress % 1 : progress;

  const normalizedColors = useMemo(
    () => normalizeColors(colors),
    [colors]
  );

  // Calculate animated values
  let animatedAngle = angle;
  let animatedCenter = center;
  let colorShift = 0;

  if (animate) {
    switch (animationType) {
      case "rotate":
        animatedAngle = angle + cycleProgress * 360;
        break;
      case "shift":
        colorShift = cycleProgress * 100;
        break;
      case "breathe":
        // Subtle pulsing effect on center position
        const breathe = Math.sin(cycleProgress * Math.PI * 2) * 10;
        animatedCenter = [center[0] + breathe, center[1] + breathe];
        break;
      case "aurora":
        // Complex movement for mesh points (handled below)
        break;
    }
  }

  // Build the gradient CSS
  const buildGradient = (): string => {
    const shiftedColors = normalizedColors.map((stop) => ({
      ...stop,
      position: ((stop.position ?? 0) + colorShift) % 100,
    }));

    const colorString = shiftedColors
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(", ");

    switch (type) {
      case "linear":
        return `linear-gradient(${animatedAngle}deg, ${colorString})`;
      case "radial":
        return `radial-gradient(circle at ${animatedCenter[0]}% ${animatedCenter[1]}%, ${colorString})`;
      case "conic":
        return `conic-gradient(from ${animatedAngle}deg at ${animatedCenter[0]}% ${animatedCenter[1]}%, ${colorString})`;
      case "mesh":
        // Mesh gradient uses stacked radial gradients
        return "transparent";
      default:
        return `linear-gradient(${animatedAngle}deg, ${colorString})`;
    }
  };

  // Mesh gradient rendering
  if (type === "mesh" && meshPoints && meshPoints.length > 0) {
    const animatedMeshPoints = meshPoints.map((point, i) => {
      if (!animate || animationType !== "aurora") return point;
      
      // Aurora animation: gentle floating motion
      const phase = i * (Math.PI / meshPoints.length);
      const xOffset = Math.sin(cycleProgress * Math.PI * 2 + phase) * 15;
      const yOffset = Math.cos(cycleProgress * Math.PI * 2 + phase * 1.5) * 10;
      
      return {
        ...point,
        x: Math.max(0, Math.min(100, point.x + xOffset)),
        y: Math.max(0, Math.min(100, point.y + yOffset)),
      };
    });

    const containerStyle: CSSProperties = {
      position: "relative",
      width,
      height,
      overflow: "hidden",
      ...style,
    };

    return (
      <div className={className} style={containerStyle}>
        {animatedMeshPoints.map((point, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${point.x}%`,
              top: `${point.y}%`,
              width: `${(point.blur ?? 30) * 3}%`,
              height: `${(point.blur ?? 30) * 3}%`,
              background: point.color,
              borderRadius: "50%",
              filter: `blur(${point.blur ?? 30}px)`,
              transform: "translate(-50%, -50%)",
              mixBlendMode: "normal",
            }}
          />
        ))}
      </div>
    );
  }

  const gradientStyle: CSSProperties = {
    width,
    height,
    background: buildGradient(),
    ...style,
  };

  return <div className={className} style={gradientStyle} />;
};
