import type { CSSProperties, ReactNode } from "react";
import { useCurrentFrame, interpolate, Easing, random } from "remotion";

/**
 * Glitch effect intensity.
 */
export type GlitchIntensity = "subtle" | "medium" | "intense" | "chaos";

/**
 * Props for the `GlitchTransition` component.
 */
export type GlitchTransitionProps = {
  /** Content to apply glitch effect to. */
  children: ReactNode;
  /** Frame at which glitch starts. */
  startFrame?: number;
  /** Duration of the glitch in frames. */
  durationInFrames?: number;
  /** Intensity of the glitch effect. */
  intensity?: GlitchIntensity;
  /** Whether to include RGB split/chromatic aberration. */
  rgbSplit?: boolean;
  /** Whether to include scan lines. */
  scanLines?: boolean;
  /** Whether to include horizontal slice displacement. */
  sliceDisplacement?: boolean;
  /** Whether this is a reveal (glitch in) or hide (glitch out). */
  mode?: "in" | "out";
  /** Seed for randomization (for reproducible results). */
  seed?: number;
  /** Optional className. */
  className?: string;
  /** Additional styles. */
  style?: CSSProperties;
};

const getIntensityValues = (intensity: GlitchIntensity) => {
  switch (intensity) {
    case "subtle":
      return { rgbOffset: 3, sliceCount: 3, displacement: 10, flickerRate: 0.1 };
    case "medium":
      return { rgbOffset: 8, sliceCount: 6, displacement: 30, flickerRate: 0.3 };
    case "intense":
      return { rgbOffset: 15, sliceCount: 10, displacement: 60, flickerRate: 0.5 };
    case "chaos":
      return { rgbOffset: 25, sliceCount: 15, displacement: 100, flickerRate: 0.7 };
  }
};

/**
 * `GlitchTransition` creates digital distortion effects.
 * Includes RGB split, scan lines, and slice displacement for
 * a authentic glitch aesthetic.
 *
 * @example
 * ```tsx
 * // Glitch in reveal
 * <GlitchTransition mode="in" durationInFrames={20}>
 *   <Content />
 * </GlitchTransition>
 *
 * // Intense glitch with all effects
 * <GlitchTransition intensity="intense" rgbSplit scanLines sliceDisplacement>
 *   <Content />
 * </GlitchTransition>
 *
 * // Subtle chromatic aberration only
 * <GlitchTransition intensity="subtle" rgbSplit>
 *   <Content />
 * </GlitchTransition>
 * ```
 */
export const GlitchTransition = ({
  children,
  startFrame = 0,
  durationInFrames = 20,
  intensity = "medium",
  rgbSplit = true,
  scanLines = true,
  sliceDisplacement = true,
  mode = "in",
  seed = 0,
  className,
  style,
}: GlitchTransitionProps) => {
  const frame = useCurrentFrame();
  const { rgbOffset, sliceCount, displacement, flickerRate } = getIntensityValues(intensity);

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Invert progress for "out" mode
  const effectProgress = mode === "in" ? 1 - progress : progress;
  
  // Eased intensity that peaks in the middle
  const glitchIntensity = effectProgress * Math.sin(effectProgress * Math.PI);

  // Random flicker based on frame
  const shouldFlicker = random(`flicker-${frame}-${seed}`) < flickerRate * glitchIntensity;
  
  // RGB offset calculations
  const rgbX = rgbSplit ? rgbOffset * glitchIntensity * (random(`rgb-x-${frame}-${seed}`) - 0.5) * 2 : 0;
  const rgbY = rgbSplit ? rgbOffset * glitchIntensity * (random(`rgb-y-${frame}-${seed}`) - 0.5) * 2 : 0;

  // Generate slices
  const slices = sliceDisplacement ? Array.from({ length: sliceCount }).map((_, i) => {
    const sliceRandom = random(`slice-${i}-${frame}-${seed}`);
    const isActive = sliceRandom < glitchIntensity * 0.5;
    const y = (i / sliceCount) * 100;
    const height = (1 / sliceCount) * 100 + random(`slice-h-${i}-${frame}-${seed}`) * 5;
    const offsetX = isActive ? (random(`slice-x-${i}-${frame}-${seed}`) - 0.5) * displacement * glitchIntensity : 0;
    
    return { y, height, offsetX, isActive };
  }) : [];

  // Base opacity with flicker
  const baseOpacity = mode === "in" ? progress : 1 - progress;
  const opacity = shouldFlicker ? baseOpacity * 0.3 : baseOpacity;

  const containerStyle: CSSProperties = {
    position: "relative",
    ...style,
  };

  const layerStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
  };

  return (
    <div className={className} style={containerStyle}>
      {/* Red channel */}
      {rgbSplit && glitchIntensity > 0.1 && (
        <div
          style={{
            ...layerStyle,
            transform: `translate(${rgbX}px, ${rgbY}px)`,
            opacity: opacity * 0.8,
            mixBlendMode: "screen",
            filter: "url(#redChannel)",
          }}
        >
          <div style={{ filter: "grayscale(100%) brightness(1.2)", color: "#ff0000" }}>
            <div style={{ 
              position: "relative",
              filter: "drop-shadow(0 0 0 #ff0000)",
              opacity: 0.7,
            }}>
              {children}
            </div>
          </div>
        </div>
      )}

      {/* Blue channel */}
      {rgbSplit && glitchIntensity > 0.1 && (
        <div
          style={{
            ...layerStyle,
            transform: `translate(${-rgbX}px, ${-rgbY}px)`,
            opacity: opacity * 0.8,
            mixBlendMode: "screen",
          }}
        >
          <div style={{ 
            position: "relative",
            filter: "hue-rotate(240deg) saturate(3)",
            opacity: 0.7,
          }}>
            {children}
          </div>
        </div>
      )}

      {/* Main content layer with slices */}
      <div style={{ ...layerStyle, opacity }}>
        {sliceDisplacement && slices.some(s => s.isActive) ? (
          <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
            {slices.map((slice, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: `${slice.y}%`,
                  height: `${slice.height}%`,
                  overflow: "hidden",
                  transform: `translateX(${slice.offsetX}px)`,
                }}
              >
                <div style={{ 
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: `-${slice.y}%`,
                  height: `${100 / slice.height * 100}%`,
                }}>
                  {children}
                </div>
              </div>
            ))}
          </div>
        ) : (
          children
        )}
      </div>

      {/* Scan lines overlay */}
      {scanLines && (
        <div
          style={{
            ...layerStyle,
            opacity: 0.15 * glitchIntensity,
            pointerEvents: "none",
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.8) 2px,
              rgba(0, 0, 0, 0.8) 4px
            )`,
          }}
        />
      )}

      {/* Random noise flicker */}
      {shouldFlicker && (
        <div
          style={{
            ...layerStyle,
            opacity: 0.1,
            pointerEvents: "none",
            background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      )}
    </div>
  );
};
