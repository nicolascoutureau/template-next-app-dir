import type { CSSProperties, ReactNode } from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

/**
 * Light leak style presets.
 */
export type LightLeakStyle =
  | "warm"
  | "cool"
  | "rainbow"
  | "golden"
  | "film"
  | "neon"
  | "custom";

/**
 * Props for the `LightLeak` component.
 */
export type LightLeakProps = {
  /** Content to overlay light leak on. */
  children: ReactNode;
  /** Frame at which light leak starts. */
  startFrame?: number;
  /** Duration of the light leak in frames. */
  durationInFrames?: number;
  /** Easing function. */
  easing?: (t: number) => number;
  /** Style preset for the light leak. */
  leakStyle?: LightLeakStyle;
  /** Custom colors (used when style is "custom"). */
  colors?: string[];
  /** Angle of the light leak gradient (in degrees). */
  angle?: number;
  /** Maximum opacity of the light leak. */
  maxOpacity?: number;
  /** Position offset (0-1). */
  position?: { x: number; y: number };
  /** Blend mode for the overlay. */
  blendMode?: CSSProperties["mixBlendMode"];
  /** Whether to animate position. */
  animated?: boolean;
  /** Optional className. */
  className?: string;
  /** Additional styles. */
  style?: CSSProperties;
};

const getLeakColors = (
  leakStyle: LightLeakStyle,
  customColors?: string[],
): string[] => {
  switch (leakStyle) {
    case "warm":
      return ["#ff6b35", "#f7931e", "#ffcc00", "#ff6b35"];
    case "cool":
      return ["#00d4ff", "#7b68ee", "#9370db", "#00d4ff"];
    case "rainbow":
      return ["#ff0080", "#ff8c00", "#ffff00", "#00ff00", "#00ffff", "#8000ff"];
    case "golden":
      return ["#ffd700", "#ffb347", "#ff8c00", "#ffd700"];
    case "film":
      return ["#ff4500", "#ff6347", "#ffa07a", "#ffb6c1", "#ff4500"];
    case "neon":
      return ["#ff00ff", "#00ffff", "#ff00ff", "#ffff00", "#00ffff"];
    case "custom":
      return customColors || ["#ffffff"];
    default:
      return ["#ffffff"];
  }
};

/**
 * `LightLeak` creates cinematic light leak/flare effects.
 * Adds the organic, analog feel of light bleeding onto film.
 *
 * @example
 * ```tsx
 * // Warm film light leak
 * <LightLeak leakStyle="warm" durationInFrames={45}>
 *   <Content />
 * </LightLeak>
 *
 * // Rainbow flare with animation
 * <LightLeak leakStyle="rainbow" animated maxOpacity={0.6}>
 *   <Content />
 * </LightLeak>
 *
 * // Custom colors
 * <LightLeak leakStyle="custom" colors={["#ff0000", "#0000ff"]}>
 *   <Content />
 * </LightLeak>
 * ```
 */
export const LightLeak = ({
  children,
  startFrame = 0,
  durationInFrames = 45,
  easing = Easing.inOut(Easing.quad),
  leakStyle = "warm",
  colors,
  angle = 45,
  maxOpacity = 0.5,
  position = { x: 0.3, y: 0.3 },
  blendMode = "screen",
  animated = true,
  className,
  style,
}: LightLeakProps) => {
  const frame = useCurrentFrame();
  const leakColors = getLeakColors(leakStyle, colors);

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const easedProgress = easing(progress);

  // Intensity peaks in the middle
  const intensity = Math.sin(easedProgress * Math.PI);

  // Animated position offset
  const animOffset = animated
    ? {
        x: Math.sin(easedProgress * Math.PI * 2) * 0.2,
        y: Math.cos(easedProgress * Math.PI * 1.5) * 0.15,
      }
    : { x: 0, y: 0 };

  const posX = (position.x + animOffset.x) * 100;
  const posY = (position.y + animOffset.y) * 100;

  // Build gradient
  const gradientStops = leakColors
    .map((color, i) => {
      const pos = (i / (leakColors.length - 1)) * 100;
      return `${color} ${pos}%`;
    })
    .join(", ");

  const containerStyle: CSSProperties = {
    position: "relative",
    ...style,
  };

  const leakStyle1: CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    opacity: intensity * maxOpacity,
    mixBlendMode: blendMode,
    background: `
      radial-gradient(
        ellipse 80% 60% at ${posX}% ${posY}%,
        ${leakColors[0]}40,
        transparent 70%
      ),
      linear-gradient(
        ${angle}deg,
        ${gradientStops}
      )
    `,
    filter: `blur(${40 + intensity * 20}px)`,
  };

  // Secondary leak layer for more organic look
  const leakStyle2: CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    opacity: intensity * maxOpacity * 0.6,
    mixBlendMode: "overlay",
    background: `
      radial-gradient(
        ellipse 60% 80% at ${100 - posX}% ${100 - posY}%,
        ${leakColors[leakColors.length - 1]}30,
        transparent 60%
      )
    `,
    filter: `blur(${60 + intensity * 30}px)`,
  };

  return (
    <div className={className} style={containerStyle}>
      {children}
      {intensity > 0.01 && (
        <>
          <div style={leakStyle1} />
          <div style={leakStyle2} />
        </>
      )}
    </div>
  );
};
