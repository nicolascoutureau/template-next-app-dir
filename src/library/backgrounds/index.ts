/**
 * @module backgrounds
 *
 * A collection of performant shader backgrounds for motion design videos.
 * All backgrounds are designed to work seamlessly with Remotion and React Three Fiber.
 * 
 * All backgrounds are optimized for real-time performance.
 */

// Simple CSS gradient
export {
  GradientBackground,
  type GradientBackgroundProps,
  type GradientType,
} from "./GradientBackground";

// Lava/Magma shader
export { LavaShader, type LavaShaderProps } from "./LavaShader";

// Classic plasma effect (fast - only sin functions)
export {
  PlasmaBackground,
  type PlasmaBackgroundProps,
  type PlasmaStyle,
} from "./PlasmaBackground";

// Organic metaballs/blobs (fast - simple math)
export {
  MetaballsBackground,
  type MetaballsBackgroundProps,
} from "./MetaballsBackground";

// Retro wave grid (fast - simple math)
export {
  WaveGridBackground,
  type WaveGridBackgroundProps,
} from "./WaveGridBackground";

// Floating gradient orbs (fast - distance calculations)
export { GradientOrbs, type GradientOrbsProps } from "./GradientOrbs";
