import type { CSSProperties, ReactNode } from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { useMemo } from "react";

/**
 * Liquid warp style.
 */
export type LiquidStyle = "wave" | "ripple" | "turbulence" | "melt";

/**
 * Props for the `LiquidWarp` component.
 */
export type LiquidWarpProps = {
  /** Content to apply liquid effect to. */
  children: ReactNode;
  /** Frame at which effect starts. */
  startFrame?: number;
  /** Duration of the effect in frames. */
  durationInFrames?: number;
  /** Easing function. */
  easing?: (t: number) => number;
  /** Style of liquid effect. */
  liquidStyle?: LiquidStyle;
  /** Intensity of the effect (0-1). */
  intensity?: number;
  /** Speed of the animation. */
  speed?: number;
  /** Whether this is a reveal (in) or hide (out). */
  mode?: "in" | "out";
  /** Optional className. */
  className?: string;
  /** Additional styles. */
  style?: CSSProperties;
};

/**
 * `LiquidWarp` creates organic liquid distortion effects.
 * Uses SVG filters for realistic displacement.
 *
 * @example
 * ```tsx
 * // Wave distortion reveal
 * <LiquidWarp liquidStyle="wave" mode="in">
 *   <Content />
 * </LiquidWarp>
 *
 * // Ripple effect
 * <LiquidWarp liquidStyle="ripple" intensity={0.8}>
 *   <Content />
 * </LiquidWarp>
 *
 * // Melt away
 * <LiquidWarp liquidStyle="melt" mode="out">
 *   <Content />
 * </LiquidWarp>
 * ```
 */
export const LiquidWarp = ({
  children,
  startFrame = 0,
  durationInFrames = 30,
  easing = Easing.out(Easing.cubic),
  liquidStyle = "wave",
  intensity = 0.5,
  speed = 1,
  mode = "in",
  className,
  style,
}: LiquidWarpProps) => {
  const frame = useCurrentFrame();
  
  // Generate unique filter ID
  const filterId = useMemo(() => `liquid-${Math.random().toString(36).substr(2, 9)}`, []);

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const easedProgress = easing(progress);
  const effectProgress = mode === "in" ? 1 - easedProgress : easedProgress;
  
  // Scale for turbulence animation
  const animatedScale = ((frame - startFrame) * speed * 0.01) % 1;
  
  // Displacement scale based on effect progress
  const displacementScale = effectProgress * intensity * 50;

  const getFilterParams = () => {
    switch (liquidStyle) {
      case "wave":
        return {
          baseFrequency: `0.01 0.05`,
          numOctaves: 2,
          seed: Math.floor(animatedScale * 100),
        };
      case "ripple":
        return {
          baseFrequency: `0.02 0.02`,
          numOctaves: 3,
          seed: Math.floor(animatedScale * 50),
        };
      case "turbulence":
        return {
          baseFrequency: `0.03 0.03`,
          numOctaves: 4,
          seed: Math.floor(animatedScale * 100),
        };
      case "melt":
        return {
          baseFrequency: `0.005 0.02`,
          numOctaves: 2,
          seed: Math.floor(animatedScale * 30),
        };
      default:
        return {
          baseFrequency: `0.01 0.01`,
          numOctaves: 2,
          seed: 0,
        };
    }
  };

  const filterParams = getFilterParams();
  const opacity = mode === "in" ? easedProgress : 1 - easedProgress;

  // Melt has additional vertical displacement
  const meltOffset = liquidStyle === "melt" ? effectProgress * 30 : 0;

  const containerStyle: CSSProperties = {
    position: "relative",
    ...style,
  };

  const contentStyle: CSSProperties = {
    filter: effectProgress > 0.01 ? `url(#${filterId})` : undefined,
    opacity,
    transform: `translateY(${meltOffset}px)`,
  };

  return (
    <div className={className} style={containerStyle}>
      {/* SVG Filter Definition */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="turbulence"
              baseFrequency={filterParams.baseFrequency}
              numOctaves={filterParams.numOctaves}
              seed={filterParams.seed}
              result="turbulence"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale={displacementScale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div style={contentStyle}>
        {children}
      </div>
    </div>
  );
};
