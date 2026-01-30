import React, { useId, useMemo } from "react";
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";

/**
 * Noise blend modes.
 */
export type NoiseBlendMode = 
  | "overlay" 
  | "multiply" 
  | "screen" 
  | "soft-light" 
  | "hard-light" 
  | "difference" 
  | "exclusion";

/**
 * Props for Noise component.
 */
export interface NoiseProps {
  /** Opacity of the noise (0-1) */
  opacity?: number;
  /** Scale of the noise pattern (higher = larger grain) */
  scale?: number;
  /** Animation speed multiplier */
  speed?: number;
  /** Blend mode for mixing with content below */
  blendMode?: NoiseBlendMode;
  /** Enable chromatic/color noise */
  chromatic?: boolean;
  /** Base frequency X */
  baseFrequencyX?: number;
  /** Base frequency Y */
  baseFrequencyY?: number;
  /** Number of octaves (detail level) */
  numOctaves?: number;
  /** Random seed */
  seed?: string | number;
  /** Additional CSS styles */
  style?: React.CSSProperties;
  /** Additional CSS class names */
  className?: string;
  children?: React.ReactNode;
}

/**
 * Procedural noise generator using SVG feTurbulence.
 * High performance, infinite resolution, professional film grain look.
 * 
 * @example
 * // Subtle film grain
 * <Noise opacity={0.05} scale={1} />
 * 
 * @example
 * // Artistic chromatic noise
 * <Noise 
 *   opacity={0.15} 
 *   chromatic 
 *   scale={2} 
 *   blendMode="soft-light" 
 * />
 * 
 * @example
 * // Static texture background
 * <Noise speed={0} opacity={0.1} baseFrequencyX={0.02} baseFrequencyY={0.5} />
 */
export const Noise: React.FC<NoiseProps> = ({
  opacity = 0.05,
  scale = 1,
  speed = 1,
  blendMode = "overlay",
  chromatic = false,
  baseFrequencyX = 0.7,
  baseFrequencyY = 0.7,
  numOctaves = 3,
  seed = "noise",
  style,
  className,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Unique ID for SVG filter to prevent conflicts
  const id = `noise-filter-${useId().replace(/:/g, "-")}`;
  
  // Animate seed for moving grain
  const currentSeed = useMemo(() => {
    if (speed === 0) return typeof seed === 'number' ? seed : 0;
    // Change seed every frame or few frames based on speed
    // For standard film grain, it changes every frame
    const speedFactor = Math.max(0.1, speed);
    return Math.floor(frame * speedFactor) + (typeof seed === 'number' ? seed : 0);
  }, [frame, speed, seed]);

  // Adjust base frequency by scale
  // Higher scale prop = lower frequency value = larger grain
  const bfX = baseFrequencyX / scale;
  const bfY = baseFrequencyY / scale;

  return (
    <AbsoluteFill 
      className={className}
      style={{
        pointerEvents: "none",
        ...style
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity,
          mixBlendMode: blendMode,
        }}
      >
        <defs>
          <filter id={id} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={`${bfX} ${bfY}`}
              numOctaves={numOctaves}
              stitchTiles="stitch"
              seed={currentSeed}
              result="noise"
            />
            {!chromatic && (
              <feColorMatrix
                type="saturate"
                values="0"
                in="noise"
                result="noise"
              />
            )}
            {/* Optional contrast boost if needed */}
            {/* <feComponentTransfer in="noise" result="noise">
                <feFuncA type="linear" slope="1" intercept="0" />
            </feComponentTransfer> */}
          </filter>
        </defs>
        <rect width="100%" height="100%" filter={`url(#${id})`} fill="transparent" />
      </svg>
      {children}
    </AbsoluteFill>
  );
};

export default Noise;
