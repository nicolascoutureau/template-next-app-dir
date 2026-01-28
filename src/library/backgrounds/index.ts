/**
 * @module backgrounds
 *
 * A collection of subtle, premium shader backgrounds for motion design videos.
 * Designed for elegance: slow breathing motion, muted palettes, soft edges.
 * All backgrounds work seamlessly with Remotion and React Three Fiber.
 */

// Simple CSS gradient (unchanged - already minimal)
export {
  GradientBackground,
  type GradientBackgroundProps,
  type GradientType,
} from "./GradientBackground";

// Subtle flowing gradient with organic movement
export {
  FluidGradient,
  type FluidGradientProps,
  // Deprecated aliases for backward compatibility
  LavaShader,
  type LavaShaderProps,
} from "./LavaShader";

// Subtle aurora/wave effect with gentle color transitions
export {
  AuroraBackground,
  type AuroraBackgroundProps,
  type AuroraStyle,
  // Deprecated aliases for backward compatibility
  PlasmaBackground,
  type PlasmaBackgroundProps,
  type PlasmaStyle,
} from "./PlasmaBackground";

// Soft organic blobs with gentle breathing motion
export {
  SoftBlobs,
  type SoftBlobsProps,
  // Deprecated aliases for backward compatibility
  MetaballsBackground,
  type MetaballsBackgroundProps,
} from "./MetaballsBackground";

// Minimal grid pattern with optional breathing
export {
  SubtleGrid,
  type SubtleGridProps,
  // Deprecated aliases for backward compatibility
  WaveGridBackground,
  type WaveGridBackgroundProps,
} from "./WaveGridBackground";

// Soft floating gradient orbs with slow motion
export { GradientOrbs, type GradientOrbsProps } from "./GradientOrbs";
