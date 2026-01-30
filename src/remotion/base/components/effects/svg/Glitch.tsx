import React, {
  useMemo,
  useId,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useCurrentFrame, useVideoConfig, random } from "remotion";

/**
 * Glitch effect types.
 */
export type GlitchType = "rgbSplit" | "scanlines" | "blocks" | "noise" | "full";

/**
 * Props for Glitch component.
 */
export interface GlitchProps {
  children: ReactNode;
  /** Type of glitch effect */
  type?: GlitchType;
  /** Effect intensity (0-1) */
  intensity?: number;
  /** Enable animation */
  animate?: boolean;
  /** Animation speed */
  speed?: number;
  /** RGB split offset in pixels */
  rgbSplit?: number;
  /** RGB split angle in degrees */
  rgbAngle?: number;
  /** Scanline density (lines per 100px) */
  scanlineDensity?: number;
  /** Scanline opacity */
  scanlineOpacity?: number;
  /** Number of horizontal slices for block displacement */
  slices?: number;
  /** Block displacement amount in pixels */
  displacement?: number;
  /** Noise amount (0-1) */
  noise?: number;
  /** Flicker rate (probability per frame) */
  flickerRate?: number;
  /** Random seed */
  seed?: string;
  /** Additional CSS styles */
  style?: CSSProperties;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Digital glitch effects.
 *
 * @example
 * // RGB split / chromatic aberration
 * <Glitch type="rgbSplit" intensity={0.5} rgbSplit={5}>
 *   <Logo />
 * </Glitch>
 *
 * @example
 * // Scanlines
 * <Glitch type="scanlines" scanlineDensity={3} animate>
 *   <Content />
 * </Glitch>
 *
 * @example
 * // Full glitch effect
 * <Glitch type="full" intensity={0.7} animate>
 *   <Text>GLITCH</Text>
 * </Glitch>
 */
export const Glitch: React.FC<GlitchProps> = ({
  children,
  type = "rgbSplit",
  intensity = 0.5,
  animate = false,
  speed = 1,
  rgbSplit = 5,
  rgbAngle = 0,
  scanlineDensity = 3,
  scanlineOpacity = 0.3,
  slices = 5,
  displacement = 10,
  noise = 0.1,
  flickerRate = 0.1,
  seed = "glitch",
  style,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const filterId = useId();

  const time = frame / fps;
  const animatedIntensity = animate
    ? intensity *
      (0.5 + random(`${seed}-${Math.floor(time * speed * 10)}`) * 0.5)
    : intensity;

  // Check for flicker
  const isFlickering =
    animate && random(`${seed}-flicker-${frame}`) < flickerRate;
  const flickerIntensity = isFlickering
    ? animatedIntensity * 2
    : animatedIntensity;

  // RGB Split effect
  const rgbSplitStyle = useMemo((): CSSProperties => {
    if (type !== "rgbSplit" && type !== "full") return {};

    const offset = rgbSplit * flickerIntensity;
    const angleRad = (rgbAngle * Math.PI) / 180;
    const offsetX = Math.cos(angleRad) * offset;
    const offsetY = Math.sin(angleRad) * offset;

    return {
      position: "relative" as const,
    };
  }, [type, rgbSplit, flickerIntensity, rgbAngle]);

  // Generate scanlines SVG
  const scanlinesFilter = useMemo(() => {
    if (type !== "scanlines" && type !== "full") return null;

    const lineSpacing = 100 / scanlineDensity;
    const animOffset = animate ? (time * speed * 50) % lineSpacing : 0;

    return (
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <defs>
          <pattern
            id={`scanlines-${filterId}`}
            width="100%"
            height={`${lineSpacing}px`}
            patternUnits="userSpaceOnUse"
            y={animOffset}
          >
            <rect
              width="100%"
              height="1"
              fill={`rgba(0,0,0,${scanlineOpacity})`}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#scanlines-${filterId})`} />
      </svg>
    );
  }, [type, scanlineDensity, scanlineOpacity, animate, time, speed, filterId]);

  // Block displacement for slice effect
  const blockDisplacementStyle = useMemo((): CSSProperties => {
    if (type !== "blocks" && type !== "full") return {};
    if (!animate) return {};

    // Create random displacement per slice
    const sliceHeight = 100 / slices;
    const clipPaths: string[] = [];

    for (let i = 0; i < slices; i++) {
      const sliceRandom = random(
        `${seed}-slice-${i}-${Math.floor(time * speed * 5)}`,
      );
      if (sliceRandom < 0.3) {
        // This slice is displaced
        const sliceDisplacement =
          (random(`${seed}-disp-${i}-${frame}`) - 0.5) *
          displacement *
          2 *
          flickerIntensity;
        clipPaths.push(`
          rect(${i * sliceHeight}% 0, ${(i + 1) * sliceHeight}% 100%)
        `);
      }
    }

    return {};
  }, [
    type,
    slices,
    displacement,
    animate,
    time,
    speed,
    flickerIntensity,
    seed,
    frame,
  ]);

  // RGB split layers
  const rgbLayers = useMemo(() => {
    if (type !== "rgbSplit" && type !== "full") return null;

    const offset = rgbSplit * flickerIntensity;
    const angleRad = (rgbAngle * Math.PI) / 180;
    const offsetX = Math.cos(angleRad) * offset;
    const offsetY = Math.sin(angleRad) * offset;

    return (
      <>
        {/* Red channel */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            transform: `translate(${-offsetX}px, ${-offsetY}px)`,
            mixBlendMode: "screen",
            filter: "url(#red-channel)",
            opacity: 0.8,
          }}
        >
          {children}
        </div>
        {/* Blue channel */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            transform: `translate(${offsetX}px, ${offsetY}px)`,
            mixBlendMode: "screen",
            filter: "url(#blue-channel)",
            opacity: 0.8,
          }}
        >
          {children}
        </div>
        {/* SVG filters for color channels */}
        <svg style={{ position: "absolute", width: 0, height: 0 }}>
          <defs>
            <filter id="red-channel">
              <feColorMatrix
                type="matrix"
                values="1 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 1 0"
              />
            </filter>
            <filter id="blue-channel">
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0
                        0 0 0 0 0
                        0 0 1 0 0
                        0 0 0 1 0"
              />
            </filter>
          </defs>
        </svg>
      </>
    );
  }, [type, rgbSplit, flickerIntensity, rgbAngle, children]);

  // Noise overlay
  const noiseOverlay = useMemo(() => {
    if (type !== "noise" && type !== "full") return null;
    if (noise <= 0) return null;

    return (
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 20,
          opacity: noise * flickerIntensity,
        }}
      >
        <defs>
          <filter id={`noise-${filterId}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency={
                animate ? 0.8 + random(`${seed}-noise-${frame}`) * 0.2 : 0.9
              }
              numOctaves={3}
              seed={animate ? frame : 0}
              result="noise"
            />
            <feColorMatrix
              type="saturate"
              values="0"
              in="noise"
              result="monoNoise"
            />
            <feBlend in="SourceGraphic" in2="monoNoise" mode="overlay" />
          </filter>
        </defs>
        <rect
          width="100%"
          height="100%"
          filter={`url(#noise-${filterId})`}
          fill="transparent"
        />
      </svg>
    );
  }, [type, noise, flickerIntensity, animate, seed, frame, filterId]);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        ...style,
        ...rgbSplitStyle,
      }}
    >
      {/* Base content */}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>

      {/* RGB split layers */}
      {rgbLayers}

      {/* Scanlines */}
      {scanlinesFilter}

      {/* Noise */}
      {noiseOverlay}
    </div>
  );
};

export default Glitch;
