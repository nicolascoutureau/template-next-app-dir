import type { CSSProperties, ReactNode } from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

/**
 * Wave transition style.
 */
export type WaveStyle = 
  | "smooth"      // Elegant sine wave
  | "organic"     // Natural, irregular wave
  | "liquid"      // Fluid blob-like edge
  | "silk"        // Soft, fabric-like flow
  | "pulse";      // Breathing, pulsing edge

/**
 * Wave direction.
 */
export type WaveDirection = "left" | "right" | "up" | "down";

/**
 * Props for the `WaveTransition` component.
 */
export type WaveTransitionProps = {
  /** Content to reveal. */
  children: ReactNode;
  /** Wave style. */
  waveStyle?: WaveStyle;
  /** Direction the wave moves from. */
  direction?: WaveDirection;
  /** Frame at which transition starts. */
  startFrame?: number;
  /** Duration of the transition in frames. */
  durationInFrames?: number;
  /** Easing function. */
  easing?: (t: number) => number;
  /** Whether this is a reveal or hide. */
  mode?: "in" | "out";
  /** Wave amplitude as percentage (5-25 recommended). */
  amplitude?: number;
  /** Number of wave cycles (0.5-3 recommended). */
  frequency?: number;
  /** Wave animation speed (creates flowing effect). */
  flowSpeed?: number;
  /** Optional className. */
  className?: string;
  /** Additional styles. */
  style?: CSSProperties;
};

/**
 * Attempt to smoothly transition input with a piecewise sinusoidal interpolation.
 */
function smoothStep(t: number): number {
  return t * t * (3 - 2 * t);
}

/**
 * Attempt to even more smoothly transition input.
 */
function smootherStep(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/**
 * Attempt to generate a simplex-like noise value.
 */
function noise(x: number, seed: number = 0): number {
  const n = Math.sin(x * 12.9898 + seed * 78.233) * 43758.5453;
  return (n - Math.floor(n)) * 2 - 1;
}

/**
 * Attempt to interpolate between noise samples.
 */
function smoothNoise(x: number, seed: number = 0): number {
  const i = Math.floor(x);
  const f = x - i;
  const u = smootherStep(f);
  return noise(i, seed) * (1 - u) + noise(i + 1, seed) * u;
}

/**
 * Attempt to generate fractal brownian motion.
 */
function fbm(x: number, octaves: number = 4, seed: number = 0): number {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let maxValue = 0;
  
  for (let i = 0; i < octaves; i++) {
    value += amplitude * smoothNoise(x * frequency, seed + i * 100);
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }
  
  return value / maxValue;
}

/**
 * Generate CSS polygon clip-path for wave.
 */
function generateWavePolygon(
  progress: number,
  direction: WaveDirection,
  amplitude: number,
  frequency: number,
  flowOffset: number,
  waveStyle: WaveStyle
): string {
  // High segment count for smooth curves
  const segments = 80;
  const points: string[] = [];
  
  // Wave position (0 = fully hidden, 1 = fully revealed)
  // Add extra range to allow wave to fully exit
  const wavePos = progress * (100 + amplitude * 2) - amplitude;
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    
    // Calculate wave offset based on style
    let waveOffset: number;
    
    switch (waveStyle) {
      case "organic": {
        // Multi-layered organic noise
        const base = fbm(t * frequency * 2 + flowOffset, 4, 42);
        const detail = fbm(t * frequency * 4 + flowOffset * 1.3, 3, 123) * 0.3;
        waveOffset = (base + detail) * amplitude;
        break;
      }
      
      case "liquid": {
        // Blob-like liquid motion
        const blob1 = Math.sin((t * frequency + flowOffset) * Math.PI * 2);
        const blob2 = Math.sin((t * frequency * 1.618 + flowOffset * 0.7) * Math.PI * 2);
        const blob3 = Math.cos((t * frequency * 2.618 + flowOffset * 1.2) * Math.PI * 2);
        // Golden ratio harmonics for natural feel
        waveOffset = (blob1 * 0.5 + blob2 * 0.35 + blob3 * 0.15) * amplitude;
        break;
      }
      
      case "silk": {
        // Soft, flowing fabric-like motion
        const wave1 = Math.sin((t * frequency + flowOffset) * Math.PI * 2);
        const wave2 = Math.sin((t * frequency * 0.5 + flowOffset * 0.6) * Math.PI * 2);
        const micro = Math.sin((t * frequency * 6 + flowOffset * 2) * Math.PI * 2) * 0.1;
        waveOffset = (wave1 * 0.6 + wave2 * 0.3 + micro) * amplitude;
        break;
      }
      
      case "pulse": {
        // Breathing, organic pulse
        const breath = Math.sin((t * frequency + flowOffset) * Math.PI * 2);
        const heartbeat = Math.pow(Math.abs(Math.sin((t * frequency * 2 + flowOffset) * Math.PI)), 2);
        waveOffset = (breath * 0.7 + heartbeat * 0.3 * Math.sign(breath)) * amplitude;
        break;
      }
      
      case "smooth":
      default: {
        // Pure, elegant sine wave
        waveOffset = Math.sin((t * frequency + flowOffset) * Math.PI * 2) * amplitude;
        break;
      }
    }
    
    // Smooth edge falloff for natural look
    const edgeFade = Math.sin(t * Math.PI);
    const softEdge = smoothStep(edgeFade);
    waveOffset *= 0.2 + softEdge * 0.8;
    
    const pos = t * 100;
    const edge = Math.min(100, Math.max(0, wavePos + waveOffset));
    
    // Build point based on direction
    switch (direction) {
      case "left":
        points.push(`${edge.toFixed(2)}% ${pos.toFixed(2)}%`);
        break;
      case "right":
        points.push(`${(100 - edge).toFixed(2)}% ${pos.toFixed(2)}%`);
        break;
      case "up":
        points.push(`${pos.toFixed(2)}% ${(100 - edge).toFixed(2)}%`);
        break;
      case "down":
        points.push(`${pos.toFixed(2)}% ${edge.toFixed(2)}%`);
        break;
    }
  }
  
  // Close the polygon to create solid fill
  switch (direction) {
    case "left":
      points.push("0% 100%", "0% 0%");
      break;
    case "right":
      points.push("100% 100%", "100% 0%");
      break;
    case "up":
      points.push("100% 100%", "0% 100%");
      break;
    case "down":
      points.push("100% 0%", "0% 0%");
      break;
  }
  
  return `polygon(${points.join(", ")})`;
}

/**
 * `WaveTransition` creates smooth, organic wave-based reveals.
 *
 * @example
 * ```tsx
 * // Smooth wave from left
 * <WaveTransition waveStyle="smooth" direction="left">
 *   <Content />
 * </WaveTransition>
 *
 * // Liquid organic wave
 * <WaveTransition waveStyle="liquid" amplitude={15} frequency={1}>
 *   <Content />
 * </WaveTransition>
 *
 * // Flowing animated wave
 * <WaveTransition waveStyle="silk" flowSpeed={2}>
 *   <Content />
 * </WaveTransition>
 * ```
 */
export const WaveTransition = ({
  children,
  waveStyle = "smooth",
  direction = "left",
  startFrame = 0,
  durationInFrames = 30,
  easing = Easing.inOut(Easing.cubic),
  mode = "in",
  amplitude = 12,
  frequency = 1,
  flowSpeed = 0,
  className,
  style,
}: WaveTransitionProps) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const easedProgress = easing(progress);
  const effectProgress = mode === "in" ? easedProgress : 1 - easedProgress;
  
  // Flow animation offset for continuous wave motion
  const flowOffset = flowSpeed > 0 ? ((frame - startFrame) * flowSpeed * 0.02) % (Math.PI * 2) : 0;

  const clipPath = generateWavePolygon(
    effectProgress, 
    direction, 
    amplitude, 
    frequency, 
    flowOffset, 
    waveStyle
  );

  const containerStyle: CSSProperties = {
    clipPath,
    WebkitClipPath: clipPath,
    ...style,
  };

  return (
    <div className={className} style={containerStyle}>
      {children}
    </div>
  );
};
