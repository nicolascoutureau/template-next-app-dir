import { useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Configuration for useWiggle.
 */
export type WiggleConfig = {
  /** Oscillations per second. Defaults to 2. */
  frequency?: number;
  /** Maximum deviation from 0. Defaults to 10. */
  amplitude?: number;
  /** Seed for deterministic output. Defaults to 0. */
  seed?: number;
  /** Complexity layers (more = more organic). Defaults to 2. */
  octaves?: number;
};

/**
 * Simple 1D noise function using sine waves.
 * Produces smooth, continuous random-looking values.
 */
function noise1D(x: number, seed: number): number {
  // Layer multiple sine waves with different frequencies for organic feel
  const s1 = Math.sin(x * 1.0 + seed * 12.9898);
  const s2 = Math.sin(x * 2.3 + seed * 78.233);
  const s3 = Math.sin(x * 4.1 + seed * 43.758);
  return (s1 + s2 * 0.5 + s3 * 0.25) / 1.75;
}

/**
 * Multi-octave noise for more complex, organic movement.
 */
function fbm(x: number, seed: number, octaves: number): number {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    value += noise1D(x * frequency, seed + i * 100) * amplitude;
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return value / maxValue;
}

/**
 * `useWiggle` returns a smoothly varying number around 0 using noise.
 * AE's wiggle() is arguably the most-used expression — it creates
 * slight position jitter, rotation wobble, scale breathing that
 * makes static elements feel alive.
 *
 * @example
 * ```tsx
 * // Subtle position jitter
 * const offsetX = useWiggle({ frequency: 2, amplitude: 5 });
 * const offsetY = useWiggle({ frequency: 2, amplitude: 5, seed: 1 });
 * 
 * return (
 *   <div style={{ transform: `translate(${offsetX}px, ${offsetY}px)` }}>
 *     Content
 *   </div>
 * );
 *
 * // Rotation wobble
 * const rotation = useWiggle({ frequency: 1.5, amplitude: 3 });
 * 
 * // Scale breathing
 * const scale = 1 + useWiggle({ frequency: 0.5, amplitude: 0.05 });
 *
 * // Complex organic motion
 * const drift = useWiggle({ frequency: 0.8, amplitude: 20, octaves: 3 });
 * ```
 */
export function useWiggle(config: WiggleConfig = {}): number {
  const {
    frequency = 2,
    amplitude = 10,
    seed = 0,
    octaves = 2,
  } = config;

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Convert frame to time for frequency-based oscillation
  const time = frame / fps;
  const x = time * frequency;

  // Get noise value (-1 to 1) and scale by amplitude
  const noiseValue = fbm(x, seed, octaves);
  
  return noiseValue * amplitude;
}
