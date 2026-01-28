/**
 * @module backgrounds
 *
 * A collection of professional shader backgrounds for motion design videos.
 * All backgrounds are designed to work seamlessly with Remotion and React Three Fiber.
 */

// Simple CSS gradient
export {
  GradientBackground,
  type GradientBackgroundProps,
  type GradientType,
} from "./GradientBackground";

// Lava/Magma shader
export { LavaShader, type LavaShaderProps } from "./LavaShader";

// Stripe-style gradient mesh
export {
  StripeGradientMesh,
  type StripeGradientMeshProps,
} from "./StripeGradientMesh";

// Aurora/Northern lights
export { AuroraBackground, type AuroraBackgroundProps } from "./AuroraBackground";

// Noise-based gradients (Codrops style)
export {
  NoiseGradient,
  type NoiseGradientProps,
  type NoiseType,
} from "./NoiseGradient";

// Classic plasma effect
export {
  PlasmaBackground,
  type PlasmaBackgroundProps,
  type PlasmaStyle,
} from "./PlasmaBackground";

// Organic metaballs/blobs
export {
  MetaballsBackground,
  type MetaballsBackgroundProps,
} from "./MetaballsBackground";

// Retro wave grid
export {
  WaveGridBackground,
  type WaveGridBackgroundProps,
} from "./WaveGridBackground";

// Floating gradient orbs
export { GradientOrbs, type GradientOrbsProps } from "./GradientOrbs";

// Fluid/ink simulation
export {
  FluidSimulation,
  type FluidSimulationProps,
} from "./FluidSimulation";

// Space nebula
export { ParticleNebula, type ParticleNebulaProps } from "./ParticleNebula";
